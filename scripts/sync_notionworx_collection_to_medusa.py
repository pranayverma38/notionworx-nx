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
from collections import defaultdict
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
ADDON_MEDUSA_LINKS_PATH = INVENTORY_ROOT / "product-addons.medusa.generated.json"
DEFAULT_PREVIEW_DIR = INVENTORY_ROOT / "medusa"
DEFAULT_OPTION_TITLES = {"default option", "default title", "title"}

_addon_medusa_links_by_option_id: dict[str, JsonDict] | None = None


@dataclass(frozen=True)
class SourceProductBundle:
    """Source records needed to build one Medusa product."""

    source_product: JsonDict
    manifest_record: JsonDict
    storefront_product: JsonDict
    add_on_group_keys: list[str]
    shared_add_on_groups: list[JsonDict]


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


def load_shared_addon_groups_by_key() -> dict[str, JsonDict]:
    """Return shared add-on group payloads indexed by group key."""
    payload = read_json(SHARED_ADDON_CATALOG_PATH)
    groups = payload.get("groups", {})
    if not isinstance(groups, dict):
        return {}
    return {
        str(key): value
        for key, value in groups.items()
        if isinstance(value, dict)
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
    shared_addon_groups_by_key = load_shared_addon_groups_by_key()

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
                shared_add_on_groups=[
                    shared_addon_groups_by_key[key]
                    for key in shared_addon_keys_by_handle.get(handle, [])
                    if key in shared_addon_groups_by_key
                ],
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


def load_addon_medusa_links_by_option_id() -> dict[str, JsonDict]:
    """Return Medusa add-on products indexed by shared add-on option id."""
    global _addon_medusa_links_by_option_id

    if _addon_medusa_links_by_option_id is not None:
        return _addon_medusa_links_by_option_id

    if not ADDON_MEDUSA_LINKS_PATH.is_file():
        _addon_medusa_links_by_option_id = {}
        return _addon_medusa_links_by_option_id

    payload = read_json(ADDON_MEDUSA_LINKS_PATH)
    options = payload.get("options", {})
    if not isinstance(options, dict):
        _addon_medusa_links_by_option_id = {}
        return _addon_medusa_links_by_option_id

    _addon_medusa_links_by_option_id = {
        str(option_id): value
        for option_id, value in options.items()
        if isinstance(option_id, str) and isinstance(value, dict)
    }
    return _addon_medusa_links_by_option_id


def build_add_on_product_links(bundle: SourceProductBundle) -> list[JsonDict]:
    """Return linked Medusa add-on product metadata for one source product."""
    medusa_links_by_option_id = load_addon_medusa_links_by_option_id()
    if not medusa_links_by_option_id:
        return []

    effective_keys = set(get_effective_add_on_group_keys(bundle))
    links: list[JsonDict] = []

    for group_key, group in zip(bundle.add_on_group_keys, bundle.shared_add_on_groups):
        if group_key not in effective_keys or not isinstance(group, dict):
            continue

        group_id = str(group.get("id") or "").strip()
        group_title = str(group.get("title") or "").strip()

        for subgroup in group.get("subgroups", []):
            if not isinstance(subgroup, dict):
                continue

            subgroup_id = str(subgroup.get("id") or "").strip()
            subgroup_title = str(subgroup.get("title") or "").strip()
            for option in subgroup.get("items", []):
                if not isinstance(option, dict):
                    continue
                option_id = str(option.get("id") or "").strip()
                medusa_link = medusa_links_by_option_id.get(option_id)
                if not option_id or not medusa_link:
                    continue

                links.append(
                    {
                        "group_key": group_key,
                        "group_id": group_id,
                        "group_title": group_title,
                        "group_selection_mode": group.get("selectionMode"),
                        "group_max_selections": group.get("maxSelections"),
                        "subgroup_id": subgroup_id,
                        "subgroup_title": subgroup_title,
                        "subgroup_selection_mode": subgroup.get("selectionMode"),
                        "subgroup_max_selections": subgroup.get("maxSelections"),
                        "add_on_id": option_id,
                        "kind": option.get("kind"),
                        "title": option.get("title"),
                        "hover_title": option.get("hoverTitle"),
                        "hover_description": option.get("hoverDescription"),
                        "allows_quantity": option.get("allowsQuantity"),
                        "min_quantity": option.get("minQuantity"),
                        "max_quantity": option.get("maxQuantity"),
                        "step": option.get("step"),
                        "handle": medusa_link.get("handle"),
                        "sku": medusa_link.get("sku"),
                        "medusa_product_id": medusa_link.get("id"),
                        "medusa_variant_id": medusa_link.get("variant_id"),
                        "linked_storefront_product_id": medusa_link.get(
                            "linked_storefront_product_id"
                        ),
                        "linked_source_product_id": medusa_link.get(
                            "linked_source_product_id"
                        ),
                        "surcharge": ((option.get("price") or {}).get("surcharge")),
                    }
                )

        for option in group.get("items", []):
            if not isinstance(option, dict):
                continue
            option_id = str(option.get("id") or "").strip()
            medusa_link = medusa_links_by_option_id.get(option_id)
            if not option_id or not medusa_link:
                continue

            links.append(
                {
                    "group_key": group_key,
                    "group_id": group_id,
                    "group_title": group_title,
                    "group_selection_mode": group.get("selectionMode"),
                    "group_max_selections": group.get("maxSelections"),
                    "add_on_id": option_id,
                    "kind": option.get("kind"),
                    "title": option.get("title"),
                    "hover_title": option.get("hoverTitle"),
                    "hover_description": option.get("hoverDescription"),
                    "allows_quantity": option.get("allowsQuantity"),
                    "min_quantity": option.get("minQuantity"),
                    "max_quantity": option.get("maxQuantity"),
                    "step": option.get("step"),
                    "handle": medusa_link.get("handle"),
                    "sku": medusa_link.get("sku"),
                    "medusa_product_id": medusa_link.get("id"),
                    "medusa_variant_id": medusa_link.get("variant_id"),
                    "linked_storefront_product_id": medusa_link.get(
                        "linked_storefront_product_id"
                    ),
                    "linked_source_product_id": medusa_link.get(
                        "linked_source_product_id"
                    ),
                    "surcharge": ((option.get("price") or {}).get("surcharge")),
                }
            )

    return links


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


def is_frame_type_add_on_group(group: JsonDict) -> bool:
    """Return whether a shared add-on group represents Frame Type choices."""
    if str(group.get("selectionMode") or "").strip().lower() != "single":
        return False

    items = group.get("items", [])
    if not isinstance(items, list) or len(items) < 2:
        return False

    def looks_like_frame_type(item: JsonDict) -> bool:
        metadata = item.get("metadata", {})
        source_field_name = (
            str(metadata.get("sourceFieldName") or "").strip().lower()
            if isinstance(metadata, dict)
            else ""
        )
        hover_description = str(item.get("hoverDescription") or "").strip().lower()
        return "frame type" in source_field_name or "frame type" in hover_description

    return all(isinstance(item, dict) and looks_like_frame_type(item) for item in items)


def get_frame_type_add_on_group(
    bundle: SourceProductBundle,
) -> tuple[str | None, JsonDict | None]:
    """Return the shared Frame Type group key/payload when present."""
    for key, group in zip(bundle.add_on_group_keys, bundle.shared_add_on_groups):
        if is_frame_type_add_on_group(group):
            return key, group
    return None, None


def build_synthetic_frame_type_option_definitions(frame_type_group: JsonDict) -> list[JsonDict]:
    """Build a Medusa option definition from the shared Frame Type add-on group."""
    values = [
        str(item.get("title") or "").strip()
        for item in frame_type_group.get("items", [])
        if isinstance(item, dict) and str(item.get("title") or "").strip()
    ]
    values = unique_preserving_order(values)
    if not values:
        return []
    return [{"title": "Frame Type", "values": values}]


def build_synthetic_frame_type_source_variants(
    source_product: JsonDict,
    frame_type_group: JsonDict,
) -> list[JsonDict]:
    """Synthesize real variants from the shared Frame Type add-on choices."""
    base_variant = next(
        (
            variant
            for variant in source_product.get("variants", [])
            if isinstance(variant, dict)
        ),
        {},
    )
    base_price = float(base_variant.get("price") or source_product.get("price", {}).get("min") or 0)
    compare_at_raw = base_variant.get("compareAtPrice")
    try:
        base_compare_at_price = float(compare_at_raw) if compare_at_raw is not None else None
    except (TypeError, ValueError):
        base_compare_at_price = None

    base_sku = str(base_variant.get("sku") or "").strip()
    synthetic_variants: list[JsonDict] = []

    for index, item in enumerate(frame_type_group.get("items", [])):
        if not isinstance(item, dict):
            continue

        title = str(item.get("title") or "").strip()
        if not title:
            continue

        item_price = item.get("price", {})
        surcharge_raw = item_price.get("surcharge") if isinstance(item_price, dict) else 0
        try:
            surcharge = float(surcharge_raw or 0)
        except (TypeError, ValueError):
            surcharge = 0.0

        synthetic_variant: JsonDict = {
            "title": title,
            "sku": (
                base_sku
                if item.get("defaultSelected") or surcharge == 0
                else f"{base_sku}-HEX" if base_sku else f"HEX-{index + 1}"
            ),
            "available": base_variant.get("available", True),
            "price": base_price + surcharge,
            "optionValues": [title],
            "requiresShipping": base_variant.get("requiresShipping"),
            "taxable": base_variant.get("taxable"),
            "grams": base_variant.get("grams"),
            "position": index + 1,
        }
        if base_compare_at_price is not None and base_compare_at_price > 0:
            synthetic_variant["compareAtPrice"] = base_compare_at_price + surcharge
        if item.get("defaultSelected") is True:
            synthetic_variant["defaultSelected"] = True

        synthetic_variants.append(synthetic_variant)

    return synthetic_variants


def resolve_variant_model(bundle: SourceProductBundle) -> tuple[list[JsonDict], list[JsonDict]]:
    """Resolve the effective Medusa option/variant model for one product."""
    source_product = bundle.source_product
    option_definitions = build_option_definitions(source_product)
    source_variants = [
        variant
        for variant in source_product.get("variants", [])
        if isinstance(variant, dict)
    ]

    if option_definitions and source_variants:
        return option_definitions, source_variants

    _frame_type_key, frame_type_group = get_frame_type_add_on_group(bundle)
    if frame_type_group:
        synthetic_option_definitions = build_synthetic_frame_type_option_definitions(
            frame_type_group,
        )
        synthetic_source_variants = build_synthetic_frame_type_source_variants(
            source_product,
            frame_type_group,
        )
        if synthetic_option_definitions and synthetic_source_variants:
            return synthetic_option_definitions, synthetic_source_variants

    return option_definitions, source_variants


def get_effective_add_on_group_keys(bundle: SourceProductBundle) -> list[str]:
    """Return shared add-on keys, excluding Frame Type when modeled as variants."""
    option_definitions, source_variants = resolve_variant_model(bundle)
    has_frame_type_variants = (
        len(option_definitions) == 1
        and str(option_definitions[0].get("title") or "").strip().lower() == "frame type"
        and len(source_variants) >= 2
    )
    frame_type_key, _frame_type_group = get_frame_type_add_on_group(bundle)
    if not has_frame_type_variants or not frame_type_key:
        return list(bundle.add_on_group_keys)
    return [key for key in bundle.add_on_group_keys if key != frame_type_key]


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


def is_default_variant_selector_value(value: str | None) -> bool:
    """Return whether a storefront selector value is only a placeholder/default label."""
    normalized = (value or "").strip().lower()
    return normalized in {"default option", "default title", "default variant", "title"}


def build_storefront_variant_catalog(
    *,
    option_definitions: list[JsonDict],
    source_variants: list[JsonDict],
) -> tuple[str | None, list[str], list[JsonDict]]:
    """Build selector metadata mirroring the storefront's variant behavior."""
    option_names = [str(option["title"]) for option in option_definitions]
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

    if len(unique_entries) == 1 and is_default_variant_selector_value(
        str(unique_entries[0].get("value") or ""),
    ):
        return None, [], []

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


def build_product_category_payload(collection: JsonDict) -> JsonDict:
    """Build a Medusa product category payload mirroring the source collection."""
    return {
        "name": collection["title"],
        "description": collection.get("description", ""),
        "handle": collection["handle"],
        "is_active": True,
        "is_internal": False,
        "metadata": {
            "source": "notionworx-inventory",
            "source_handle": collection["handle"],
            "source_title": collection["title"],
            "inventory_data_path": f"/inventory/notionworx/collections/{collection['handle']}.json",
        },
    }


def fetch_existing_product_categories(
    base_url: str,
    admin_api_key: str,
) -> dict[str, JsonDict]:
    """Fetch a handle-indexed map of existing Medusa product categories."""
    categories: list[JsonDict] = []
    offset = 0
    limit = 250

    while True:
        payload = http_json(
            "GET",
            f"{base_url.rstrip('/')}/admin/product-categories?limit={limit}&offset={offset}",
            headers=admin_headers(admin_api_key),
        )
        page = payload.get("product_categories", [])
        if not page:
            break

        categories.extend(page)
        offset += len(page)
        total = payload.get("count")
        if isinstance(total, int) and offset >= total:
            break

    return {
        str(category["handle"]): category
        for category in categories
        if category.get("handle")
    }


def create_product_category_if_missing(
    base_url: str,
    admin_api_key: str,
    payload: JsonDict,
) -> tuple[JsonDict, bool]:
    """Create a product category when it doesn't already exist."""
    existing = fetch_existing_product_categories(base_url, admin_api_key).get(payload["handle"])
    if existing:
        return existing, False

    response = http_json(
        "POST",
        f"{base_url.rstrip('/')}/admin/product-categories",
        headers=admin_headers(admin_api_key),
        payload=payload,
    )
    return response["product_category"], True


def fetch_product_category_with_products(
    base_url: str,
    admin_api_key: str,
    category_id: str,
) -> JsonDict:
    """Fetch one product category including its linked products."""
    response = http_json(
        "GET",
        f"{base_url.rstrip('/')}/admin/product-categories/{category_id}?fields=id,handle,name,*products",
        headers=admin_headers(admin_api_key),
    )
    return response.get("product_category", {})


def sync_product_category_membership(
    base_url: str,
    admin_api_key: str,
    bundles: list[SourceProductBundle],
    existing_products: dict[str, JsonDict],
    *,
    product_category: JsonDict,
) -> dict[str, Any]:
    """Link all synced products into the mirrored Medusa product category."""
    category_handle = str(product_category.get("handle") or "").strip()
    category_id = str(product_category.get("id") or "").strip()
    if not category_handle or not category_id:
        return {
            "added": [],
            "already_present": [],
            "missing_products": [],
            "failed": [{"handle": category_handle or "<unknown>", "error": "Invalid product category payload."}],
        }

    product_ids_to_add: list[str] = []
    handles_by_product_id: dict[str, str] = {}
    already_present: list[str] = []
    missing_products: list[str] = []

    for bundle in bundles:
        handle = str(bundle.source_product.get("handle") or "").strip()
        if not handle:
            continue

        existing = existing_products.get(handle)
        if not existing:
            missing_products.append(handle)
            continue

        existing_category_handles = {
            str(category.get("handle") or "").strip()
            for category in existing.get("categories", [])
            if isinstance(category, dict)
        }
        if category_handle in existing_category_handles:
            already_present.append(handle)
            continue

        product_id = str(existing.get("id") or "").strip()
        if not product_id:
            missing_products.append(handle)
            continue

        product_ids_to_add.append(product_id)
        handles_by_product_id[product_id] = handle

    if not product_ids_to_add:
        return {
            "added": [],
            "already_present": already_present,
            "missing_products": missing_products,
            "failed": [],
        }

    try:
        http_json(
            "POST",
            f"{base_url.rstrip('/')}/admin/product-categories/{category_id}/products",
            headers=admin_headers(admin_api_key),
            payload={"add": product_ids_to_add},
        )
    except RuntimeError as exc:
        return {
            "added": [],
            "already_present": already_present,
            "missing_products": missing_products,
            "failed": [
                {"handle": handles_by_product_id[product_id], "error": str(exc)}
                for product_id in product_ids_to_add
            ],
        }

    added_handles = [
        handles_by_product_id[product_id]
        for product_id in product_ids_to_add
        if product_id in handles_by_product_id
    ]
    return {
        "added": added_handles,
        "already_present": already_present,
        "missing_products": missing_products,
        "failed": [],
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


def build_simple_addon_metadata_from_links(links: list[JsonDict]) -> dict[str, str]:
    """Group rich add-on links into Accessories_*/Upgrades_* comma-separated IDs."""
    buckets: dict[str, list[str]] = defaultdict(list)
    for link in links:
        if not isinstance(link, dict):
            continue
        product_id = str(link.get("medusa_product_id") or "").strip()
        if not product_id:
            continue
        kind = str(link.get("kind") or "accessory").strip().lower()
        subgroup = (
            str(link.get("subgroup_title") or "").strip()
            or str(link.get("subgroup_id") or "").strip()
            or ("Upgrades" if kind == "upgrade" else "Accessories")
        )
        prefix = "Upgrades" if kind == "upgrade" else "Accessories"
        token = re.sub(r"[^A-Za-z0-9]+", "_", subgroup)
        token = re.sub(r"_+", "_", token).strip("_") or "General"
        key = f"{prefix}_{token}"
        buckets[key].append(product_id)

    return {
        key: ", ".join(unique_preserving_order(product_ids))
        for key, product_ids in sorted(buckets.items())
        if product_ids
    }


def build_product_metadata(
    bundle: SourceProductBundle,
) -> JsonDict:
    """Build fidelity-critical Medusa metadata for one product."""
    source_product = bundle.source_product
    storefront_product = bundle.storefront_product
    add_on_product_links = build_add_on_product_links(bundle)
    simple_addon_metadata = build_simple_addon_metadata_from_links(add_on_product_links)
    option_definitions, source_variants = resolve_variant_model(bundle)
    variant_label, sizes, size_variants = build_storefront_variant_catalog(
        option_definitions=option_definitions,
        source_variants=source_variants,
    )

    metadata: JsonDict = {
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
        "source_options": option_definitions or source_product.get("options", []),
        "source_variants": source_variants or source_product.get("variants", []),
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
        # Clear legacy complex add-on association fields.
        "source_add_on_group_keys": "",
        "source_add_on_product_links": "",
        "source_accessory_product_ids": "",
        "source_upgrade_product_ids": "",
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
    metadata.update(simple_addon_metadata)
    return metadata


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
    option_definitions, source_variants = resolve_variant_model(bundle)
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


def is_default_variant_title(value: str | None) -> bool:
    """Return whether a variant title is only a placeholder/default label."""
    return (value or "").strip().lower() in {
        "default option",
        "default title",
        "default variant",
    }


def pick_default_source_variant(
    source_product: JsonDict,
    source_variants: list[JsonDict],
) -> JsonDict:
    """Pick the source variant that should inherit an existing default Medusa variant id."""
    return next(
        (
            variant
            for variant in source_variants
            if variant.get("defaultSelected") is True
            or float(variant.get("price") or 0)
            == float(source_product.get("price", {}).get("min") or 0)
        ),
        source_variants[0],
    )


def build_variant_model_update_payload(
    bundle: SourceProductBundle,
    existing_product: JsonDict,
    *,
    collection_id: str | None,
    sales_channel_id: str | None,
    region: RegionContext | None,
) -> JsonDict | None:
    """Build an in-place product update that promotes real source variants into Medusa."""
    option_definitions, source_variants = resolve_variant_model(bundle)
    is_frame_type_model = (
        len(option_definitions) == 1
        and str(option_definitions[0].get("title") or "").strip().lower() == "frame type"
        and len(source_variants) >= 2
    )
    if not option_definitions or len(source_variants) <= 1 or is_frame_type_model:
        return None

    source_product = bundle.source_product
    payload = build_product_update_payload(
        bundle,
        collection_id=collection_id,
        sales_channel_id=sales_channel_id,
    )
    existing_options = [
        option for option in existing_product.get("options", []) if isinstance(option, dict)
    ]
    existing_variants = [
        variant for variant in existing_product.get("variants", []) if isinstance(variant, dict)
    ]
    matched_option_ids: set[str] = set()
    fallback_option_ids = [
        str(option.get("id")).strip()
        for option in existing_options
        if option.get("id")
    ]
    existing_option_by_title = {
        str(option.get("title") or "").strip().lower(): option
        for option in existing_options
        if str(option.get("title") or "").strip()
    }

    option_payloads: list[JsonDict] = []
    for option in option_definitions:
        option_title = str(option.get("title") or "").strip()
        existing_option = existing_option_by_title.get(option_title.lower())
        option_id = (
            str(existing_option.get("id")).strip()
            if existing_option and existing_option.get("id")
            else None
        )
        if option_id and option_id in matched_option_ids:
            option_id = None
        if option_id:
            matched_option_ids.add(option_id)
        else:
            option_id = next(
                (candidate for candidate in fallback_option_ids if candidate not in matched_option_ids),
                None,
            )
            if option_id:
                matched_option_ids.add(option_id)

        option_payloads.append(
            {
                **({"id": option_id} if option_id else {}),
                "title": option_title,
                "values": [str(value) for value in option.get("values", [])],
            }
        )

    payload["options"] = option_payloads
    option_names = [str(option["title"]) for option in option_definitions]
    default_source_variant = pick_default_source_variant(source_product, source_variants)
    existing_variant_by_source_id = {
        str((variant.get("metadata") or {}).get("source_variant_id")): variant
        for variant in existing_variants
        if isinstance(variant.get("metadata"), dict)
        and (variant.get("metadata") or {}).get("source_variant_id") is not None
    }
    existing_variant_by_sku = {
        str(variant.get("sku") or "").strip(): variant
        for variant in existing_variants
        if str(variant.get("sku") or "").strip()
    }
    existing_variant_by_title = {
        str(variant.get("title") or "").strip(): variant
        for variant in existing_variants
        if variant.get("title")
    }
    current_default_variant = existing_variants[0] if existing_variants else None

    variant_payloads: list[JsonDict] = []
    for index, source_variant in enumerate(source_variants):
        variant_payload = build_variant_payload(
            source_variant,
            option_names,
            region,
            product_handle=source_product["handle"],
            variant_index=index,
        )
        source_variant_id = source_variant.get("id")
        source_variant_sku = str(source_variant.get("sku") or "").strip()
        source_variant_title = str(source_variant.get("title") or "").strip()
        existing_variant = (
            existing_variant_by_source_id.get(str(source_variant_id))
            if source_variant_id is not None
            else None
        )
        if not existing_variant and source_variant_sku:
            existing_variant = existing_variant_by_sku.get(source_variant_sku)
        if not existing_variant and source_variant_title:
            existing_variant = existing_variant_by_title.get(source_variant_title)
        if (
            not existing_variant
            and current_default_variant
            and source_variant == default_source_variant
            and (
                len(existing_variants) == 1
                or is_default_variant_title(current_default_variant.get("title"))
            )
        ):
            existing_variant = current_default_variant
        if existing_variant and existing_variant.get("id"):
            variant_payload["id"] = existing_variant["id"]
        variant_payloads.append(variant_payload)

    payload["variants"] = variant_payloads
    return payload


def sync_existing_product_data(
    base_url: str,
    admin_api_key: str,
    bundles: list[SourceProductBundle],
    existing_products: dict[str, JsonDict],
    *,
    collection_id: str | None,
    sales_channel_id: str | None,
    region: RegionContext | None,
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

        target_collection_id = existing.get("collection_id") or collection_id
        payload = build_variant_model_update_payload(
            bundle,
            existing,
            collection_id=target_collection_id,
            sales_channel_id=sales_channel_id,
            region=region,
        ) or build_product_update_payload(
            bundle,
            # Preserve an existing primary Medusa collection assignment so
            # overlapping collection syncs refresh fidelity metadata without
            # bouncing the product between collections.
            collection_id=target_collection_id,
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


def verify_product_category_state(
    *,
    base_url: str,
    admin_api_key: str,
    category_handle: str,
) -> JsonDict:
    """Fetch post-sync product category membership for one mirrored collection."""
    product_categories = fetch_existing_product_categories(base_url, admin_api_key)
    product_category = product_categories.get(category_handle)
    if not product_category or not product_category.get("id"):
        return {
            "productCategoryId": None,
            "productCategoryHandle": category_handle,
            "productCategoryProductsCount": 0,
            "productCategoryProductHandles": [],
        }

    category_with_products = fetch_product_category_with_products(
        base_url,
        admin_api_key,
        str(product_category["id"]),
    )
    products = category_with_products.get("products", [])
    return {
        "productCategoryId": product_category.get("id"),
        "productCategoryHandle": category_handle,
        "productCategoryProductsCount": len(products),
        "productCategoryProductHandles": [
            product.get("handle")
            for product in products
            if isinstance(product, dict) and product.get("handle")
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
    product_category_payload = build_product_category_payload(collection)
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
        "productCategory": product_category_payload,
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
    product_category_response, product_category_created = create_product_category_if_missing(
        args.base_url,
        args.admin_api_key,
        product_category_payload,
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
        region=region,
    )
    existing_products = fetch_existing_products(args.base_url, args.admin_api_key)
    product_category_membership_result = sync_product_category_membership(
        args.base_url,
        args.admin_api_key,
        bundles,
        existing_products,
        product_category=product_category_response,
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
    product_category_verification = verify_product_category_state(
        base_url=args.base_url,
        admin_api_key=args.admin_api_key,
        category_handle=args.collection_handle,
    )

    print(
        json.dumps(
            {
                "mode": "apply",
                "previewPath": str(preview_path),
                "collectionId": collection_id,
                "collectionHandle": collection_payload["handle"],
                "productCategoryId": product_category_response.get("id"),
                "productCategoryCreated": product_category_created,
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
                "productCategoryAddedProducts": len(product_category_membership_result["added"]),
                "productCategoryAlreadyPresentProducts": len(
                    product_category_membership_result["already_present"]
                ),
                "productCategoryMissingProducts": len(
                    product_category_membership_result["missing_products"]
                ),
                "productCategoryFailedProducts": len(product_category_membership_result["failed"]),
                "productCategoryAddedHandles": product_category_membership_result["added"],
                "productCategoryAlreadyPresentHandles": product_category_membership_result[
                    "already_present"
                ],
                "productCategoryMissingHandles": product_category_membership_result[
                    "missing_products"
                ],
                "productCategoryFailures": product_category_membership_result["failed"],
                "verification": verification,
                "productCategoryVerification": product_category_verification,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
