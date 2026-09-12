#!/usr/bin/env python3
"""Migrate Medusa add-on metadata to the simple editable flow.

Target format (editable in Medusa Admin key/value UI):

    Accessories_Table_Cover = "prod_xxx, prod_yyy"
    Accessories_Feather_Flags = "prod_zzz"
    Upgrades_Vented_Top = "prod_aaa"

Legacy fields are cleared everywhere:
  - source_add_on_product_links
  - source_accessory_product_ids
  - source_upgrade_product_ids
  - source_add_on_group_keys
"""

from __future__ import annotations

import argparse
import json
import os
import re
from collections import defaultdict
from pathlib import Path
from typing import Any

from sync_apparel_to_medusa import (
    REPO_ROOT,
    admin_headers,
    fetch_existing_products,
    http_json,
    write_json,
)

JsonDict = dict[str, Any]
DEFAULT_PREVIEW_PATH = (
    REPO_ROOT
    / "data"
    / "inventory"
    / "notionworx"
    / "medusa"
    / "addon-simple-metadata-migration-preview.json"
)

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


def collect_simple_addon_metadata(links: list[JsonDict]) -> dict[str, str]:
    """Group existing rich links into simple comma-separated metadata values."""
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
        key = build_simple_addon_key(kind, subgroup)
        buckets[key].append(product_id)

    return {
        key: ", ".join(unique_preserving_order(product_ids))
        for key, product_ids in sorted(buckets.items())
        if product_ids
    }


def has_meaningful_value(value: object) -> bool:
    """Return whether a metadata value is meaningfully populated."""
    if value is None:
        return False
    if isinstance(value, str):
        return bool(value.strip())
    if isinstance(value, (list, dict)):
        return len(value) > 0
    return True


def migrate_products(
    *,
    base_url: str,
    admin_api_key: str,
    apply: bool,
) -> JsonDict:
    """Convert parent products and clear legacy add-on metadata everywhere."""
    existing_products = fetch_existing_products(base_url, admin_api_key)
    summary: JsonDict = {
        "apply": apply,
        "totalProductsSeen": len(existing_products),
        "totalParentsSeen": 0,
        "updated": [],
        "legacyOnlyCleaned": [],
        "skipped": [],
        "failed": [],
        "keysWritten": {},
    }

    for handle, product in sorted(existing_products.items()):
        metadata = dict(product.get("metadata") or {})
        links = metadata.get("source_add_on_product_links")
        has_legacy_values = any(
            has_meaningful_value(metadata.get(old_key)) for old_key in OLD_ADDON_METADATA_KEYS
        )
        if not isinstance(links, list) or not links:
            if has_legacy_values:
                cleaned_metadata = dict(metadata)
                for old_key in OLD_ADDON_METADATA_KEYS:
                    if old_key in cleaned_metadata:
                        cleaned_metadata[old_key] = ""

                summary["legacyOnlyCleaned"].append(
                    {
                        "handle": handle,
                        "id": product.get("id"),
                        "clearedKeys": [
                            old_key
                            for old_key in OLD_ADDON_METADATA_KEYS
                            if has_meaningful_value(metadata.get(old_key))
                        ],
                    }
                )

                if apply:
                    try:
                        http_json(
                            "POST",
                            f"{base_url.rstrip('/')}/admin/products/{product['id']}",
                            headers=admin_headers(admin_api_key),
                            payload={"metadata": cleaned_metadata},
                        )
                    except RuntimeError as exc:
                        summary["failed"].append({"handle": handle, "error": str(exc)})
                continue

            # Already migrated or no add-ons.
            has_simple = any(
                str(key).startswith(("Accessories_", "Upgrades_")) for key in metadata
            )
            if has_simple:
                summary["skipped"].append({"handle": handle, "reason": "already_simple"})
            continue

        summary["totalParentsSeen"] += 1
        simple_fields = collect_simple_addon_metadata(links)
        if not simple_fields:
            summary["skipped"].append({"handle": handle, "reason": "no_valid_product_ids"})
            continue

        for key in simple_fields:
            summary["keysWritten"][key] = summary["keysWritten"].get(key, 0) + 1

        merged = dict(metadata)
        # Clear old complex fields so Medusa UI/runtime stop using them.
        for old_key in OLD_ADDON_METADATA_KEYS:
            if old_key in merged:
                merged[old_key] = ""
        merged.update(simple_fields)

        summary["updated"].append(
            {
                "handle": handle,
                "id": product.get("id"),
                "simpleKeys": simple_fields,
            }
        )

        if not apply:
            continue

        try:
            http_json(
                "POST",
                f"{base_url.rstrip('/')}/admin/products/{product['id']}",
                headers=admin_headers(admin_api_key),
                payload={"metadata": merged},
            )
        except RuntimeError as exc:
            summary["failed"].append({"handle": handle, "error": str(exc)})

    return summary


def parse_args() -> argparse.Namespace:
    """Parse CLI args."""
    parser = argparse.ArgumentParser(
        description="Migrate add-on associations to simple Medusa metadata keys.",
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
        "--preview-path",
        type=Path,
        default=DEFAULT_PREVIEW_PATH,
        help="Where to write the dry-run/apply summary JSON.",
    )
    return parser.parse_args()


def main() -> None:
    """Run the migration."""
    args = parse_args()
    base_url = str(args.base_url or "").strip().rstrip("/")
    admin_api_key = str(args.admin_api_key or "").strip()
    if not base_url or not admin_api_key:
        raise SystemExit("MEDUSA_BACKEND_URL and MEDUSA_ADMIN_API_KEY are required.")

    summary = migrate_products(
        base_url=base_url,
        admin_api_key=admin_api_key,
        apply=args.apply,
    )
    write_json(args.preview_path, summary)
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
