#!/usr/bin/env python3
"""Sync a mirrored Notion Worx inventory collection into Medusa.

This extends the existing APPAREL Medusa sync path with generic collection
support for the current hard-coded inventory mirror under
`data/inventory/notionworx`.

The script is dry-run-first:

- Without `--apply`, it writes a preview JSON payload.
- With `--apply`, it creates the target collection and any missing products,
  refreshes fidelity-critical metadata on existing products, uploads local
  images to Medusa, and verifies the final collection/product counts.
"""

from __future__ import annotations

import argparse
import json
import os
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from sync_apparel_to_medusa import (
    DEFAULT_SITE_URL,
    JsonDict,
    REPO_ROOT,
    RegionContext,
    admin_headers,
    create_collection_if_missing,
    create_missing_products,
    fetch_default_sales_channel_id,
    fetch_existing_products,
    fetch_region_context,
    http_json,
    join_public_url,
    read_json,
    sync_product_images,
    write_json,
)

INVENTORY_ROOT = REPO_ROOT / "data" / "inventory" / "notionworx"
INVENTORY_MANIFEST_PATH = INVENTORY_ROOT / "manifest.json"
STOREFRONT_GENERATED_PATH = INVENTORY_ROOT / "storefront.generated.ts"
SHARED_ADDON_CATALOG_PATH = INVENTORY_ROOT / "product-addons.shared.generated.json"
DEFAULT_PREVIEW_DIR = INVENTORY_ROOT / "medusa"
DEFAULT_OPTION_TITLES = {"default option", "default title", "title"}


@dataclass(frozen=True)
class SourceProductBundle:
    """Source records needed to build one Medusa product."""

    source_product: JsonDict
    manifest_record: JsonDict
    storefront_product: JsonDict
    add_on_group_keys: list[str]


def extract_exported_json_array(path: Path, export_name: str) -> list[JsonDict]:
    """Extract a JSON array from a generated TypeScript export."""
    text = path.read_text(encoding="utf-8")
    pattern = re.compile(
        rf"export const {re.escape(export_name)} = (\[.*?\]) as const;",
        re.DOTALL,
    )
    match = pattern.search(text)
    if not match:
        raise RuntimeError(f"Could not parse `{export_name}` from {path}.")
    return json.loads(match.group(1))


def load_storefront_products_by_handle() -> dict[str, JsonDict]:
    """Return generated storefront product supplements indexed by source handle."""
    storefront_products = extract_exported_json_array(
        STOREFRONT_GENERATED_PATH,
        "storefrontProducts",
    )
    return {
        product["sourceHandle"]: product
        for product in storefront_products
        if isinstance(product, dict) and isinstance(product.get("sourceHandle"), str)
    }


def load_shared_addon_keys_by_handle() -> dict[str, list[str]]:
    """Return shared add-on group keys indexed by source product handle."""
    payload = read_json(SHARED_ADDON_CATALOG_PATH)
    products = payload.get("products", {})
    if not isinstance(products, dict):
        return {}
    return {
        str(handle): [str(key) for key in keys if isinstance(key, str)]
        for handle, keys in products.items()
        if isinstance(keys, list)
    }


def load_collection_bundles(
    collection_handle: str,
) -> tuple[JsonDict, list[SourceProductBundle]]:
    """Load one inventory collection and all source product bundles."""
    manifest = read_json(INVENTORY_MANIFEST_PATH)
    collection_record = next(
        (
            record
            for record in manifest.get("collections", [])
            if record.get("handle") == collection_handle
        ),
        None,
    )
    if not collection_record:
        raise RuntimeError(
            f"Collection handle `{collection_handle}` not found in {INVENTORY_MANIFEST_PATH}."
        )

    collection = read_json(REPO_ROOT / Path(collection_record["filePath"]))
    product_records_by_handle = {
        record["handle"]: record
        for record in manifest.get("products", [])
        if record.get("handle")
    }
    storefront_products_by_handle = load_storefront_products_by_handle()
    shared_addon_keys_by_handle = load_shared_addon_keys_by_handle()

    bundles: list[SourceProductBundle] = []
    for handle in collection.get("productHandles", []):
        manifest_record = product_records_by_handle.get(handle)
        if not manifest_record:
            raise RuntimeError(
                f"Product handle `{handle}` is referenced by `{collection_handle}` but missing from the manifest."
            )
        source_product = read_json(REPO_ROOT / Path(manifest_record["dataPath"]))
        bundles.append(
            SourceProductBundle(
                source_product=source_product,
                manifest_record=manifest_record,
                storefront_product=storefront_products_by_handle.get(handle, {}),
                add_on_group_keys=shared_addon_keys_by_handle.get(handle, []),
            )
        )

    return collection, bundles


