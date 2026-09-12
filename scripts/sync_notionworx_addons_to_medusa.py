#!/usr/bin/env python3
"""Sync shared Notion Worx accessories/upgrades into Medusa as real products.

This script creates or updates one Medusa product per unique shared add-on option
from `product-addons.shared.generated.json`, then stamps all parent products with
linked accessory/upgrade product metadata.
"""

from __future__ import annotations

import argparse
import json
import os
import re
from collections import defaultdict
from dataclasses import dataclass, field
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

from sync_apparel_to_medusa import (
    DEFAULT_SITE_URL,
    JsonDict,
    REPO_ROOT,
    RegionContext,
    admin_headers,
    fetch_default_sales_channel_id,
    fetch_existing_products,
    fetch_region_context,
    http_json,
    read_json,
    write_json,
)

INVENTORY_ROOT = REPO_ROOT / "data" / "inventory" / "notionworx"
SHARED_ADDON_CATALOG_PATH = INVENTORY_ROOT / "product-addons.shared.generated.json"
ADDON_MEDUSA_LINKS_PATH = INVENTORY_ROOT / "product-addons.medusa.generated.json"
DEFAULT_PREVIEW_PATH = INVENTORY_ROOT / "medusa" / "addon-products-sync-preview.json"

DEFAULT_OPTION_TITLE = "Default option"
DEFAULT_OPTION_VALUE = "Default option value"


@dataclass
class AddOnOptionRecord:
    """Flattened shared add-on option ready for Medusa product sync."""

    option_id: str
    kind: str
    title: str
    price: float
    group_ids: list[str] = field(default_factory=list)
    group_titles: list[str] = field(default_factory=list)
    subgroup_ids: list[str] = field(default_factory=list)
    subgroup_titles: list[str] = field(default_factory=list)
    group_keys: list[str] = field(default_factory=list)
    parent_handles: list[str] = field(default_factory=list)
    image: str | None = None
    image_hover: str | None = None
    hover_title: str | None = None
    hover_description: str | None = None
    allows_quantity: bool | None = None
    min_quantity: int | None = None
    step: int | None = None

    @property
    def handle(self) -> str:
        return f"nw-addon-{sanitize_token(self.option_id.lower())}"

    @property
    def sku(self) -> str:
        return f"NW-ADDON-{sanitize_token(self.option_id.upper())}"


def unique_preserving_order(values: list[str]) -> list[str]:
    """Return unique non-empty strings without changing first-seen order."""
    seen: set[str] = set()
    result: list[str] = []

    for value in values:
        normalized = str(value or "").strip()
        if not normalized or normalized in seen:
            continue
        seen.add(normalized)
        result.append(normalized)

    return result


def sanitize_token(value: str) -> str:
    """Convert free-form text into a stable Medusa-safe token."""
    raw = "".join(character if character.isalnum() else "-" for character in value)
    return "-".join(segment for segment in raw.split("-") if segment) or "addon"


def read_string(value: Any) -> str | None:
    """Return a trimmed string or None."""
    if isinstance(value, str):
        normalized = value.strip()
        return normalized or None
    return None


def read_number(value: Any) -> float | None:
    """Return a finite float when possible."""
    if isinstance(value, (int, float)):
        return float(value)
    if isinstance(value, str) and value.strip():
        try:
            return float(value.strip())
        except ValueError:
            return None
    return None


def add_unique(target: list[str], *values: str | None) -> None:
    """Append strings into a list only once."""
    existing = set(target)
    for value in values:
        normalized = read_string(value)
        if normalized and normalized not in existing:
            target.append(normalized)
            existing.add(normalized)


def iter_group_options(group: JsonDict) -> list[tuple[JsonDict | None, JsonDict]]:
    """Return flattened group/subgroup option tuples."""
    result: list[tuple[JsonDict | None, JsonDict]] = []

    for subgroup in group.get("subgroups", []):
        if not isinstance(subgroup, dict):
            continue
        for option in subgroup.get("items", []):
            if isinstance(option, dict):
                result.append((subgroup, option))

    for option in group.get("items", []):
        if isinstance(option, dict):
            result.append((None, option))

    return result


