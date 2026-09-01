#!/usr/bin/env python3
"""Sync obsolete APPAREL inventory into Medusa.

The script is intentionally dry-run-first:

- Without `--apply`, it builds payloads and writes a preview JSON file.
- With `--apply`, it creates the APPAREL collection and any missing products in
  Medusa using the Admin API.

The current repository only has a Medusa store key configured. A real Admin API
token is still required to perform write operations.
"""

from __future__ import annotations

import argparse
import json
import mimetypes
import os
import tempfile
import uuid
from dataclasses import dataclass
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from PIL import Image


REPO_ROOT = Path(__file__).resolve().parents[1]
OBSOLETE_ROOT = REPO_ROOT / "data" / "obselete" / "notionworx"
OBSOLETE_MANIFEST_PATH = OBSOLETE_ROOT / "manifest.json"
APPAREL_COLLECTION_PATH = OBSOLETE_ROOT / "collections" / "apparel.json"
DEFAULT_SITE_URL = "https://notionworxcanopy.com"
DEFAULT_PREVIEW_PATH = (
    REPO_ROOT / "data" / "obselete" / "notionworx" / "medusa" / "apparel-sync-preview.json"
)


JsonDict = dict[str, Any]
MAX_UPLOAD_BYTES = 900_000
MAX_UPLOAD_DIMENSION = 1600


@dataclass(frozen=True)
class RegionContext:
    """Region pricing information for Medusa product creation."""

    id: str
    currency_code: str
    name: str


def read_json(path: Path) -> JsonDict:
    """Read JSON from disk."""
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def write_json(path: Path, payload: JsonDict) -> None:
    """Write JSON to disk with deterministic formatting."""
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2, ensure_ascii=False)
        handle.write("\n")


def join_public_url(site_url: str, path_value: str | None) -> str | None:
    """Join a site base URL with a public-relative path."""
    if not path_value:
        return None
    if path_value.startswith("http://") or path_value.startswith("https://"):
        return path_value
    return f"{site_url.rstrip('/')}/{path_value.lstrip('/')}"


def resolve_public_asset_file(path_value: str | None) -> Path | None:
    """Resolve a public asset path to a repo-local file."""
    if not path_value:
        return None
    relative_path = path_value.lstrip("/")
    file_path = REPO_ROOT / "public" / relative_path
    if not file_path.is_file():
        return None
    return file_path


def prepare_upload_file(file_path: Path, temp_dir: Path) -> Path:
    """Return a file ready for upload, resizing/compressing if needed."""
    if file_path.stat().st_size <= MAX_UPLOAD_BYTES:
        return file_path

    with Image.open(file_path) as source_image:
        image = source_image.copy()

    if max(image.size) > MAX_UPLOAD_DIMENSION:
        image.thumbnail((MAX_UPLOAD_DIMENSION, MAX_UPLOAD_DIMENSION))

    has_alpha = "A" in image.getbands() or "transparency" in image.info
    quality_steps = [82, 72, 62, 52]
    scale_steps = [1.0, 0.85, 0.7]

    for scale in scale_steps:
        working = image.copy()
        if scale < 1.0:
            width = max(1, int(working.width * scale))
            height = max(1, int(working.height * scale))
            working = working.resize((width, height))

        for quality in quality_steps:
            if has_alpha:
                prepared = working.convert("RGBA")
                candidate_path = temp_dir / f"{file_path.stem}-{quality}-{int(scale * 100)}.webp"
                prepared.save(
                    candidate_path,
                    format="WEBP",
                    quality=quality,
                    method=6,
                )
            else:
                prepared = working.convert("RGB")
                candidate_path = temp_dir / f"{file_path.stem}-{quality}-{int(scale * 100)}.jpg"
                prepared.save(
                    candidate_path,
                    format="JPEG",
                    quality=quality,
                    optimize=True,
                    progressive=True,
                )

            if candidate_path.stat().st_size <= MAX_UPLOAD_BYTES:
                return candidate_path

    return candidate_path