def unique_preserving_order(values: list[str]) -> list[str]:
    """Return unique strings without changing their first-seen order."""
    seen: set[str] = set()
    result: list[str] = []
    for value in values:
        if value in seen:
            continue
        seen.add(value)
        result.append(value)
    return result


def is_meaningful_option_name(name: str | None) -> bool:
    """Return whether an option name should be represented in Medusa."""
    normalized = (name or "").strip().lower()
    return bool(normalized) and normalized not in DEFAULT_OPTION_TITLES


def build_option_definitions(source_product: JsonDict) -> list[JsonDict]:
    """Build Medusa product options from the source product."""
    option_definitions: list[JsonDict] = []
    for option in source_product.get("options", []):
        name = str(option.get("name") or "").strip()
        if not is_meaningful_option_name(name):
            continue
        raw_values = [
            str(value).strip()
            for value in option.get("values", [])
            if str(value).strip()
        ]
        values = [
            value
            for value in raw_values
            if value.lower() not in {"default title", "default option value"}
        ]
        values = unique_preserving_order(values)
        if not values:
            continue
        option_definitions.append({"title": name, "values": values})
    return option_definitions


def build_source_variant_label(option_names: list[str], source_variant: JsonDict) -> str:
    """Build the storefront selector value for one source variant."""
    option_values = [
        str(value).strip()
        for value in source_variant.get("optionValues", [])
        if str(value).strip()
    ]
    if option_names and option_values:
        return " / ".join(option_values)

    title = str(source_variant.get("title") or "").strip()
    if title and title.lower() not in {"default title", "default variant"}:
        return title

    return "Default option"


def build_storefront_variant_catalog(
    source_product: JsonDict,
    *,
    option_definitions: list[JsonDict],
) -> tuple[str | None, list[str], list[JsonDict]]:
    """Build selector metadata mirroring the storefront's variant behavior."""
    option_names = [str(option["title"]) for option in option_definitions]
    source_variants = source_product.get("variants", [])
    entries: list[JsonDict] = []

    for source_variant in source_variants:
        if not isinstance(source_variant, dict):
            continue
        price = source_variant.get("price")
        if price is None:
            continue
        try:
            price_value = float(price)
        except (TypeError, ValueError):
            continue

        compare_at_price = source_variant.get("compareAtPrice")
        entry: JsonDict = {
            "value": build_source_variant_label(option_names, source_variant),
            "price": price_value,
        }
        if compare_at_price is not None:
            try:
                compare_at_value = float(compare_at_price)
            except (TypeError, ValueError):
                compare_at_value = None
            if compare_at_value is not None and compare_at_value > price_value:
                entry["compareAtPrice"] = compare_at_value
        entries.append(entry)

    if not entries:
        return None, [], []

    min_price = min(float(entry["price"]) for entry in entries)
    sizes: list[str] = []
    unique_entries: list[JsonDict] = []
    seen_values: set[str] = set()
    for entry in entries:
        value = str(entry["value"])
        if value in seen_values:
            continue
        seen_values.add(value)
        sizes.append(value)
        entry_copy = dict(entry)
        if float(entry_copy["price"]) == min_price:
            entry_copy["active"] = True
        unique_entries.append(entry_copy)

    variant_label = " / ".join(str(option["title"]) for option in option_definitions)
    if not variant_label:
        variant_label = None

    return variant_label, sizes, unique_entries


