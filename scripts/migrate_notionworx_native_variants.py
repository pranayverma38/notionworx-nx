#!/usr/bin/env python3
"""Promote NotionWorx metadata-backed variants into native Medusa variants.

This script audits live Medusa products against the mirrored NotionWorx source
data and upgrades products that should expose real Medusa options/variants but
still only have the default placeholder option/variant.

Frame Type products are intentionally excluded from mutation.
"""

from __future__ import annotations

import argparse
import json
import os
from collections import Counter
from pathlib import Path
from typing import Any

import sync_apparel_to_medusa as apparel
import sync_notionworx_collection_to_medusa as inventory

JsonDict = dict[str, Any]
DEFAULT_OPTION_TITLES = {"default option", "default title", "title"}


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
        help="Medusa store/publishable key used for region-aware price payloads.",
    )
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Apply product updates instead of only printing the migration plan.",
    )
    return parser.parse_args()


def load_inventory_bundles_by_handle() -> dict[str, inventory.SourceProductBundle]:
    """Load all inventory bundles indexed by product handle."""
    manifest = inventory.read_json(inventory.INVENTORY_MANIFEST_PATH)
    bundle_by_handle: dict[str, inventory.SourceProductBundle] = {}
    for collection_record in manifest.get("collections", []):
        collection_handle = str(collection_record.get("handle") or "").strip()
        if not collection_handle:
            continue
        _collection, bundles = inventory.load_collection_bundles(collection_handle)
        for bundle in bundles:
            handle = str(bundle.source_product.get("handle") or "").strip()
            if handle and handle not in bundle_by_handle:
                bundle_by_handle[handle] = bundle
    return bundle_by_handle


def load_apparel_products_by_handle() -> dict[str, JsonDict]:
    """Load obsolete apparel products indexed by handle."""
    _collection, products = apparel.load_apparel_inventory()
    return {
        str(product.get("handle") or "").strip(): product
        for product in products
        if str(product.get("handle") or "").strip()
    }


def is_frame_type_variant_model(
    option_definitions: list[JsonDict],
    source_variants: list[JsonDict],
) -> bool:
    """Return whether a source variant model represents Frame Type choices."""
    return (
        len(option_definitions) == 1
        and str(option_definitions[0].get("title") or "").strip().lower() == "frame type"
        and len(source_variants) >= 2
    )


def get_meaningful_medusa_option_titles(product: JsonDict) -> list[str]:
    """Return non-default option titles from a live Medusa product."""
    titles: list[str] = []
    for option in product.get("options", []):
        title = str(option.get("title") or "").strip()
        if title and title.lower() not in DEFAULT_OPTION_TITLES:
            titles.append(title)
    return titles


def capture_variant_signature(product: JsonDict | None) -> JsonDict | None:
    """Capture a compact option/variant signature for change detection."""
    if not product:
        return None

    return {
        "optionTitles": [str(option.get("title") or "").strip() for option in product.get("options", [])],
        "variantTitles": [str(variant.get("title") or "").strip() for variant in product.get("variants", [])],
        "variantSkus": [str(variant.get("sku") or "").strip() for variant in product.get("variants", [])],
        "variantCount": len(product.get("variants", [])),
    }


def build_live_variant_matchers(product: JsonDict) -> JsonDict:
    """Build source-id/title/SKU matcher sets from a live product."""
    source_variant_ids: set[str] = set()
    variant_titles: set[str] = set()
    variant_skus: set[str] = set()

    for variant in product.get("variants", []):
        metadata = variant.get("metadata") if isinstance(variant.get("metadata"), dict) else {}
        source_variant_id = metadata.get("source_variant_id")
        variant_title = str(variant.get("title") or "").strip()
        variant_sku = str(variant.get("sku") or "").strip()
        if source_variant_id is not None:
            source_variant_ids.add(str(source_variant_id))
        if variant_title:
            variant_titles.add(variant_title)
        if variant_sku:
            variant_skus.add(variant_sku)

    return {
        "sourceVariantIds": source_variant_ids,
        "variantTitles": variant_titles,
        "variantSkus": variant_skus,
    }