def load_apparel_inventory() -> tuple[JsonDict, list[JsonDict]]:
    """Load the obsolete APPAREL collection and its products."""
    collection = read_json(APPAREL_COLLECTION_PATH)
    manifest = read_json(OBSOLETE_MANIFEST_PATH)
    products_by_handle = {
        item["handle"]: item for item in manifest.get("products", []) if item.get("handle")
    }

    products: list[JsonDict] = []
    for handle in collection.get("productHandles", []):
        record = products_by_handle.get(handle)
        if not record:
            continue
        products.append(read_json(REPO_ROOT / Path(record["dataPath"])))

    return collection, products


def build_collection_payload(collection: JsonDict, *, site_url: str) -> JsonDict:
    """Build a Medusa collection create payload."""
    image_path = collection.get("image", {}).get("localPath") if collection.get("image") else None
    return {
        "title": collection["title"],
        "handle": collection["handle"],
        "metadata": {
            "source": "notionworx-obsolete",
            "source_handle": collection["handle"],
            "source_title": collection["title"],
            "source_description": collection.get("description", ""),
            "source_products_count": collection.get("productsCount", 0),
            "source_image_path": image_path,
            "source_image_url": join_public_url(site_url, image_path),
            "obsolete_data_path": f"/obselete/notionworx/collections/{collection['handle']}.json",
        },
    }


def build_variant_payload(
    variant: JsonDict,
    option_names: list[str],
    region: RegionContext | None,
) -> JsonDict:
    """Build a Medusa product variant payload."""
    option_values = variant.get("optionValues", [])
    options_map = {
        option_name: option_values[index]
        for index, option_name in enumerate(option_names)
        if index < len(option_values) and option_values[index]
    }

    price_entry: JsonDict = {
        "currency_code": region.currency_code if region else "usd",
        "amount": int(round(float(variant.get("price", 0)) * 100)),
    }
    if region:
        price_entry["rules"] = {"region_id": region.id}

    return {
        "title": variant.get("title") or "Default Variant",
        "sku": variant.get("sku"),
        "manage_inventory": False,
        "allow_backorder": True,
        "prices": [price_entry],
        "options": options_map,
        "metadata": {
            "source_variant_id": variant.get("id"),
            "source_requires_shipping": variant.get("requiresShipping"),
            "source_taxable": variant.get("taxable"),
            "source_grams": variant.get("grams"),
            "source_position": variant.get("position"),
        },
    }


def build_product_payload(
    product: JsonDict,
    *,
    collection_id: str | None,
    sales_channel_id: str | None,
    site_url: str,
    region: RegionContext | None,
) -> JsonDict:
    """Build a Medusa admin create-product payload."""
    images = [
        {"url": join_public_url(site_url, image.get("localPath"))}
        for image in product.get("images", [])
        if join_public_url(site_url, image.get("localPath"))
    ]
    thumbnail = images[0]["url"] if images else None
    source_options = product.get("options", [])
    source_variants = product.get("variants", [])
    source_skus = [sku for sku in product.get("skus", []) if sku]
    min_price = float(product.get("price", {}).get("min") or 0)
    synthetic_sku_seed = str(product.get("id") or product.get("handle") or "apparel")
    primary_sku = f"NW-APPAREL-{synthetic_sku_seed}"

    metadata = {
        "source": "notionworx-obsolete",
        "source_handle": product.get("handle"),
        "source_product_id": product.get("id"),
        "source_slug": product.get("slug"),
        "source_vendor": product.get("vendor"),
        "source_product_type": product.get("productType"),
        "source_primary_category": product.get("primaryCategory"),
        "source_categories": product.get("categories", []),
        "source_price": product.get("price", {}),
        "source_tags": product.get("tags", []),
        "source_skus": source_skus,
        "description_html": product.get("descriptionHtml"),
        "description_text": product.get("descriptionText"),
        "how_to_order_html": product.get("howToOrderHtml"),
        "how_to_order_text": product.get("howToOrderText"),
        "dimensions_html": product.get("dimensionsHtml"),
        "dimensions_text": product.get("dimensionsText"),
        "warranty_html": product.get("warrantyHtml"),
        "warranty_text": product.get("warrantyText"),
        "source_options": source_options,
        "source_variants": source_variants,
        "local_image_paths": [image.get("localPath") for image in product.get("images", [])],
        "obsolete_data_path": (
            f"/obselete/notionworx/products/{product['primaryCategory']['handle']}/{product['handle']}.json"
        ),
        "created_at": product.get("createdAt"),
        "updated_at": product.get("updatedAt"),
        "published_at": product.get("publishedAt"),
    }

    payload: JsonDict = {
        "title": product["name"],
        "handle": product["handle"],
        "external_id": str(product.get("id")) if product.get("id") is not None else None,
        "description": product.get("descriptionText") or "",
        "status": "published",
        "images": images,
        "thumbnail": thumbnail,
        "options": [{"title": "Default option", "values": ["Default option value"]}],
        "variants": [
            {
                "title": "Default variant",
                "sku": primary_sku,
                "manage_inventory": False,
                "allow_backorder": True,
                "options": {"Default option": "Default option value"},
                "prices": [
                    {
                        "currency_code": region.currency_code if region else "usd",
                        "amount": int(round(min_price * 100)),
                        **({"rules": {"region_id": region.id}} if region else {}),
                    }
                ],
                "metadata": {
                    "source_options": source_options,
                    "source_variants": source_variants,
                    "source_price": product.get("price", {}),
                },
            }
        ],
        "metadata": metadata,
    }

    if collection_id:
        payload["collection_id"] = collection_id

    if sales_channel_id:
        payload["sales_channels"] = [{"id": sales_channel_id}]

    return payload