def sanitize_sku_seed(value: str) -> str:
    """Normalize a free-form value into a SKU-safe token."""
    token = re.sub(r"[^A-Z0-9]+", "-", value.upper()).strip("-")
    return token or "VARIANT"


def synthesize_variant_sku(
    *,
    product_handle: str,
    source_variant: JsonDict,
    variant_index: int,
    suffix_override: str | None = None,
) -> str:
    """Build a stable synthetic SKU for one source variant."""
    source_variant_id = source_variant.get("id")
    suffix = (
        suffix_override
        or (
            str(source_variant_id)
            if source_variant_id is not None
            else str(source_variant.get("sku") or "")
        ).strip()
        or f"{variant_index + 1}"
    )
    return f"NW-TENT-{sanitize_sku_seed(product_handle)}-{sanitize_sku_seed(suffix)}"


def resolve_variant_sku(
    *,
    product_handle: str,
    source_variant: JsonDict,
    variant_index: int,
) -> str:
    """Return the original SKU when valid, otherwise synthesize a stable one."""
    raw_sku = str(source_variant.get("sku") or "").strip()
    if raw_sku and raw_sku.lower() not in {"none", "null", "n/a"}:
        return raw_sku

    return synthesize_variant_sku(
        product_handle=product_handle,
        source_variant=source_variant,
        variant_index=variant_index,
    )


def ensure_unique_variant_skus(
    *,
    product_handle: str,
    source_variants: list[JsonDict],
    variants: list[JsonDict],
    reserved_skus: set[str] | None,
) -> list[JsonDict]:
    """Replace colliding variant SKUs with stable synthetic fallbacks."""
    if reserved_skus is None:
        return variants

    seen_in_payload: set[str] = set()
    for index, variant in enumerate(variants):
        sku = str(variant.get("sku") or "").strip()
        source_variant = source_variants[index] if index < len(source_variants) else {}

        if not sku or sku in seen_in_payload or sku in reserved_skus:
            variant["sku"] = synthesize_variant_sku(
                product_handle=product_handle,
                source_variant=source_variant,
                variant_index=index,
                suffix_override=sku or None,
            )
            sku = str(variant["sku"]).strip()

        seen_in_payload.add(sku)
        reserved_skus.add(sku)

    return variants


def collect_existing_variant_skus(existing_products: dict[str, JsonDict]) -> set[str]:
    """Return all non-empty variant SKUs currently present in Medusa."""
    skus: set[str] = set()
    for product in existing_products.values():
        for variant in product.get("variants", []):
            sku = str(variant.get("sku") or "").strip()
            if sku:
                skus.add(sku)
    return skus


def build_collection_payload(collection: JsonDict, *, site_url: str) -> JsonDict:
    """Build a Medusa collection payload for the mirrored inventory collection."""
    image_path = collection.get("image", {}).get("localPath") if collection.get("image") else None
    return {
        "title": collection["title"],
        "handle": collection["handle"],
        "metadata": {
            "source": "notionworx-inventory",
            "source_handle": collection["handle"],
            "source_title": collection["title"],
            "source_description": collection.get("description", ""),
            "source_products_count": collection.get("productsCount", 0),
            "source_image_path": image_path,
            "source_image_url": join_public_url(site_url, image_path),
            "inventory_data_path": f"/inventory/notionworx/collections/{collection['handle']}.json",
        },
    }