def live_product_has_source_variant(
    source_variant: JsonDict,
    matchers: JsonDict,
) -> bool:
    """Return whether a source variant is already represented on the live product."""
    source_variant_id = source_variant.get("id")
    source_title = str(source_variant.get("title") or "").strip()
    if source_variant_id is not None and str(source_variant_id) in matchers["sourceVariantIds"]:
        return True
    if source_title and source_title in matchers["variantTitles"]:
        return True
    return False


def remember_source_variant(
    source_variant: JsonDict,
    payload: JsonDict,
    matchers: JsonDict,
) -> None:
    """Update matcher sets after a variant create request succeeds."""
    source_variant_id = source_variant.get("id")
    source_title = str(source_variant.get("title") or "").strip()
    variant_sku = str(payload.get("sku") or "").strip()
    if source_variant_id is not None:
        matchers["sourceVariantIds"].add(str(source_variant_id))
    if source_title:
        matchers["variantTitles"].add(source_title)
    if variant_sku:
        matchers["variantSkus"].add(variant_sku)


def sync_missing_inventory_variants(
    *,
    base_url: str,
    admin_api_key: str,
    existing_product: JsonDict,
    bundle: inventory.SourceProductBundle,
    region: apparel.RegionContext | None,
    reserved_skus: set[str],
) -> list[JsonDict]:
    """Create inventory variants that the product update endpoint did not add."""
    option_definitions, source_variants = inventory.resolve_variant_model(bundle)
    option_names = [str(option["title"]) for option in option_definitions]
    matchers = build_live_variant_matchers(existing_product)
    created: list[JsonDict] = []

    for index, source_variant in enumerate(source_variants):
        if live_product_has_source_variant(source_variant, matchers):
            continue

        payload = inventory.build_variant_payload(
            source_variant,
            option_names,
            region,
            product_handle=str(bundle.source_product["handle"]),
            variant_index=index,
        )
        payload["metadata"] = {
            "source_variant_id": source_variant.get("id"),
            **(
                {"source_sku": str(source_variant.get("sku") or "").strip()}
                if str(source_variant.get("sku") or "").strip()
                else {}
            ),
        }
        sku = str(payload.get("sku") or "").strip()
        if not sku or sku in reserved_skus:
            payload["sku"] = inventory.synthesize_variant_sku(
                product_handle=str(bundle.source_product["handle"]),
                source_variant=source_variant,
                variant_index=index,
            )
            sku = str(payload["sku"]).strip()
        reserved_skus.add(sku)
        inventory.http_json(
            "POST",
            f"{base_url.rstrip('/')}/admin/products/{existing_product['id']}/variants",
            headers=inventory.admin_headers(admin_api_key),
            payload=payload,
        )
        remember_source_variant(source_variant, payload, matchers)
        created.append({"title": payload["title"], "sku": payload.get("sku")})

    return created


def sync_missing_apparel_variants(
    *,
    base_url: str,
    admin_api_key: str,
    existing_product: JsonDict,
    product: JsonDict,
    region: apparel.RegionContext | None,
    reserved_skus: set[str],
) -> list[JsonDict]:
    """Create apparel variants that the product update endpoint did not add."""
    option_definitions = apparel.build_option_definitions(product)
    source_variants = [
        variant for variant in product.get("variants", []) if isinstance(variant, dict)
    ]
    option_names = [str(option["title"]) for option in option_definitions]
    matchers = build_live_variant_matchers(existing_product)
    created: list[JsonDict] = []

    for index, source_variant in enumerate(source_variants):
        if live_product_has_source_variant(source_variant, matchers):
            continue

        payload = apparel.build_variant_payload(
            source_variant,
            option_names,
            region,
            product_handle=str(product["handle"]),
            variant_index=index,
        )
        payload["metadata"] = {
            "source_variant_id": source_variant.get("id"),
            **(
                {"source_sku": str(source_variant.get("sku") or "").strip()}
                if str(source_variant.get("sku") or "").strip()
                else {}
            ),
        }
        sku = str(payload.get("sku") or "").strip()
        if not sku or sku in reserved_skus:
            payload["sku"] = apparel.synthesize_variant_sku(
                product_handle=str(product["handle"]),
                source_variant=source_variant,
                variant_index=index,
            )
            sku = str(payload["sku"]).strip()
        reserved_skus.add(sku)
        apparel.http_json(
            "POST",
            f"{base_url.rstrip('/')}/admin/products/{existing_product['id']}/variants",
            headers=apparel.admin_headers(admin_api_key),
            payload=payload,
        )
        remember_source_variant(source_variant, payload, matchers)
        created.append({"title": payload["title"], "sku": payload.get("sku")})

    return created