def build_product_update_payload(
    product: JsonDict,
    *,
    collection_id: str | None,
    sales_channel_id: str | None,
    site_url: str,
    region: RegionContext | None,
) -> JsonDict:
    """Build an update payload that refreshes product fidelity fields."""
    create_payload = build_product_payload(
        product,
        collection_id=collection_id,
        sales_channel_id=sales_channel_id,
        site_url=site_url,
        region=region,
    )
    return {
        "title": create_payload["title"],
        "handle": create_payload["handle"],
        "external_id": create_payload.get("external_id"),
        "description": create_payload["description"],
        "status": create_payload["status"],
        "collection_id": create_payload.get("collection_id"),
        "sales_channels": create_payload.get("sales_channels"),
        "metadata": create_payload["metadata"],
    }


def http_json(
    method: str,
    url: str,
    *,
    headers: dict[str, str] | None = None,
    payload: JsonDict | None = None,
) -> JsonDict:
    """Send an HTTP request and decode the JSON response."""
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    request = Request(url=url, method=method, headers=headers or {}, data=data)

    try:
        with urlopen(request) as response:
            body = response.read().decode("utf-8")
            return json.loads(body) if body else {}
    except HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(
            f"{method} {url} failed with {exc.code}: {body}"
        ) from exc
    except URLError as exc:
        raise RuntimeError(f"{method} {url} failed: {exc}") from exc


def fetch_region_context(base_url: str, store_api_key: str | None) -> RegionContext | None:
    """Fetch the first store region so product prices can be region-scoped."""
    if not store_api_key:
        return None

    payload = http_json(
        "GET",
        f"{base_url.rstrip('/')}/store/regions",
        headers={
            "Accept": "application/json",
            "x-publishable-api-key": store_api_key,
        },
    )
    regions = payload.get("regions", [])
    if not regions:
        return None

    region = regions[0]
    region_id = region.get("id")
    currency_code = region.get("currency_code")
    if not region_id or not currency_code:
        return None

    return RegionContext(
        id=str(region_id),
        currency_code=str(currency_code),
        name=str(region.get("name", currency_code)),
    )


def admin_headers(admin_api_key: str) -> dict[str, str]:
    """Headers used for Medusa Admin API calls."""
    return {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": f"Basic {admin_api_key}",
    }