def build_variant_payload(
    source_variant: JsonDict,
    option_names: list[str],
    region: RegionContext | None,
    *,
    product_handle: str,
    variant_index: int,
) -> JsonDict:
    """Build one Medusa variant payload from the source inventory variant."""
    option_values = source_variant.get("optionValues", [])
    options_map = {
        option_name: str(option_values[index]).strip()
        for index, option_name in enumerate(option_names)
        if index < len(option_values) and str(option_values[index]).strip()
    }

    price_entry: JsonDict = {
        "currency_code": region.currency_code if region else "usd",
        "amount": int(round(float(source_variant.get("price") or 0) * 100)),
    }
    if region:
        price_entry["rules"] = {"region_id": region.id}

    compare_at_price = source_variant.get("compareAtPrice")
    return {
        "title": (
            str(source_variant.get("title") or "").strip() or "Default variant"
        ),
        "sku": resolve_variant_sku(
            product_handle=product_handle,
            source_variant=source_variant,
            variant_index=variant_index,
        ),
        "manage_inventory": False,
        "allow_backorder": True,
        "prices": [price_entry],
        "options": options_map,
        "metadata": {
            "source_variant_id": source_variant.get("id"),
            "source_requires_shipping": source_variant.get("requiresShipping"),
            "source_taxable": source_variant.get("taxable"),
            "source_grams": source_variant.get("grams"),
            "source_position": source_variant.get("position"),
            "source_sku": source_variant.get("sku"),
            "source_option_values": source_variant.get("optionValues", []),
            "source_compare_at_price": compare_at_price,
        },
    }


def build_default_variant_payload(
    source_variant: JsonDict,
    region: RegionContext | None,
    *,
    product_handle: str,
) -> JsonDict:
    """Build a default Medusa variant for single-variant products."""
    price_entry: JsonDict = {
        "currency_code": region.currency_code if region else "usd",
        "amount": int(round(float(source_variant.get("price") or 0) * 100)),
    }
    if region:
        price_entry["rules"] = {"region_id": region.id}

    title = str(source_variant.get("title") or "").strip()
    if not title or title.lower() in {"default title", "default variant"}:
        title = "Default variant"

    return {
        "title": title,
        "sku": resolve_variant_sku(
            product_handle=product_handle,
            source_variant=source_variant,
            variant_index=0,
        ),
        "manage_inventory": False,
        "allow_backorder": True,
        "prices": [price_entry],
        "options": {"Default option": "Default option value"},
        "metadata": {
            "source_variant_id": source_variant.get("id"),
            "source_requires_shipping": source_variant.get("requiresShipping"),
            "source_taxable": source_variant.get("taxable"),
            "source_grams": source_variant.get("grams"),
            "source_position": source_variant.get("position"),
            "source_sku": source_variant.get("sku"),
            "source_option_values": source_variant.get("optionValues", []),
            "source_compare_at_price": source_variant.get("compareAtPrice"),
        },
    }


def build_product_metadata(
    bundle: SourceProductBundle,
) -> JsonDict:
    """Build fidelity-critical Medusa metadata for one product."""
    source_product = bundle.source_product
    storefront_product = bundle.storefront_product
    option_definitions = build_option_definitions(source_product)
    variant_label, sizes, size_variants = build_storefront_variant_catalog(
        source_product,
        option_definitions=option_definitions,
    )

    return {
        "source": "notionworx-inventory",
        "source_handle": source_product.get("handle"),
        "source_product_id": source_product.get("id"),
        "source_slug": source_product.get("slug"),
        "source_vendor": source_product.get("vendor"),
        "source_product_type": source_product.get("productType"),
        "source_primary_category": source_product.get("primaryCategory"),
        "source_categories": source_product.get("categories", []),
        "source_price": source_product.get("price", {}),
        "source_tags": source_product.get("tags", []),
        "source_skus": [sku for sku in source_product.get("skus", []) if sku],
        "description_html": storefront_product.get("descriptionHtml")
        or source_product.get("descriptionHtml"),
        "description_text": storefront_product.get("descriptionText")
        or source_product.get("descriptionText"),
        "how_to_order_html": storefront_product.get("howToOrderHtml")
        or source_product.get("howToOrderHtml"),
        "how_to_order_text": storefront_product.get("howToOrderText")
        or source_product.get("howToOrderText"),
        "dimensions_html": storefront_product.get("dimensionsHtml"),
        "dimensions_text": storefront_product.get("dimensionsText"),
        "warranty_html": storefront_product.get("warrantyHtml"),
        "warranty_text": storefront_product.get("warrantyText"),
        "source_options": source_product.get("options", []),
        "source_variants": source_product.get("variants", []),
        "source_variant_label": storefront_product.get("variantLabel") or variant_label,
        "source_sizes": storefront_product.get("sizes", []) or sizes,
        "source_size_variants": storefront_product.get("sizeVariants", []) or size_variants,
        "source_filter_category": storefront_product.get("filterCategory", []),
        "source_filter_sizes": storefront_product.get("filterSizes", []),
        "source_reviews_text": storefront_product.get("reviewsText"),
        "source_badge_label": storefront_product.get("badgeLabel"),
        "source_badge_subtext": storefront_product.get("badgeSubtext"),
        "source_description": storefront_product.get("description"),
        "source_card_variant": storefront_product.get("cardVariant", ""),
        "source_add_on_group_keys": bundle.add_on_group_keys,
        "local_image_paths": [
            image.get("localPath")
            for image in source_product.get("images", [])
            if image.get("localPath")
        ],
        "inventory_data_path": bundle.manifest_record["dataPath"],
        "created_at": source_product.get("createdAt"),
        "updated_at": source_product.get("updatedAt"),
        "published_at": source_product.get("publishedAt"),
    }