def build_inventory_record(
    handle: str,
    bundle: inventory.SourceProductBundle,
    existing_product: JsonDict | None,
    *,
    region: apparel.RegionContext | None,
) -> JsonDict | None:
    """Build one migration record for an inventory product."""
    option_definitions, source_variants = inventory.resolve_variant_model(bundle)
    if is_frame_type_variant_model(option_definitions, source_variants):
        return {
            "handle": handle,
            "title": bundle.source_product.get("name"),
            "source": "notionworx-inventory",
            "targetOptionTitles": [str(option["title"]) for option in option_definitions],
            "targetVariantCount": len(source_variants),
            "frameType": True,
            "existing": existing_product is not None,
        }

    if not option_definitions or len(source_variants) <= 1:
        return None

    if not existing_product:
        return {
            "handle": handle,
            "title": bundle.source_product.get("name"),
            "source": "notionworx-inventory",
            "targetOptionTitles": [str(option["title"]) for option in option_definitions],
            "targetVariantCount": len(source_variants),
            "frameType": False,
            "existing": False,
        }

    medusa_option_titles = get_meaningful_medusa_option_titles(existing_product)
    medusa_variant_count = len(existing_product.get("variants", []))
    needs_migration = (
        medusa_option_titles != [str(option["title"]) for option in option_definitions]
        or medusa_variant_count != len(source_variants)
    )

    return {
        "handle": handle,
        "title": bundle.source_product.get("name"),
        "source": "notionworx-inventory",
        "targetOptionTitles": [str(option["title"]) for option in option_definitions],
        "targetVariantCount": len(source_variants),
        "medusaOptionTitles": medusa_option_titles,
        "medusaVariantCount": medusa_variant_count,
        "needsMigration": needs_migration,
        "frameType": False,
        "existing": True,
        "payload": (
            inventory.build_variant_model_update_payload(
                bundle,
                existing_product,
                collection_id=None,
                sales_channel_id=None,
                region=region,
            )
            if needs_migration
            else None
        ),
    }


def build_apparel_record(
    handle: str,
    product: JsonDict,
    existing_product: JsonDict | None,
    *,
    region: apparel.RegionContext | None,
) -> JsonDict | None:
    """Build one migration record for an apparel product."""
    option_definitions = apparel.build_option_definitions(product)
    source_variants = [
        variant for variant in product.get("variants", []) if isinstance(variant, dict)
    ]
    if not option_definitions or len(source_variants) <= 1:
        return None

    if not existing_product:
        return {
            "handle": handle,
            "title": product.get("name"),
            "source": "notionworx-obsolete",
            "targetOptionTitles": [str(option["title"]) for option in option_definitions],
            "targetVariantCount": len(source_variants),
            "frameType": False,
            "existing": False,
        }

    medusa_option_titles = get_meaningful_medusa_option_titles(existing_product)
    medusa_variant_count = len(existing_product.get("variants", []))
    needs_migration = (
        medusa_option_titles != [str(option["title"]) for option in option_definitions]
        or medusa_variant_count != len(source_variants)
    )

    return {
        "handle": handle,
        "title": product.get("name"),
        "source": "notionworx-obsolete",
        "targetOptionTitles": [str(option["title"]) for option in option_definitions],
        "targetVariantCount": len(source_variants),
        "medusaOptionTitles": medusa_option_titles,
        "medusaVariantCount": medusa_variant_count,
        "needsMigration": needs_migration,
        "frameType": False,
        "existing": True,
        "payload": (
            apparel.build_variant_model_update_payload(
                product,
                existing_product,
                collection_id=None,
                sales_channel_id=None,
                site_url=apparel.DEFAULT_SITE_URL,
                region=region,
            )
            if needs_migration
            else None
        ),
    }