def upload_files(base_url: str, admin_api_key: str, file_paths: list[Path]) -> list[str]:
    """Upload local files to Medusa and return their hosted URLs."""
    uploaded_urls: list[str] = []

    for file_path in file_paths:
        boundary = f"----CursorBoundary{uuid.uuid4().hex}"
        mime_type = mimetypes.guess_type(file_path.name)[0] or "application/octet-stream"
        body = b"".join(
            [
                f"--{boundary}\r\n".encode("utf-8"),
                (
                    f'Content-Disposition: form-data; name="files"; '
                    f'filename="{file_path.name}"\r\n'
                ).encode("utf-8"),
                f"Content-Type: {mime_type}\r\n\r\n".encode("utf-8"),
                file_path.read_bytes(),
                b"\r\n",
                f"--{boundary}--\r\n".encode("utf-8"),
            ]
        )
        request = Request(
            url=f"{base_url.rstrip('/')}/admin/uploads",
            method="POST",
            headers={
                "Accept": "application/json",
                "Content-Type": f"multipart/form-data; boundary={boundary}",
                "Authorization": f"Basic {admin_api_key}",
            },
            data=body,
        )

        try:
            with urlopen(request) as response:
                payload = json.loads(response.read().decode("utf-8"))
        except HTTPError as exc:
            body = exc.read().decode("utf-8", errors="replace")
            raise RuntimeError(
                f"POST {base_url.rstrip('/')}/admin/uploads failed with {exc.code}: {body}"
            ) from exc
        except URLError as exc:
            raise RuntimeError(f"POST {base_url.rstrip('/')}/admin/uploads failed: {exc}") from exc

        uploaded_urls.extend(
            uploaded["url"] for uploaded in payload.get("files", []) if uploaded.get("url")
        )

    return uploaded_urls


def fetch_existing_collection(base_url: str, admin_api_key: str, handle: str) -> JsonDict | None:
    """Find an existing Medusa collection by handle."""
    payload = http_json(
        "GET",
        f"{base_url.rstrip('/')}/admin/collections?limit=200",
        headers=admin_headers(admin_api_key),
    )
    collections = payload.get("collections", [])
    return next(
        (collection for collection in collections if collection.get("handle") == handle),
        None,
    )


def fetch_existing_products(base_url: str, admin_api_key: str) -> dict[str, JsonDict]:
    """Fetch a handle-indexed map of existing Medusa admin products."""
    products: list[JsonDict] = []
    offset = 0
    limit = 250

    while True:
        payload = http_json(
            "GET",
            f"{base_url.rstrip('/')}/admin/products?limit={limit}&offset={offset}",
            headers=admin_headers(admin_api_key),
        )
        page = payload.get("products", [])
        if not page:
            break

        products.extend(page)
        offset += len(page)
        total = payload.get("count")
        if isinstance(total, int) and offset >= total:
            break

    return {
        str(product["handle"]): product
        for product in products
        if product.get("handle")
    }


def fetch_default_sales_channel_id(base_url: str, admin_api_key: str) -> str | None:
    """Fetch the default sales channel ID."""
    payload = http_json(
        "GET",
        f"{base_url.rstrip('/')}/admin/sales-channels?limit=20",
        headers=admin_headers(admin_api_key),
    )
    sales_channels = payload.get("sales_channels", [])
    if not sales_channels:
        return None
    return sales_channels[0].get("id")


def create_collection_if_missing(
    base_url: str,
    admin_api_key: str,
    payload: JsonDict,
) -> JsonDict:
    """Create the APPAREL collection if it doesn't already exist."""
    existing = fetch_existing_collection(base_url, admin_api_key, payload["handle"])
    if existing:
        return existing

    response = http_json(
        "POST",
        f"{base_url.rstrip('/')}/admin/collections",
        headers=admin_headers(admin_api_key),
        payload=payload,
    )
    return response["collection"]


def create_missing_products(
    base_url: str,
    admin_api_key: str,
    product_payloads: list[JsonDict],
) -> dict[str, Any]:
    """Create missing products directly, recording failures."""
    existing_products = fetch_existing_products(base_url, admin_api_key)
    created_handles: list[str] = []
    skipped_handles: list[str] = []
    failed_products: list[dict[str, str]] = []

    for payload in product_payloads:
        handle = payload["handle"]
        try:
            if handle in existing_products:
                skipped_handles.append(handle)
                continue

            http_json(
                "POST",
                f"{base_url.rstrip('/')}/admin/products",
                headers=admin_headers(admin_api_key),
                payload=payload,
            )
            created_handles.append(handle)
        except RuntimeError as exc:
            failed_products.append({"handle": handle, "error": str(exc)})

    return {
        "created": created_handles,
        "skipped": skipped_handles,
        "failed": failed_products,
    }


