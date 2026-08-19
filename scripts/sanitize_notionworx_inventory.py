"""Sanitize migrated Notion Worx inventory data.

This script removes legacy source URLs from the imported crawl, strips
external links and embedded remote media from persisted descriptions, and
updates the inventory schema version to reflect the cleaned local-only shape.
"""

from __future__ import annotations

import json
import re
from html import unescape
from pathlib import Path
from typing import Any

TARGET_SCHEMA_VERSION = 2
LEGACY_TEXT_PATTERNS = (
    r"download template",
    r"need help with artwork setup\??",
    r"template",
    r"installation guide",
    r"setup instruction",
    r"installation instruction",
    r"specsheet",
    r"warning label",
    r"fire certificate",
)


def repo_root() -> Path:
    """Return the repository root for this script."""
    return Path(__file__).resolve().parent.parent


def strip_urls(text: str) -> str:
    """Remove raw URLs from freeform text."""
    return re.sub(r"https?://[^\s\"'<>]+", "", text, flags=re.IGNORECASE)


def strip_legacy_labels(text: str) -> str:
    """Remove imported helper/link labels that no longer resolve locally."""
    cleaned = text
    for pattern in LEGACY_TEXT_PATTERNS:
        cleaned = re.sub(pattern, "", cleaned, flags=re.IGNORECASE)
    return cleaned


def normalize_whitespace(text: str) -> str:
    """Collapse repeated whitespace while preserving paragraph breaks."""
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(r"[ \t]+\n", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"[ \t]{2,}", " ", text)
    return text.strip()


def sanitize_html(html_text: str) -> str:
    """Remove remote media, external links, and crawl-only helper labels."""
    sanitized = html_text or ""
    if not sanitized:
        return ""

    sanitized = re.sub(r"<meta\b[^>]*>", "", sanitized, flags=re.IGNORECASE)
    sanitized = re.sub(
        r"<iframe\b[\s\S]*?</iframe>",
        "",
        sanitized,
        flags=re.IGNORECASE,
    )
    sanitized = re.sub(r"<img\b[^>]*>", "", sanitized, flags=re.IGNORECASE)
    sanitized = re.sub(
        r"<a\b[^>]*>([\s\S]*?)</a>",
        r"\1",
        sanitized,
        flags=re.IGNORECASE,
    )
    sanitized = strip_urls(sanitized)
    sanitized = strip_legacy_labels(sanitized)
    sanitized = re.sub(r"\s(?:href|src|data-mce-href|data-mce-src)=['\"][^'\"]*['\"]", "", sanitized)

    # Remove now-empty wrappers left behind after link/media stripping.
    previous = None
    while previous != sanitized:
        previous = sanitized
        sanitized = re.sub(
            r"<(\w+)(?:\s[^>]*)?>\s*</\1>",
            "",
            sanitized,
            flags=re.IGNORECASE,
        )

    return normalize_whitespace(sanitized)


def html_to_text(html_text: str) -> str:
    """Convert lightweight product HTML to plain text."""
    text = html_text
    text = re.sub(r"<br\s*/?>", "\n", text, flags=re.IGNORECASE)
    text = re.sub(r"</(p|div|li|ul|ol|h[1-6])>", "\n", text, flags=re.IGNORECASE)
    text = re.sub(r"<li\b[^>]*>", "", text, flags=re.IGNORECASE)
    text = re.sub(r"<[^>]+>", "", text)
    text = unescape(text).replace("\xa0", " ")
    return normalize_whitespace(text)


def sanitize_text(text: str, fallback_html: str) -> str:
    """Sanitize persisted plain text while preserving catalog copy."""
    base_text = text or html_to_text(fallback_html)
    base_text = strip_urls(base_text)
    base_text = strip_legacy_labels(base_text)
    return normalize_whitespace(base_text)


def dump_json(path: Path, payload: dict[str, Any]) -> None:
    """Write JSON with stable formatting and escaped Unicode."""
    path.write_text(
        json.dumps(payload, indent=2, ensure_ascii=True) + "\n",
        encoding="utf-8",
    )


def sanitize_collection(data: dict[str, Any]) -> dict[str, Any]:
    """Return a cleaned collection record."""
    cleaned = {
        key: value
        for key, value in data.items()
        if key not in {"sourceUrl", "sourceUrls"}
    }
    cleaned["schemaVersion"] = TARGET_SCHEMA_VERSION
    if "description" in cleaned:
        cleaned["description"] = sanitize_text(str(cleaned["description"] or ""), "")
    return cleaned


def sanitize_product(data: dict[str, Any]) -> dict[str, Any]:
    """Return a cleaned product record with local-only image metadata."""
    cleaned = {
        key: value
        for key, value in data.items()
        if key not in {"sourceUrl", "sourceUrls"}
    }
    cleaned["schemaVersion"] = TARGET_SCHEMA_VERSION

    primary_category = dict(cleaned.get("primaryCategory") or {})
    primary_category.pop("sourceUrl", None)
    cleaned["primaryCategory"] = primary_category

    cleaned["categories"] = [
        {key: value for key, value in category.items() if key != "sourceUrl"}
        for category in cleaned.get("categories", [])
    ]

    cleaned["images"] = [
        {key: value for key, value in image.items() if key != "sourceUrl"}
        for image in cleaned.get("images", [])
    ]

    cleaned_html = sanitize_html(str(cleaned.get("descriptionHtml") or ""))
    cleaned["descriptionHtml"] = cleaned_html
    cleaned["descriptionText"] = sanitize_text(
        str(cleaned.get("descriptionText") or ""),
        cleaned_html,
    )
    return cleaned


def sanitize_manifest(data: dict[str, Any]) -> dict[str, Any]:
    """Return a cleaned top-level inventory manifest."""
    cleaned = {
        key: value
        for key, value in data.items()
        if key not in {"sourceUrl", "sourceUrls"}
    }
    cleaned["schemaVersion"] = TARGET_SCHEMA_VERSION
    cleaned["products"] = [
        {
            key: value
            for key, value in product.items()
            if key not in {"sourceUrl", "sourceUrls"}
        }
        for product in cleaned.get("products", [])
    ]
    cleaned["collections"] = [
        {
            key: value
            for key, value in collection.items()
            if key not in {"sourceUrl", "sourceUrls"}
        }
        for collection in cleaned.get("collections", [])
    ]
    return cleaned


def main() -> None:
    """Sanitize all inventory records in place and report summary counts."""
    root = repo_root()
    inventory_root = root / "data" / "inventory" / "notionworx"
    products_dir = inventory_root / "products"
    collections_dir = inventory_root / "collections"
    manifest_path = inventory_root / "manifest.json"

    product_paths = sorted(products_dir.rglob("*.json"))
    collection_paths = sorted(collections_dir.glob("*.json"))

    for product_path in product_paths:
        product = json.loads(product_path.read_text(encoding="utf-8"))
        dump_json(product_path, sanitize_product(product))

    for collection_path in collection_paths:
        collection = json.loads(collection_path.read_text(encoding="utf-8"))
        dump_json(collection_path, sanitize_collection(collection))

    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    dump_json(manifest_path, sanitize_manifest(manifest))

    print(
        json.dumps(
            {
                "schemaVersion": TARGET_SCHEMA_VERSION,
                "productsSanitized": len(product_paths),
                "collectionsSanitized": len(collection_paths),
                "manifestSanitized": str(manifest_path.relative_to(root)),
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