def summarize_records(records: list[JsonDict]) -> JsonDict:
    """Build a compact summary from migration records."""
    native_targets = [record for record in records if not record.get("frameType")]
    frame_type_records = [record for record in records if record.get("frameType")]
    existing_targets = [record for record in native_targets if record.get("existing")]
    needs_migration = [record for record in existing_targets if record.get("needsMigration")]
    already_native = [record for record in existing_targets if not record.get("needsMigration")]
    missing_in_medusa = [record for record in native_targets if not record.get("existing")]

    return {
        "targetNativeVariantProducts": len(native_targets),
        "needsMigrationCount": len(needs_migration),
        "alreadyNativeCount": len(already_native),
        "missingInMedusaCount": len(missing_in_medusa),
        "frameTypeProductsSkipped": len(frame_type_records),
        "needsMigrationBySource": dict(
            Counter(str(record.get("source") or "") for record in needs_migration)
        ),
        "missingInMedusaHandles": [record["handle"] for record in missing_in_medusa],
        "needsMigrationHandles": [record["handle"] for record in needs_migration],
    }


def main() -> None:
    """Run the native variant migration audit/apply flow."""
    args = parse_args()
    if not args.admin_api_key:
        raise RuntimeError("MEDUSA_ADMIN_API_KEY is required for the live Medusa audit.")

    existing_products = inventory.fetch_existing_products(args.base_url, args.admin_api_key)
    reserved_skus = apparel.collect_existing_variant_skus(existing_products)
    region = apparel.fetch_region_context(args.base_url, args.store_api_key or None)
    inventory_bundles = load_inventory_bundles_by_handle()
    apparel_products = load_apparel_products_by_handle()

    records: list[JsonDict] = []
    for handle, bundle in sorted(inventory_bundles.items()):
        record = build_inventory_record(
            handle,
            bundle,
            existing_products.get(handle),
            region=region,
        )
        if record:
            records.append(record)
    for handle, product in sorted(apparel_products.items()):
        if handle in inventory_bundles:
            continue
        record = build_apparel_record(
            handle,
            product,
            existing_products.get(handle),
            region=region,
        )
        if record:
            records.append(record)

    frame_type_handles = [
        record["handle"]
        for record in records
        if record.get("frameType") and record.get("existing")
    ]
    frame_type_before = {
        handle: capture_variant_signature(existing_products.get(handle))
        for handle in frame_type_handles
    }
    summary = summarize_records(records)

    if not args.apply:
        print(
            json.dumps(
                {
                    "mode": "dry-run",
                    "baseUrl": args.base_url,
                    "regionId": region.id if region else None,
                    **summary,
                    "sampleNeedsMigration": [
                        {
                            "handle": record["handle"],
                            "title": record.get("title"),
                            "source": record.get("source"),
                            "targetOptionTitles": record.get("targetOptionTitles"),
                            "targetVariantCount": record.get("targetVariantCount"),
                            "medusaOptionTitles": record.get("medusaOptionTitles"),
                            "medusaVariantCount": record.get("medusaVariantCount"),
                        }
                        for record in records
                        if record.get("needsMigration")
                    ][:25],
                },
                indent=2,
            )
        )
        return

    updated_handles: list[str] = []
    created_variant_totals: Counter[str] = Counter()
    failed: list[JsonDict] = []
    for record in records:
        if not record.get("needsMigration"):
            continue

        existing_product = existing_products.get(record["handle"])
        payload = record.get("payload")
        if not existing_product or not payload:
            failed.append(
                {
                    "handle": record["handle"],
                    "source": record.get("source"),
                    "error": "Missing live product or update payload.",
                }
            )
            continue

        try:
            current_option_titles = get_meaningful_medusa_option_titles(existing_product)
            current_product_skus = {
                str(variant.get("sku") or "").strip()
                for variant in existing_product.get("variants", [])
                if str(variant.get("sku") or "").strip()
            }
            updated_product = existing_product

            if current_option_titles != record.get("targetOptionTitles"):
                other_reserved_skus = reserved_skus.difference(current_product_skus)
                for index, variant_payload in enumerate(payload.get("variants", [])):
                    sku = str(variant_payload.get("sku") or "").strip()
                    if sku and sku not in other_reserved_skus:
                        continue

                    if record.get("source") == "notionworx-inventory":
                        source_variant = inventory_bundles[record["handle"]].source_product["variants"][index]
                        variant_payload["sku"] = inventory.synthesize_variant_sku(
                            product_handle=record["handle"],
                            source_variant=source_variant,
                            variant_index=index,
                        )
                    else:
                        source_variant = apparel_products[record["handle"]]["variants"][index]
                        variant_payload["sku"] = apparel.synthesize_variant_sku(
                            product_handle=record["handle"],
                            source_variant=source_variant,
                            variant_index=index,
                        )

                update_response = apparel.http_json(
                    "POST",
                    f"{args.base_url.rstrip('/')}/admin/products/{existing_product['id']}",
                    headers=apparel.admin_headers(args.admin_api_key),
                    payload=payload,
                )
                updated_product = (
                    update_response.get("product")
                    if isinstance(update_response.get("product"), dict)
                    else None
                ) or inventory.http_json(
                    "GET",
                    f"{args.base_url.rstrip('/')}/admin/products/{existing_product['id']}?fields=*variants,*options",
                    headers=apparel.admin_headers(args.admin_api_key),
                ).get("product", existing_product)
            for live_variant in updated_product.get("variants", []):
                live_sku = str(live_variant.get("sku") or "").strip()
                if live_sku:
                    reserved_skus.add(live_sku)

            if record.get("source") == "notionworx-inventory":
                created_variants = sync_missing_inventory_variants(
                    base_url=args.base_url,
                    admin_api_key=args.admin_api_key,
                    existing_product=updated_product,
                    bundle=inventory_bundles[record["handle"]],
                    region=region,
                    reserved_skus=reserved_skus,
                )
            else:
                created_variants = sync_missing_apparel_variants(
                    base_url=args.base_url,
                    admin_api_key=args.admin_api_key,
                    existing_product=updated_product,
                    product=apparel_products[record["handle"]],
                    region=region,
                    reserved_skus=reserved_skus,
                )

            if created_variants:
                created_variant_totals[record["handle"]] += len(created_variants)
            updated_handles.append(record["handle"])
        except RuntimeError as exc:
            failed.append(
                {
                    "handle": record["handle"],
                    "source": record.get("source"),
                    "error": str(exc),
                }
            )

    refreshed_products = inventory.fetch_existing_products(args.base_url, args.admin_api_key)
    refreshed_records: list[JsonDict] = []
    for handle, bundle in sorted(inventory_bundles.items()):
        record = build_inventory_record(
            handle,
            bundle,
            refreshed_products.get(handle),
            region=region,
        )
        if record:
            refreshed_records.append(record)
    for handle, product in sorted(apparel_products.items()):
        if handle in inventory_bundles:
            continue
        record = build_apparel_record(
            handle,
            product,
            refreshed_products.get(handle),
            region=region,
        )
        if record:
            refreshed_records.append(record)

    frame_type_after = {
        handle: capture_variant_signature(refreshed_products.get(handle))
        for handle in frame_type_handles
    }
    frame_type_changed = [
        handle
        for handle in frame_type_handles
        if frame_type_before.get(handle) != frame_type_after.get(handle)
    ]
    remaining_mismatches = [
        record["handle"]
        for record in refreshed_records
        if record.get("needsMigration")
    ]

    print(
        json.dumps(
            {
                "mode": "apply",
                "baseUrl": args.base_url,
                "regionId": region.id if region else None,
                **summary,
                "updatedCount": len(updated_handles),
                "failedCount": len(failed),
                "updatedHandles": updated_handles,
                "createdVariantCounts": dict(created_variant_totals),
                "createdVariantsTotal": sum(created_variant_totals.values()),
                "failed": failed,
                "remainingMismatchCount": len(remaining_mismatches),
                "remainingMismatchHandles": remaining_mismatches,
                "frameTypeChangedCount": len(frame_type_changed),
                "frameTypeChangedHandles": frame_type_changed,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