def is_frame_type_group(group: JsonDict) -> bool:
    """Return whether a shared add-on group represents frame-type choices."""
    if str(group.get("selectionMode") or "").strip().lower() != "single":
        return False

    items = group.get("items", [])
    if not isinstance(items, list) or len(items) < 2:
        return False

    for item in items:
        if not isinstance(item, dict):
            return False
        metadata = item.get("metadata", {})
        source_field_name = (
            str(metadata.get("sourceFieldName") or "").strip().lower()
            if isinstance(metadata, dict)
            else ""
        )
        hover_description = str(item.get("hoverDescription") or "").strip().lower()
        if "frame type" not in source_field_name and "frame type" not in hover_description:
            return False

    return True


def load_shared_addon_catalog() -> tuple[dict[str, list[str]], dict[str, JsonDict]]:
    """Load parent->group and group payload mappings."""
    payload = read_json(SHARED_ADDON_CATALOG_PATH)
    products = payload.get("products", {})
    groups = payload.get("groups", {})
    return (
        {
            str(handle): [str(key) for key in keys if isinstance(key, str)]
            for handle, keys in products.items()
            if isinstance(handle, str) and isinstance(keys, list)
        },
        {
            str(group_key): group
            for group_key, group in groups.items()
            if isinstance(group_key, str) and isinstance(group, dict)
        },
    )


def build_option_records(
    products_by_handle: dict[str, list[str]],
    groups_by_key: dict[str, JsonDict],
) -> dict[str, AddOnOptionRecord]:
    """Build unique add-on option records keyed by shared option id."""
    option_records: dict[str, AddOnOptionRecord] = {}

    for parent_handle, group_keys in products_by_handle.items():
        for group_key in group_keys:
            group = groups_by_key.get(group_key)
            if not group:
                continue
            if is_frame_type_group(group):
                continue

            group_id = read_string(group.get("id")) or "add-ons"
            group_title = read_string(group.get("title")) or group_id

            for subgroup, option in iter_group_options(group):
                option_id = read_string(option.get("id"))
                title = read_string(option.get("title"))
                kind = read_string(option.get("kind"))
                price = read_number(((option.get("price") or {}).get("surcharge")))
                if not option_id or not title or not kind or price is None:
                    continue

                record = option_records.get(option_id)
                if record is None:
                    record = AddOnOptionRecord(
                        option_id=option_id,
                        kind=kind,
                        title=title,
                        price=price,
                        image=read_string(option.get("image")),
                        image_hover=read_string(option.get("imageHover")),
                        hover_title=read_string(option.get("hoverTitle")),
                        hover_description=read_string(option.get("hoverDescription")),
                        allows_quantity=option.get("allowsQuantity")
                        if isinstance(option.get("allowsQuantity"), bool)
                        else None,
                        min_quantity=int(option.get("minQuantity"))
                        if read_number(option.get("minQuantity")) is not None
                        else None,
                        step=int(option.get("step"))
                        if read_number(option.get("step")) is not None
                        else None,
                    )
                    option_records[option_id] = record

                add_unique(record.group_ids, group_id)
                add_unique(record.group_titles, group_title)
                add_unique(record.group_keys, group_key)
                add_unique(record.parent_handles, parent_handle)

                if subgroup:
                    add_unique(record.subgroup_ids, read_string(subgroup.get("id")))
                    add_unique(record.subgroup_titles, read_string(subgroup.get("title")))

                if record.image is None:
                    record.image = read_string(option.get("image"))
                if record.image_hover is None:
                    record.image_hover = read_string(option.get("imageHover"))
                if record.hover_title is None:
                    record.hover_title = read_string(option.get("hoverTitle"))
                if record.hover_description is None:
                    record.hover_description = read_string(option.get("hoverDescription"))
                if record.allows_quantity is None and isinstance(
                    option.get("allowsQuantity"), bool
                ):
                    record.allows_quantity = option.get("allowsQuantity")
                if record.min_quantity is None and read_number(option.get("minQuantity")) is not None:
                    record.min_quantity = int(option.get("minQuantity"))
                if record.step is None and read_number(option.get("step")) is not None:
                    record.step = int(option.get("step"))

    return option_records


def build_addon_description(record: AddOnOptionRecord) -> str:
    """Return a lightweight PDP/cart-safe description for one add-on."""
    parts = [
        f"{record.kind.title()} add-on for Notion Worx canopy products.",
    ]

    if record.subgroup_titles:
        parts.append(f"Display group: {record.subgroup_titles[0]}.")
    elif record.group_titles:
        parts.append(f"Display group: {record.group_titles[0]}.")

    if record.hover_description:
        hover = record.hover_description.strip()
        if hover:
            parts.append(hover)

    parts.append("Price applies per configured parent product unit.")
    return " ".join(parts)