def build_product_payload(
    bundle: SourceProductBundle,
    *,
    collection_id: str | None,
    sales_channel_id: str | None,
    site_url: str,
    region: RegionContext | None,
    reserved_skus: set[str] | None = None,
) -> JsonDict:
    """Build a Medusa admin create-product payload."""
    source_product = bundle.source_product
    images = [
        {"url": join_public_url(site_url, image.get("localPath"))}
        for image in source_product.get("images", [])
        if join_public_url(site_url, image.get("localPath"))
    ]
    thumbnail = images[0]["url"] if images else None
    option_definitions = build_option_definitions(source_product)
    source_variants = [
        variant
        for variant in source_product.get("variants", [])
        if isinstance(variant, dict)
    ]
    metadata = build_product_metadata(bundle)

    if option_definitions and source_variants:
        option_names = [str(option["title"]) for option in option_definitions]
        variants = [
            build_variant_payload(
                source_variant,
                option_names,
                region,
                product_handle=source_product["handle"],
                variant_index=index,
            )
            for index, source_variant in enumerate(source_variants)
        ]
        options = option_definitions
    else:
        default_source_variant = source_variants[0] if source_variants else {}
        variants = [
            build_default_variant_payload(
                default_source_variant,
                region,
                product_handle=source_product["handle"],
            )
        ]
        options = [{"title": "Default option", "values": ["Default option value"]}]

    variants = ensure_unique_variant_skus(
        product_handle=source_product["handle"],
        source_variants=source_variants or [default_source_variant],
        variants=variants,
        reserved_skus=reserved_skus,
    )

    payload: JsonDict = {
        "title": source_product["name"],
        "handle": source_product["handle"],
        "external_id": (
            str(source_product.get("id"))
            if source_product.get("id") is not None
            else None
        ),
        "description": metadata.get("description_text") or "",
        "status": "published",
        "images": images,
        "thumbnail": thumbnail,
        "options": options,
        "variants": variants,
        "metadata": metadata,
    }

    if collection_id:
        payload["collection_id"] = collection_id

    if sales_channel_id:
        payload["sales_channels"] = [{"id": sales_channel_id}]

    return payload


def build_product_update_payload(
    bundle: SourceProductBundle,
    *,
    collection_id: str | None,
    sales_channel_id: str | None,
) -> JsonDict:
    """Build a Medusa product update payload for metadata/content refreshes."""
    source_product = bundle.source_product
    metadata = build_product_metadata(bundle)

    payload: JsonDict = {
        "title": source_product["name"],
        "handle": source_product["handle"],
        "external_id": (
            str(source_product.get("id"))
            if source_product.get("id") is not None
            else None
        ),
        "description": metadata.get("description_text") or "",
        "status": "published",
        "metadata": metadata,
    }

    if collection_id:
        payload["collection_id"] = collection_id

    if sales_channel_id:
        payload["sales_channels"] = [{"id": sales_channel_id}]

    return payload


