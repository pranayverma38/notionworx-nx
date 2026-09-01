#!/usr/bin/env python3
"""Move APPAREL inventory into the obsolete data tree.

This script performs the first migration step from the hard-coded storefront
catalog toward Medusa-managed apparel data.

It moves the APPAREL collection plus every product referenced by that
collection from `data/inventory/notionworx` into `data/obselete/notionworx`,
updates remaining active collection JSON files so they no longer reference the
moved product handles, and rebuilds active/obsolete manifests.
"""

from __future__ import annotations

import json
import shutil
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parents[1]
ACTIVE_ROOT = REPO_ROOT / "data" / "inventory" / "notionworx"
OBSOLETE_ROOT = REPO_ROOT / "data" / "obselete" / "notionworx"
ACTIVE_MANIFEST_PATH = ACTIVE_ROOT / "manifest.json"
OBSOLETE_MANIFEST_PATH = OBSOLETE_ROOT / "manifest.json"
APPAREL_HANDLE = "apparel"
SCHEMA_VERSION = 2


JsonDict = dict[str, Any]


@dataclass(frozen=True)
class ProductRecord:
    """One product entry from the manifest."""

    handle: str
    name: str
    primary_category_handle: str
    primary_category_title: str
    data_path: str
    image_paths: list[str]

    @classmethod
    def from_manifest(cls, raw: JsonDict) -> "ProductRecord":
        """Build a typed record from a manifest object."""
        return cls(
            handle=str(raw["handle"]),
            name=str(raw["name"]),
            primary_category_handle=str(raw["primaryCategoryHandle"]),
            primary_category_title=str(raw["primaryCategoryTitle"]),
            data_path=str(raw["dataPath"]),
            image_paths=[str(path) for path in raw.get("imagePaths", [])],
        )

    def to_manifest(self) -> JsonDict:
        """Convert the record back into manifest JSON."""
        return {
            "handle": self.handle,
            "name": self.name,
            "primaryCategoryHandle": self.primary_category_handle,
            "primaryCategoryTitle": self.primary_category_title,
            "dataPath": self.data_path,
            "imagePaths": self.image_paths,
        }


@dataclass(frozen=True)
class CollectionRecord:
    """One collection entry from the manifest."""

    handle: str
    title: str
    products_count: int
    file_path: str

    @classmethod
    def from_manifest(cls, raw: JsonDict) -> "CollectionRecord":
        """Build a typed record from a manifest object."""
        return cls(
            handle=str(raw["handle"]),
            title=str(raw["title"]),
            products_count=int(raw["productsCount"]),
            file_path=str(raw["filePath"]),
        )

    def to_manifest(self) -> JsonDict:
        """Convert the record back into manifest JSON."""
        return {
            "handle": self.handle,
            "title": self.title,
            "productsCount": self.products_count,
            "filePath": self.file_path,
        }


def read_json(path: Path) -> JsonDict:
    """Read and parse JSON from disk."""
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def write_json(path: Path, payload: JsonDict) -> None:
    """Write JSON with stable formatting."""
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2, ensure_ascii=False)
        handle.write("\n")