def build_addon_product_metadata(record: AddOnOptionRecord) -> JsonDict:
    """Build Medusa metadata for one standalone add-on product."""
    return {
        "source": "notionworx-shared-addon",
        "is_add_on_product": True,
        "source_add_on_option_id": record.option_id,
        "source_add_on_kind": record.kind,
        "source_add_on_title": record.title,
        "source_add_on_group_ids": record.group_ids,
        "source_add_on_group_titles": record.group_titles,
        "source_add_on_subgroup_ids": record.subgroup_ids,
        "source_add_on_subgroup_titles": record.subgroup_titles,
        "source_add_on_parent_handles": record.parent_handles,
        "source_add_on_parent_count": len(record.parent_handles),
        "source_add_on_price_surcharge": record.price,
        "source_add_on_hover_title": record.hover_title,
        "source_add_on_hover_description": record.hover_description,
        "source_add_on_allows_quantity": record.allows_quantity,
        "source_add_on_min_quantity": record.min_quantity,
        "source_add_on_step": record.step,
    }


def build_default_variant_payload(
    record: AddOnOptionRecord,
    region: RegionContext | None,
    *,
    existing_variant_id: str | None = None,
) -> JsonDict:
    """Build the one Medusa variant for a standalone add-on product."""
    price_entry: JsonDict = {
        "currency_code": region.currency_code if region else "usd",
        "amount": int(round(record.price * 100)),
    }
    if region:
        price_entry["rules"] = {"region_id": region.id}

    return {
        **({"id": existing_variant_id} if existing_variant_id else {}),
        "title": "Default variant",
        "sku": record.sku,
        "manage_inventory": False,
        "allow_backorder": True,
        "prices": [price_entry],
        "options": {DEFAULT_OPTION_TITLE: DEFAULT_OPTION_VALUE},
        "metadata": {
            "source_add_on_option_id": record.option_id,
            "source_add_on_kind": record.kind,
            "source_add_on_parent_handles": record.parent_handles,
            "source_sku": record.sku,
        },
    }


def build_addon_product_payload(
    record: AddOnOptionRecord,
    region: RegionContext | None,
    *,
    sales_channel_id: str | None,
    existing_product: JsonDict | None = None,
) -> JsonDict:
    """Build Medusa create/update payload for one standalone add-on product."""
    images = unique_preserving_order(
        [value for value in [record.image, record.image_hover] if isinstance(value, str)]
    )
    existing_option_id = None
    existing_variant_id = None
    if existing_product:
        existing_option_id = read_string((existing_product.get("options") or [{}])[0].get("id"))
        existing_variant_id = read_string((existing_product.get("variants") or [{}])[0].get("id"))

    payload: JsonDict = {
        "title": record.title,
        "handle": record.handle,
        "external_id": f"nwx-addon:{record.option_id}",
        "description": build_addon_description(record),
        "status": "published",
        "options": [
            {
                **({"id": existing_option_id} if existing_option_id else {}),
                "title": DEFAULT_OPTION_TITLE,
                "values": [DEFAULT_OPTION_VALUE],
            }
        ],
        "variants": [
            build_default_variant_payload(
                record,
                region,
                existing_variant_id=existing_variant_id,
            )
        ],
        "metadata": build_addon_product_metadata(record),
    }

    if images:
        payload["images"] = [{"url": url} for url in images]
        payload["thumbnail"] = images[0]

    if sales_channel_id:
        payload["sales_channels"] = [{"id": sales_channel_id}]

    return payload