def sync_existing_product_data(
    base_url: str,
    admin_api_key: str,
    bundles: list[SourceProductBundle],
    existing_products: dict[str, JsonDict],
    *,
    collection_id: str | None,
    sales_channel_id: str | None,
) -> dict[str, Any]:
    """Refresh fidelity-critical metadata on existing Medusa products."""
    updated_handles: list[str] = []
    failed_products: list[dict[str, str]] = []

    for bundle in bundles:
        handle = bundle.source_product.get("handle")
        if not handle:
            continue
        existing = existing_products.get(handle)
        if not existing:
            failed_products.append(
                {"handle": handle, "error": "Product not found in Medusa."}
            )
            continue

        payload = build_product_update_payload(
            bundle,
            # Preserve an existing primary Medusa collection assignment so
            # overlapping collection syncs refresh fidelity metadata without
            # bouncing the product between collections.
            collection_id=existing.get("collection_id") or collection_id,
            sales_channel_id=sales_channel_id,
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

    return {"updated": updated_handles, "failed": failed_products}


def verify_collection_state(
    *,
    base_url: str,
    store_api_key: str,
    admin_api_key: str,
    collection_handle: str,
) -> JsonDict:
    """Fetch post-sync store/admin counts for one collection."""
    store_collections = http_json(
        "GET",
        f"{base_url.rstrip('/')}/store/collections?limit=250",
        headers={
            "Accept": "application/json",
            "x-publishable-api-key": store_api_key,
        },
    ).get("collections", [])
    admin_collections = http_json(
        "GET",
        f"{base_url.rstrip('/')}/admin/collections?limit=250",
        headers=admin_headers(admin_api_key),
    ).get("collections", [])

    store_collection = next(
        (collection for collection in store_collections if collection.get("handle") == collection_handle),
        None,
    )
    admin_collection = next(
        (collection for collection in admin_collections if collection.get("handle") == collection_handle),
        None,
    )

    store_products: list[JsonDict] = []
    if store_collection and store_collection.get("id"):
        store_products = http_json(
            "GET",
            f"{base_url.rstrip('/')}/store/products?collection_id={store_collection['id']}&limit=250",
            headers={
                "Accept": "application/json",
                "x-publishable-api-key": store_api_key,
            },
        ).get("products", [])

    admin_products: list[JsonDict] = []
    if admin_collection and admin_collection.get("id"):
        admin_products = http_json(
            "GET",
            f"{base_url.rstrip('/')}/admin/products?collection_id={admin_collection['id']}&limit=250",
            headers=admin_headers(admin_api_key),
        ).get("products", [])

    return {
        "storeCollectionId": store_collection.get("id") if store_collection else None,
        "adminCollectionId": admin_collection.get("id") if admin_collection else None,
        "storeProductsCount": len(store_products),
        "adminProductsCount": len(admin_products),
        "storeProductHandles": [
            product.get("handle") for product in store_products if product.get("handle")
        ],
        "adminProductHandles": [
            product.get("handle") for product in admin_products if product.get("handle")
        ],
    }


def parse_args() -> argparse.Namespace:
    """Parse CLI arguments."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--collection-handle",
        required=True,
        help="Inventory collection handle to sync (for example: tent).",
    )
    parser.add_argument(
        "--expected-products-count",
        type=int,
        default=None,
        help="Optional guardrail for the exact number of source products.",
    )
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
        help="Medusa store/publishable key used for reads and verification.",
    )
    parser.add_argument(
        "--site-url",
        default=os.environ.get("NOTION_WORX_SITE_URL", DEFAULT_SITE_URL),
        help="Public site base URL used to build absolute image URLs.",
    )
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Create/update the collection and products in Medusa.",
    )
    parser.add_argument(
        "--preview-path",
        default="",
        help="Optional preview output path. Defaults to data/inventory/notionworx/medusa/<handle>-preview.json.",
    )
    return parser.parse_args()


def main() -> None:
    """Build a dry-run preview or sync one mirrored inventory collection."""
    args = parse_args()
    collection, bundles = load_collection_bundles(args.collection_handle)

    if (
        args.expected_products_count is not None
        and len(bundles) != args.expected_products_count
    ):
        raise RuntimeError(
            f"Expected {args.expected_products_count} products for `{args.collection_handle}`, "
            f"found {len(bundles)}."
        )

    region = fetch_region_context(args.base_url, args.store_api_key or None)
    sales_channel_id = (
        fetch_default_sales_channel_id(args.base_url, args.admin_api_key)
        if args.admin_api_key
        else None
    )
    preview_path = (
        Path(args.preview_path)
        if args.preview_path
        else DEFAULT_PREVIEW_DIR / f"{args.collection_handle}-preview.json"
    )

    collection_payload = build_collection_payload(collection, site_url=args.site_url)
    product_payloads = [
        build_product_payload(
            bundle,
            collection_id=None,
            sales_channel_id=sales_channel_id,
            site_url=args.site_url,
            region=region,
        )
        for bundle in bundles
    ]

    preview_payload: JsonDict = {
        "baseUrl": args.base_url,
        "siteUrl": args.site_url,
        "mode": "apply" if args.apply else "dry-run",
        "collectionHandle": args.collection_handle,
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
    write_json(preview_path, preview_payload)

    if not args.apply:
        print(
            json.dumps(
                {
                    "mode": "dry-run",
                    "previewPath": str(preview_path),
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
            "MEDUSA_ADMIN_API_KEY is required with --apply."
        )

    collection_response = create_collection_if_missing(
        args.base_url,
        args.admin_api_key,
        collection_payload,
    )
    collection_id = collection_response["id"]
    existing_products_before_create = fetch_existing_products(
        args.base_url,
        args.admin_api_key,
    )
    reserved_skus = collect_existing_variant_skus(existing_products_before_create)

    product_payloads_with_collection = [
        build_product_payload(
            bundle,
            collection_id=collection_id,
            sales_channel_id=sales_channel_id,
            site_url=args.site_url,
            region=region,
            reserved_skus=reserved_skus,
        )
        for bundle in bundles
    ]
    product_result = create_missing_products(
        args.base_url,
        args.admin_api_key,
        product_payloads_with_collection,
    )

    existing_products = fetch_existing_products(args.base_url, args.admin_api_key)
    content_result = sync_existing_product_data(
        args.base_url,
        args.admin_api_key,
        bundles,
        existing_products,
        collection_id=collection_id,
        sales_channel_id=sales_channel_id,
    )
    existing_products = fetch_existing_products(args.base_url, args.admin_api_key)
    image_result = sync_product_images(
        args.base_url,
        args.admin_api_key,
        [bundle.source_product for bundle in bundles],
        existing_products,
    )
    verification = verify_collection_state(
        base_url=args.base_url,
        store_api_key=args.store_api_key,
        admin_api_key=args.admin_api_key,
        collection_handle=args.collection_handle,
    )

    print(
        json.dumps(
            {
                "mode": "apply",
                "previewPath": str(preview_path),
                "collectionId": collection_id,
                "collectionHandle": collection_payload["handle"],
                "sourceProductsCount": len(bundles),
                "createdProducts": len(product_result["created"]),
                "skippedProducts": len(product_result["skipped"]),
                "failedProducts": len(product_result["failed"]),
                "createdHandles": product_result["created"],
                "skippedHandles": product_result["skipped"],
                "createFailures": product_result["failed"],
                "contentUpdatedProducts": len(content_result["updated"]),
                "contentFailedProducts": len(content_result["failed"]),
                "contentUpdatedHandles": content_result["updated"],
                "contentFailures": content_result["failed"],
                "imageUpdatedProducts": len(image_result["updated"]),
                "imageSkippedProducts": len(image_result["skipped"]),
                "imageFailedProducts": len(image_result["failed"]),
                "uploadedImages": image_result["uploaded_images"],
                "imageUpdatedHandles": image_result["updated"],
                "imageFailures": image_result["failed"],
                "verification": verification,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