def utc_timestamp() -> str:
    """Return an ISO 8601 timestamp with a UTC suffix."""
    return datetime.now(UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def inventory_relative_path(path_string: str) -> Path:
    """Convert a manifest path into a repo-relative Path."""
    return REPO_ROOT / Path(path_string)


def obsolete_path_for_inventory_path(path_string: str) -> Path:
    """Map an active inventory path into the obsolete inventory tree."""
    source = Path(path_string)
    prefix = Path("data") / "inventory" / "notionworx"
    suffix = source.relative_to(prefix)
    return Path("data") / "obselete" / "notionworx" / suffix


def maybe_move_file(source: Path, destination: Path) -> None:
    """Move a file if needed while keeping the operation idempotent."""
    destination.parent.mkdir(parents=True, exist_ok=True)

    if destination.exists():
        if source.exists():
            source.unlink()
        return

    if not source.exists():
        raise FileNotFoundError(f"Expected source file does not exist: {source}")

    shutil.move(str(source), str(destination))


def load_apparel_handles(collection_path: Path) -> list[str]:
    """Read the APPAREL collection file and return its product handles."""
    payload = read_json(collection_path)
    product_handles = payload.get("productHandles", [])
    if not isinstance(product_handles, list) or not product_handles:
        raise ValueError("APPAREL collection does not contain any product handles.")
    return [str(handle) for handle in product_handles]


def locate_apparel_collection_path() -> Path:
    """Locate the APPAREL collection file in active or obsolete storage."""
    active_path = ACTIVE_ROOT / "collections" / f"{APPAREL_HANDLE}.json"
    obsolete_path = OBSOLETE_ROOT / "collections" / f"{APPAREL_HANDLE}.json"

    if active_path.exists():
        return active_path
    if obsolete_path.exists():
        return obsolete_path

    raise FileNotFoundError("Unable to locate the APPAREL collection JSON file.")


def scrub_active_collection_files(moved_handles: set[str]) -> None:
    """Remove moved APPAREL product handles from the remaining active collections."""
    collections_dir = ACTIVE_ROOT / "collections"
    for collection_path in sorted(collections_dir.glob("*.json")):
        if collection_path.stem == APPAREL_HANDLE:
            continue

        payload = read_json(collection_path)
        product_handles = [str(handle) for handle in payload.get("productHandles", [])]
        filtered_handles = [
            handle for handle in product_handles if handle not in moved_handles
        ]

        if filtered_handles == product_handles:
            continue

        payload["productHandles"] = filtered_handles
        payload["productsCount"] = len(filtered_handles)
        write_json(collection_path, payload)


def build_collection_records(collection_paths: list[Path]) -> list[CollectionRecord]:
    """Rebuild manifest collection records from JSON files on disk."""
    records: list[CollectionRecord] = []
    for path in collection_paths:
        payload = read_json(path)
        records.append(
            CollectionRecord(
                handle=str(payload["handle"]),
                title=str(payload["title"]),
                products_count=int(payload.get("productsCount", 0)),
                file_path=str(path.relative_to(REPO_ROOT)),
            )
        )
    records.sort(key=lambda record: record.handle)
    return records


def build_manifest(
    *,
    product_records: list[ProductRecord],
    collection_records: list[CollectionRecord],
) -> JsonDict:
    """Build a manifest payload from active records."""
    category_folders = {
        Path(record.data_path).parent.name for record in product_records if record.data_path
    }

    return {
        "schemaVersion": SCHEMA_VERSION,
        "generatedAt": utc_timestamp(),
        "collectionCount": len(collection_records),
        "categoryFolderCount": len(category_folders),
        "productCount": len(product_records),
        "uncategorizedProductCount": sum(
            1 for record in product_records if record.primary_category_handle == "uncategorized"
        ),
        "imageCount": sum(len(record.image_paths) for record in product_records),
        "collections": [record.to_manifest() for record in collection_records],
        "products": [record.to_manifest() for record in product_records],
    }


def main() -> None:
    """Run the APPAREL-to-obsolete inventory migration."""
    active_manifest = read_json(ACTIVE_MANIFEST_PATH)
    active_collection_records = [
        CollectionRecord.from_manifest(item)
        for item in active_manifest.get("collections", [])
    ]
    active_product_records = [
        ProductRecord.from_manifest(item) for item in active_manifest.get("products", [])
    ]

    apparel_collection_path = locate_apparel_collection_path()
    apparel_handles = load_apparel_handles(apparel_collection_path)
    moved_handles = set(apparel_handles)

    moved_product_records: list[ProductRecord] = []
    remaining_product_records: list[ProductRecord] = []
    for record in active_product_records:
        if record.handle in moved_handles:
            moved_product_records.append(record)
        else:
            remaining_product_records.append(record)

    active_apparel_collection = next(
        (record for record in active_collection_records if record.handle == APPAREL_HANDLE),
        None,
    )
    if active_apparel_collection is None:
        active_apparel_collection = CollectionRecord(
            handle=APPAREL_HANDLE,
            title="APPAREL",
            products_count=len(apparel_handles),
            file_path=str(
                (
                    Path("data")
                    / "obselete"
                    / "notionworx"
                    / "collections"
                    / f"{APPAREL_HANDLE}.json"
                )
            ),
        )

    remaining_collection_records = [
        record for record in active_collection_records if record.handle != APPAREL_HANDLE
    ]

    obsolete_collection_source = inventory_relative_path(active_apparel_collection.file_path)
    obsolete_collection_destination = REPO_ROOT / obsolete_path_for_inventory_path(
        active_apparel_collection.file_path
    )
    maybe_move_file(obsolete_collection_source, obsolete_collection_destination)

    moved_records_with_new_paths: list[ProductRecord] = []
    for record in moved_product_records:
        source_path = inventory_relative_path(record.data_path)
        destination_relative = obsolete_path_for_inventory_path(record.data_path)
        destination_path = REPO_ROOT / destination_relative
        maybe_move_file(source_path, destination_path)
        moved_records_with_new_paths.append(
            ProductRecord(
                handle=record.handle,
                name=record.name,
                primary_category_handle=record.primary_category_handle,
                primary_category_title=record.primary_category_title,
                data_path=str(destination_relative),
                image_paths=record.image_paths,
            )
        )

    scrub_active_collection_files(moved_handles)

    active_collection_paths = sorted((ACTIVE_ROOT / "collections").glob("*.json"))
    obsolete_collection_paths = sorted((OBSOLETE_ROOT / "collections").glob("*.json"))

    active_manifest_payload = build_manifest(
        product_records=sorted(remaining_product_records, key=lambda record: record.handle),
        collection_records=build_collection_records(active_collection_paths),
    )
    obsolete_manifest_payload = build_manifest(
        product_records=sorted(
            moved_records_with_new_paths,
            key=lambda record: record.handle,
        ),
        collection_records=build_collection_records(obsolete_collection_paths),
    )

    write_json(ACTIVE_MANIFEST_PATH, active_manifest_payload)
    write_json(OBSOLETE_MANIFEST_PATH, obsolete_manifest_payload)

    print(
        json.dumps(
            {
                "movedCollectionHandle": APPAREL_HANDLE,
                "movedProducts": len(moved_records_with_new_paths),
                "remainingActiveProducts": len(remaining_product_records),
                "obsoleteManifestPath": str(OBSOLETE_MANIFEST_PATH.relative_to(REPO_ROOT)),
                "activeManifestPath": str(ACTIVE_MANIFEST_PATH.relative_to(REPO_ROOT)),
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