def sync_addon_products(
    *,
    base_url: str,
    admin_api_key: str,
    option_records: dict[str, AddOnOptionRecord],
    existing_products: dict[str, JsonDict],
    region: RegionContext | None,
    sales_channel_id: str | None,
    apply: bool,
) -> tuple[dict[str, JsonDict], JsonDict]:
    """Create or update all standalone add-on products."""
    synced_links: dict[str, JsonDict] = {}
    summary: JsonDict = {
        "totalOptions": len(option_records),
        "create": [],
        "update": [],
        "failed": [],
    }

    for option_id, record in sorted(option_records.items()):
        existing_product = existing_products.get(record.handle)
        payload = build_addon_product_payload(
            record,
            region,
            sales_channel_id=sales_channel_id,
            existing_product=existing_product,
        )

        action = "update" if existing_product else "create"
        summary[action].append(record.handle)

        if not apply:
            synced_links[option_id] = {
                "id": read_string(existing_product.get("id")) if existing_product else None,
                "variant_id": read_string(
                    ((existing_product or {}).get("variants") or [{}])[0].get("id")
                )
                if existing_product
                else None,
                "handle": record.handle,
                "sku": record.sku,
                "kind": record.kind,
                "title": record.title,
                "price": record.price,
            }
            continue

        try:
            response = http_json(
                "POST",
                (
                    f"{base_url.rstrip('/')}/admin/products/{existing_product['id']}"
                    if existing_product and existing_product.get("id")
                    else f"{base_url.rstrip('/')}/admin/products"
                ),
                headers=admin_headers(admin_api_key),
                payload=payload,
            )
            product = response.get("product", {})
            variant = ((product.get("variants") or [{}])[0]) if isinstance(product, dict) else {}
            synced_links[option_id] = {
                "id": read_string(product.get("id")),
                "variant_id": read_string(variant.get("id")),
                "handle": record.handle,
                "sku": read_string(variant.get("sku")) or record.sku,
                "kind": record.kind,
                "title": record.title,
                "price": record.price,
            }
        except RuntimeError as exc:
            summary["failed"].append({"option_id": option_id, "handle": record.handle, "error": str(exc)})

    return synced_links, summary


OLD_ADDON_METADATA_KEYS = [
    "source_add_on_product_links",
    "sourceAddOnProductLinks",
    "source_accessory_product_ids",
    "sourceAccessoryProductIds",
    "source_upgrade_product_ids",
    "sourceUpgradeProductIds",
    "source_add_on_group_keys",
    "sourceAddOnGroupKeys",
]


def slugify_subgroup(value: str) -> str:
    """Convert a subgroup title into a metadata-safe token."""
    token = re.sub(r"[^A-Za-z0-9]+", "_", value.strip())
    token = re.sub(r"_+", "_", token).strip("_")
    return token or "General"


def build_simple_addon_key(kind: str, subgroup_title: str) -> str:
    """Build Accessories_Table_Cover / Upgrades_Vented_Top style keys."""
    prefix = "Upgrades" if kind.strip().lower() == "upgrade" else "Accessories"
    return f"{prefix}_{slugify_subgroup(subgroup_title)}"


def build_parent_simple_addon_metadata(
    *,
    group_keys: list[str],
    groups_by_key: dict[str, JsonDict],
    synced_links: dict[str, JsonDict],
) -> dict[str, str]:
    """Build simple comma-separated add-on metadata for one parent product."""
    buckets: dict[str, list[str]] = defaultdict(list)

    for group_key in group_keys:
        group = groups_by_key.get(group_key)
        if not group or is_frame_type_group(group):
            continue

        for subgroup, option in iter_group_options(group):
            option_id = read_string(option.get("id"))
            link = synced_links.get(option_id or "")
            product_id = str((link or {}).get("id") or "").strip()
            if not option_id or not product_id:
                continue

            kind = read_string(option.get("kind")) or "accessory"
            subgroup_title = (
                (read_string(subgroup.get("title")) if subgroup else None)
                or (read_string(subgroup.get("id")) if subgroup else None)
                or ("Upgrades" if kind.lower() == "upgrade" else "Accessories")
            )
            key = build_simple_addon_key(kind, subgroup_title)
            buckets[key].append(product_id)

    return {
        key: ", ".join(unique_preserving_order(product_ids))
        for key, product_ids in sorted(buckets.items())
        if product_ids
    }


def sync_parent_product_metadata(
    *,
    base_url: str,
    admin_api_key: str,
    products_by_handle: dict[str, list[str]],
    groups_by_key: dict[str, JsonDict],
    existing_products: dict[str, JsonDict],
    synced_links: dict[str, JsonDict],
    apply: bool,
) -> JsonDict:
    """Attach simple accessory/upgrade product metadata to all parent products."""
    summary: JsonDict = {
        "totalParents": len(products_by_handle),
        "updated": [],
        "missing": [],
        "failed": [],
    }

    for parent_handle, group_keys in sorted(products_by_handle.items()):
        existing_product = existing_products.get(parent_handle)
        if not existing_product or not existing_product.get("id"):
            summary["missing"].append(parent_handle)
            continue

        simple_fields = build_parent_simple_addon_metadata(
            group_keys=group_keys,
            groups_by_key=groups_by_key,
            synced_links=synced_links,
        )

        merged_metadata = dict(existing_product.get("metadata") or {})
        # Clear any previous simple keys so stale subgroups do not linger.
        for key in list(merged_metadata):
            if str(key).startswith(("Accessories_", "Upgrades_")):
                merged_metadata[key] = ""
        for old_key in OLD_ADDON_METADATA_KEYS:
            if old_key in merged_metadata:
                merged_metadata[old_key] = ""
        merged_metadata.update(simple_fields)
        summary["updated"].append(parent_handle)

        if not apply:
            continue

        try:
            http_json(
                "POST",
                f"{base_url.rstrip('/')}/admin/products/{existing_product['id']}",
                headers=admin_headers(admin_api_key),
                payload={"metadata": merged_metadata},
            )
        except RuntimeError as exc:
            summary["failed"].append({"handle": parent_handle, "error": str(exc)})

    return summary