def sync_existing_product_data(
    base_url: str,
    admin_api_key: str,
    products: list[JsonDict],
    existing_products: dict[str, JsonDict],
    *,
    collection_id: str | None,
    sales_channel_id: str | None,
    site_url: str,
    region: RegionContext | None,
) -> dict[str, Any]:
    """Refresh fidelity-critical product fields for existing APPAREL products."""
    updated_handles: list[str] = []
    failed_products: list[dict[str, str]] = []

    for product in products:
        handle = product.get("handle")
        if not handle:
            continue

        existing = existing_products.get(handle)
        if not existing:
            failed_products.append({"handle": handle, "error": "Product not found in Medusa."})
            continue

        payload = build_product_update_payload(
            product,
            collection_id=collection_id,
            sales_channel_id=sales_channel_id,
            site_url=site_url,
            region=region,
        )

        try:
            http_json(
                "POST",
                f"{base_url.rstrip('/')}/admin/products/{existing['id']}",
                headers=admin_headers(admin_api_key),
                payload=payload,
            )
            updated_handles.append(handle)
        except RuntimeError as exc:
            failed_products.append({"handle": handle, "error": str(exc)})

    return {
        "updated": updated_handles,
        "failed": failed_products,
    }


def sync_product_images(
    base_url: str,
    admin_api_key: str,
    products: list[JsonDict],
    existing_products: dict[str, JsonDict],
) -> dict[str, Any]:
    """Upload local APPAREL images to Medusa and attach them to existing products."""
    updated_handles: list[str] = []
    skipped_handles: list[str] = []
    failed_products: list[dict[str, str]] = []
    uploaded_image_count = 0
    hosted_prefix = f"{base_url.rstrip('/')}/static/"
    with tempfile.TemporaryDirectory(prefix="medusa-apparel-images-") as temp_dir_name:
        temp_dir = Path(temp_dir_name)

        for product in products:
            handle = product.get("handle")
            if not handle:
                continue

            existing = existing_products.get(handle)
            if not existing:
                failed_products.append({"handle": handle, "error": "Product not found in Medusa."})
                continue

            local_files = [
                resolved
                for resolved in (
                    resolve_public_asset_file(image.get("localPath"))
                    for image in product.get("images", [])
                )
                if resolved is not None
            ]
            if not local_files:
                failed_products.append(
                    {"handle": handle, "error": "No local image files found for product."}
                )
                continue

            current_urls = [
                image.get("url")
                for image in existing.get("images", [])
                if isinstance(image, dict) and image.get("url")
            ]
            if len(current_urls) == len(local_files) and all(
                isinstance(url, str) and url.startswith(hosted_prefix) for url in current_urls
            ):
                skipped_handles.append(handle)
                continue

            prepared_files = [prepare_upload_file(file_path, temp_dir) for file_path in local_files]

            try:
                uploaded_urls = upload_files(base_url, admin_api_key, prepared_files)
                if len(uploaded_urls) != len(local_files):
                    raise RuntimeError(
                        f"Expected {len(local_files)} uploaded file URLs, got {len(uploaded_urls)}."
                    )

                uploaded_image_count += len(uploaded_urls)
                http_json(
                    "POST",
                    f"{base_url.rstrip('/')}/admin/products/{existing['id']}",
                    headers=admin_headers(admin_api_key),
                    payload={
                        "thumbnail": uploaded_urls[0],
                        "images": [{"url": url} for url in uploaded_urls],
                    },
                )
                updated_handles.append(handle)
            except RuntimeError as exc:
                failed_products.append({"handle": handle, "error": str(exc)})

    return {
        "updated": updated_handles,
        "skipped": skipped_handles,
        "failed": failed_products,
        "uploaded_images": uploaded_image_count,
    }