def build_mapping_payload(synced_links: dict[str, JsonDict], parent_count: int) -> JsonDict:
    """Build the generated local option->Medusa product mapping file payload."""
    return {
        "schemaVersion": 1,
        "generatedAt": datetime.now(UTC).isoformat().replace("+00:00", "Z"),
        "optionCount": len(synced_links),
        "parentProductCount": parent_count,
        "options": synced_links,
    }


def parse_args() -> argparse.Namespace:
    """Parse CLI arguments."""
    parser = argparse.ArgumentParser(
        description="Sync shared Notion Worx add-ons into Medusa as real products.",
    )
    parser.add_argument("--apply", action="store_true", help="Write changes to Medusa.")
    parser.add_argument(
        "--base-url",
        default=os.environ.get("MEDUSA_BACKEND_URL", ""),
        help="Medusa backend URL.",
    )
    parser.add_argument(
        "--admin-api-key",
        default=os.environ.get("MEDUSA_ADMIN_API_KEY", ""),
        help="Medusa Admin API key.",
    )
    parser.add_argument(
        "--store-api-key",
        default=os.environ.get("MEDUSA_API_KEY", ""),
        help="Medusa publishable API key for region pricing.",
    )
    parser.add_argument(
        "--site-url",
        default=DEFAULT_SITE_URL,
        help="Public Notion Worx site URL used for external asset URLs.",
    )
    parser.add_argument(
        "--preview-path",
        type=Path,
        default=DEFAULT_PREVIEW_PATH,
        help="Where to write the dry-run/apply summary JSON.",
    )
    parser.add_argument(
        "--mapping-path",
        type=Path,
        default=ADDON_MEDUSA_LINKS_PATH,
        help="Where to write the generated add-on Medusa mapping JSON.",
    )
    return parser.parse_args()


def main() -> None:
    """Run the add-on product sync."""
    args = parse_args()
    base_url = str(args.base_url or "").strip().rstrip("/")
    admin_api_key = str(args.admin_api_key or "").strip()
    if not base_url or not admin_api_key:
        raise SystemExit("MEDUSA_BACKEND_URL and MEDUSA_ADMIN_API_KEY are required.")

    products_by_handle, groups_by_key = load_shared_addon_catalog()
    option_records = build_option_records(products_by_handle, groups_by_key)
    existing_products = fetch_existing_products(base_url, admin_api_key)
    region = fetch_region_context(base_url, str(args.store_api_key or "").strip() or None)
    sales_channel_id = fetch_default_sales_channel_id(base_url, admin_api_key)

    synced_links, addon_summary = sync_addon_products(
        base_url=base_url,
        admin_api_key=admin_api_key,
        option_records=option_records,
        existing_products=existing_products,
        region=region,
        sales_channel_id=sales_channel_id,
        apply=args.apply,
    )

    if args.apply:
        existing_products = fetch_existing_products(base_url, admin_api_key)

    parent_summary = sync_parent_product_metadata(
        base_url=base_url,
        admin_api_key=admin_api_key,
        products_by_handle=products_by_handle,
        groups_by_key=groups_by_key,
        existing_products=existing_products,
        synced_links=synced_links,
        apply=args.apply,
    )

    mapping_payload = build_mapping_payload(
        synced_links=synced_links,
        parent_count=len(products_by_handle),
    )

    summary: JsonDict = {
        "apply": bool(args.apply),
        "siteUrl": args.site_url,
        "optionCount": len(option_records),
        "parentProductCount": len(products_by_handle),
        "addOnProducts": addon_summary,
        "parentProducts": parent_summary,
        "mappingPath": str(args.mapping_path),
    }

    write_json(args.preview_path, summary)
    if args.apply:
        write_json(args.mapping_path, mapping_payload)

    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