def parse_args() -> argparse.Namespace:
    """Parse CLI arguments."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--base-url",
        default=os.environ.get("MEDUSA_BACKEND_URL", "https://api.notionworxcanopy.com"),
        help="Medusa backend base URL.",
    )
    parser.add_argument(
        "--admin-api-key",
        default=os.environ.get("MEDUSA_ADMIN_API_KEY", ""),
        help="Medusa Admin API token used for write operations.",
    )
    parser.add_argument(
        "--store-api-key",
        default=os.environ.get("MEDUSA_API_KEY", ""),
        help="Medusa store/publishable key used to discover the default region.",
    )
    parser.add_argument(
        "--site-url",
        default=os.environ.get("NOTION_WORX_SITE_URL", DEFAULT_SITE_URL),
        help="Public site base URL used to turn local image paths into absolute URLs.",
    )
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Create the collection/products in Medusa instead of only generating a preview.",
    )
    parser.add_argument(
        "--preview-path",
        default=str(DEFAULT_PREVIEW_PATH),
        help="Where to write the dry-run preview JSON.",
    )
    return parser.parse_args()


def main() -> None:
    """Build a dry-run preview or sync obsolete APPAREL inventory to Medusa."""
    args = parse_args()
    collection, products = load_apparel_inventory()
    region = fetch_region_context(args.base_url, args.store_api_key or None)
    sales_channel_id = (
        fetch_default_sales_channel_id(args.base_url, args.admin_api_key)
        if args.admin_api_key
        else None
    )

    collection_payload = build_collection_payload(collection, site_url=args.site_url)
    collection_id = None

    product_payloads = [
        build_product_payload(
            product,
            collection_id=collection_id,
            sales_channel_id=sales_channel_id,
            site_url=args.site_url,
            region=region,
        )
        for product in products
    ]

    preview_payload = {
        "baseUrl": args.base_url,
        "siteUrl": args.site_url,
        "mode": "apply" if args.apply else "dry-run",
        "region": (
            {"id": region.id, "currency_code": region.currency_code, "name": region.name}
            if region
            else None
        ),
        "salesChannelId": sales_channel_id,
        "collection": collection_payload,
        "productsCount": len(product_payloads),
        "products": product_payloads,
    }
    write_json(Path(args.preview_path), preview_payload)

    if not args.apply:
        print(
            json.dumps(
                {
                    "mode": "dry-run",
                    "previewPath": args.preview_path,
                    "collectionHandle": collection_payload["handle"],
                    "productsPrepared": len(product_payloads),
                    "regionId": region.id if region else None,
                },
                indent=2,
            )
        )
        return

    if not args.admin_api_key:
        raise RuntimeError(
            "MEDUSA_ADMIN_API_KEY is required with --apply. The configured store key can only read store endpoints."
        )

    collection_response = create_collection_if_missing(
        args.base_url,
        args.admin_api_key,
        collection_payload,
    )
    collection_id = collection_response["id"]

    product_payloads_with_collection = [
        build_product_payload(
            product,
            collection_id=collection_id,
            sales_channel_id=sales_channel_id,
            site_url=args.site_url,
            region=region,
        )
        for product in products
    ]

    product_result = create_missing_products(
        args.base_url,
        args.admin_api_key,
        product_payloads_with_collection,
    )
    existing_products = fetch_existing_products(args.base_url, args.admin_api_key)
    product_update_result = sync_existing_product_data(
        args.base_url,
        args.admin_api_key,
        products,
        existing_products,
        collection_id=collection_id,
        sales_channel_id=sales_channel_id,
        site_url=args.site_url,
        region=region,
    )
    existing_products = fetch_existing_products(args.base_url, args.admin_api_key)
    image_result = sync_product_images(
        args.base_url,
        args.admin_api_key,
        products,
        existing_products,
    )

    print(
        json.dumps(
            {
                "mode": "apply",
                "previewPath": args.preview_path,
                "collectionId": collection_id,
                "collectionHandle": collection_payload["handle"],
                "createdProducts": len(product_result["created"]),
                "skippedProducts": len(product_result["skipped"]),
                "failedProducts": len(product_result["failed"]),
                "createdHandles": product_result["created"],
                "skippedHandles": product_result["skipped"],
                "failures": product_result["failed"],
                "contentUpdatedProducts": len(product_update_result["updated"]),
                "contentFailedProducts": len(product_update_result["failed"]),
                "contentUpdatedHandles": product_update_result["updated"],
                "contentFailures": product_update_result["failed"],
                "imageUpdatedProducts": len(image_result["updated"]),
                "imageSkippedProducts": len(image_result["skipped"]),
                "imageFailedProducts": len(image_result["failed"]),
                "uploadedImages": image_result["uploaded_images"],
                "imageUpdatedHandles": image_result["updated"],
                "imageFailures": image_result["failed"],
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
