#!/usr/bin/env python3
"""Crawl a storefront catalog into local inventory files.

This script discovers collections from the public catalog, fetches product
metadata from Shopify collection JSON endpoints, stores one JSON file per
product, and mirrors all exposed product images into the repo's `public/`
folder so the inventory can be used without a live dependency.
"""

from __future__ import annotations

import argparse
import json
import logging
import re
import shutil
import time
from dataclasses import dataclass
from html import unescape
from html.parser import HTMLParser
from pathlib import Path
from typing import Any
from urllib.error import HTTPError
from urllib.parse import urlparse
from urllib.request import Request, urlopen


LOGGER = logging.getLogger("catalog-crawler")

REPO_ROOT = Path(__file__).resolve().parents[1]
OUTPUT_ROOT = REPO_ROOT / "data" / "inventory" / "notionworx"
PRODUCTS_ROOT = OUTPUT_ROOT / "products"
COLLECTIONS_ROOT = OUTPUT_ROOT / "collections"
MANIFEST_PATH = OUTPUT_ROOT / "manifest.json"
IMAGES_ROOT = REPO_ROOT / "public" / "assets" / "images" / "notionworx-inventory"

USER_AGENT = "Mozilla/5.0 (compatible; notionworx-catalog-crawler/1.0)"
MIN_REQUEST_INTERVAL_SECONDS = 0.35

UNCATEGORIZED_HANDLE = "uncategorized"
UNCATEGORIZED_TITLE = "Uncategorized"
SCHEMA_VERSION = 2
_LAST_REQUEST_AT = 0.0


@dataclass(frozen=True)
class CollectionRecord:
    """One source collection discovered from the public catalog."""

    handle: str
    title: str
    description: str
    image_url: str | None
    products_count: int


class HTMLToTextParser(HTMLParser):
    """Convert limited HTML into readable plain text."""

    BLOCK_TAGS = {
        "br",
        "p",
        "div",
        "section",
        "article",
        "li",
        "ul",
        "ol",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
    }

    def __init__(self) -> None:
        """Initialize the parser state."""
        super().__init__()
        self._parts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        """Insert line breaks around block tags."""
        if tag in self.BLOCK_TAGS:
            self._parts.append("\n")

    def handle_endtag(self, tag: str) -> None:
        """Insert line breaks around block tags."""
        if tag in self.BLOCK_TAGS:
            self._parts.append("\n")

    def handle_data(self, data: str) -> None:
        """Append raw text content."""
        self._parts.append(data)

    def get_text(self) -> str:
        """Return normalized plain text content."""
        text = unescape("".join(self._parts))
        text = text.replace("\xa0", " ")
        lines = [re.sub(r"\s+", " ", line).strip() for line in text.splitlines()]
        return "\n".join(line for line in lines if line)


def build_request(url: str) -> Request:
    """Create a request with a stable user-agent."""
    return Request(url, headers={"User-Agent": USER_AGENT})


def throttle_requests() -> None:
    """Sleep briefly between requests to reduce rate limiting."""
    global _LAST_REQUEST_AT
    now = time.monotonic()
    remaining = MIN_REQUEST_INTERVAL_SECONDS - (now - _LAST_REQUEST_AT)
    if remaining > 0:
        time.sleep(remaining)
    _LAST_REQUEST_AT = time.monotonic()


def fetch_bytes(url: str, retries: int = 3) -> bytes:
    """Fetch bytes from a URL with minimal retry logic."""
    last_error: Exception | None = None
    for attempt in range(1, retries + 1):
        try:
            throttle_requests()
            with urlopen(build_request(url), timeout=60) as response:
                return response.read()
        except HTTPError as exc:  # pragma: no cover - network failures are external
            last_error = exc
            retry_after_header = exc.headers.get("Retry-After", "").strip()
            retry_after_seconds = (
                int(retry_after_header)
                if retry_after_header.isdigit()
                else min(5 * attempt, 30)
            )
            LOGGER.warning(
                "Fetch failed (%s/%s) for %s: %s; retrying in %ss",
                attempt,
                retries,
                url,
                exc,
                retry_after_seconds,
            )
            time.sleep(retry_after_seconds)
        except Exception as exc:  # pragma: no cover - network failures are external
            last_error = exc
            LOGGER.warning("Fetch failed (%s/%s) for %s: %s", attempt, retries, url, exc)
            time.sleep(attempt)
    raise RuntimeError(f"Failed to fetch {url}") from last_error


def fetch_text(url: str) -> str:
    """Fetch UTF-8 text content from a URL."""
    return fetch_bytes(url).decode("utf-8", "ignore")


def fetch_json(url: str) -> dict[str, Any]:
    """Fetch JSON data from a URL."""
    return json.loads(fetch_text(url))


def normalize_remote_url(url: str) -> str | None:
    """Normalize protocol-relative image URLs into absolute HTTPS URLs."""
    normalized = str(url or "").strip()
    if not normalized:
        return None
    if normalized.startswith("//"):
        return f"https:{normalized}"
    return normalized


def parse_catalog_handles(html: str) -> list[str]:
    """Extract ordered collection handles from the public collections page."""
    pattern = re.compile(r'href=["\'](/collections/([A-Za-z0-9-]+))["\']')
    seen: set[str] = set()
    handles: list[str] = []
    for _path, handle in pattern.findall(html):
        if handle == "all" or handle in seen:
            continue
        seen.add(handle)
        handles.append(handle)
    return handles


def parse_catalog_tile_images(html: str) -> dict[str, str]:
    """Extract any visible tile image URLs rendered on the collections grid."""
    pattern = re.compile(
        r'<div class="grid-item">\s*<a\s+href="([^"]+/collections/[^"]+|/collections/[^"]+)"'
        r'[\s\S]*?<img src="([^"]+)"[\s\S]*?<h3 class="card-overlay-heading">\s*(.*?)\s*</h3>'
        r'[\s\S]*?</a>\s*</div>',
        re.IGNORECASE,
    )
    tile_images: dict[str, str] = {}
    for href, image_url, _title in pattern.findall(html):
        handle_match = re.search(r"/collections/([^/?#]+)", href)
        handle = handle_match.group(1) if handle_match else ""
        normalized = normalize_remote_url(unescape(image_url))
        if handle and normalized:
            tile_images.setdefault(handle, normalized)
    return tile_images


def extract_first_image_url(html: str) -> str | None:
    """Return the first remote image URL embedded in collection HTML."""
    match = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', html or "", re.IGNORECASE)
    if match is None:
        return None
    return normalize_remote_url(unescape(match.group(1)))


def html_to_text(html: str) -> str:
    """Convert product HTML descriptions to normalized text."""
    parser = HTMLToTextParser()
    parser.feed(html or "")
    parser.close()
    return parser.get_text()


def parse_price(value: Any) -> float | None:
    """Parse Shopify decimal strings into floats."""
    if value in (None, "", "null"):
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def normalize_tags(raw_tags: Any) -> list[str]:
    """Normalize Shopify tags into a stable string list."""
    if isinstance(raw_tags, list):
        return [str(tag).strip() for tag in raw_tags if str(tag).strip()]
    if isinstance(raw_tags, str):
        return [tag.strip() for tag in raw_tags.split(",") if tag.strip()]
    return []


def normalize_base_url(base_url: str) -> str:
    """Normalize a user-supplied storefront base URL."""
    normalized = base_url.strip().rstrip("/")
    if not normalized.startswith(("http://", "https://")):
        raise ValueError("--base-url must start with http:// or https://")
    return normalized


def collections_page_url(base_url: str) -> str:
    """Build the public collections index URL."""
    return f"{base_url}/collections/"


def collections_api_url(base_url: str, page: int) -> str:
    """Build the collections API URL for one page."""
    return f"{base_url}/collections.json?limit=250&page={page}"


def collection_products_api_url(base_url: str, handle: str, page: int) -> str:
    """Build the collection products API URL for one page."""
    return f"{base_url}/collections/{handle}/products.json?limit=250&page={page}"


def all_products_api_url(base_url: str) -> str:
    """Build the fallback all-products API URL."""
    return f"{base_url}/collections/all/products.json?limit=250&page=1"


def product_json_url(base_url: str, handle: str) -> str:
    """Build the public product JSON URL."""
    return f"{base_url}/products/{handle}.js"


def load_collections(base_url: str, tile_images: dict[str, str]) -> list[CollectionRecord]:
    """Load all published collections from Shopify's public collections API."""
    collections: list[CollectionRecord] = []
    page = 1
    while True:
        payload = fetch_json(collections_api_url(base_url, page))
        batch = payload.get("collections", [])
        if not batch:
            break
        for item in batch:
            handle = str(item.get("handle", "")).strip()
            if not handle:
                continue
            api_image = item.get("image") or {}
            collection_image_url = (
                tile_images.get(handle)
                or normalize_remote_url(api_image.get("src") if isinstance(api_image, dict) else "")
                or extract_first_image_url(str(item.get("description", "")).strip())
            )
            collections.append(
                CollectionRecord(
                    handle=handle,
                    title=str(item.get("title", "")).strip(),
                    description=str(item.get("description", "")).strip(),
                    image_url=collection_image_url,
                    products_count=int(item.get("products_count", 0) or 0),
                )
            )
        page += 1
    return collections


def order_collections(
    catalog_handles: list[str], api_collections: list[CollectionRecord]
) -> tuple[list[CollectionRecord], list[str]]:
    """Match catalog ordering first, then append any remaining API collections."""
    collection_by_handle = {collection.handle: collection for collection in api_collections}
    ordered: list[CollectionRecord] = []
    seen: set[str] = set()
    unknown_catalog_handles: list[str] = []

    for handle in catalog_handles:
        collection = collection_by_handle.get(handle)
        if collection is None:
            unknown_catalog_handles.append(handle)
            continue
        if handle in seen:
            continue
        seen.add(handle)
        ordered.append(collection)

    for collection in api_collections:
        if collection.handle in seen:
            continue
        seen.add(collection.handle)
        ordered.append(collection)

    return ordered, unknown_catalog_handles


def fetch_collection_products(handle: str, base_url: str) -> list[dict[str, Any]]:
    """Fetch all products exposed by a collection products JSON endpoint."""
    page = 1
    products: list[dict[str, Any]] = []
    while True:
        payload = fetch_json(collection_products_api_url(base_url, handle, page))
        batch = payload.get("products", [])
        if not batch:
            break
        products.extend(batch)
        if len(batch) < 250:
            break
        page += 1
    return products


def ensure_clean_generated_output() -> None:
    """Delete only the directories and files generated by this crawler."""
    for path in (PRODUCTS_ROOT, COLLECTIONS_ROOT, IMAGES_ROOT):
        if path.exists():
            shutil.rmtree(path)
    if MANIFEST_PATH.exists():
        MANIFEST_PATH.unlink()


def ensure_parent(path: Path) -> None:
    """Create a file's parent directory if needed."""
    path.parent.mkdir(parents=True, exist_ok=True)


def write_json(path: Path, payload: Any) -> None:
    """Write formatted JSON to disk."""
    ensure_parent(path)
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=True) + "\n", encoding="utf-8")


def relative_repo_path(path: Path) -> str:
    """Return a path string relative to the repository root."""
    return path.relative_to(REPO_ROOT).as_posix()


def public_image_path(path: Path) -> str:
    """Return a browser-usable public path for a mirrored image."""
    return "/" + path.relative_to(REPO_ROOT / "public").as_posix()


def file_extension_from_url(url: str) -> str:
    """Infer an image file extension from the remote URL."""
    suffix = Path(urlparse(url).path).suffix.lower()
    if suffix in {".jpg", ".jpeg", ".png", ".webp", ".gif"}:
        return suffix
    return ".jpg"


def unique_strings(values: list[str]) -> list[str]:
    """Preserve order while removing empty strings and duplicates."""
    seen: set[str] = set()
    result: list[str] = []
    for value in values:
        normalized = value.strip()
        if not normalized or normalized in seen:
            continue
        seen.add(normalized)
        result.append(normalized)
    return result


def extract_product_image_records(raw_product: dict[str, Any]) -> list[dict[str, Any]]:
    """Return ordered image records from product media or image arrays."""
    media = raw_product.get("media", [])
    image_records: list[dict[str, Any]] = []
    seen_sources: set[str] = set()

    if isinstance(media, list):
        for media_item in media:
            if not isinstance(media_item, dict):
                continue
            if str(media_item.get("media_type", "")).lower() != "image":
                continue

            preview_image = media_item.get("preview_image") or {}
            source_url = normalize_remote_url(
                media_item.get("src")
                or (preview_image.get("src") if isinstance(preview_image, dict) else "")
            )
            if not source_url or source_url in seen_sources:
                continue

            seen_sources.add(source_url)
            image_records.append(
                {
                    "src": source_url,
                    "width": media_item.get("width")
                    or (preview_image.get("width") if isinstance(preview_image, dict) else None),
                    "height": media_item.get("height")
                    or (preview_image.get("height") if isinstance(preview_image, dict) else None),
                    "position": media_item.get("position"),
                    "variant_ids": media_item.get("variant_ids", []),
                }
            )

    if image_records:
        return image_records

    raw_images = raw_product.get("images", [])
    for index, image in enumerate(raw_images, start=1):
        if isinstance(image, dict):
            source_url = normalize_remote_url(image.get("src"))
            width = image.get("width")
            height = image.get("height")
            position = image.get("position") if image.get("position") is not None else index
            variant_ids = image.get("variant_ids", [])
        else:
            source_url = normalize_remote_url(str(image))
            width = None
            height = None
            position = index
            variant_ids = []

        if not source_url or source_url in seen_sources:
            continue

        seen_sources.add(source_url)
        image_records.append(
            {
                "src": source_url,
                "width": width,
                "height": height,
                "position": position,
                "variant_ids": variant_ids,
            }
        )

    return image_records


def hydrate_product_media(raw_product: dict[str, Any], base_url: str) -> dict[str, Any]:
    """Enrich collection payloads with product-page media when available."""
    handle = str(raw_product.get("handle", "")).strip()
    if not handle:
        return raw_product

    try:
        detailed_product = fetch_json(product_json_url(base_url, handle))
    except RuntimeError:
        LOGGER.warning("Falling back to collection JSON media for %s", handle)
        return raw_product

    detailed_images = extract_product_image_records(detailed_product)
    if not detailed_images:
        return raw_product

    enriched_product = dict(raw_product)
    enriched_product["images"] = detailed_images
    enriched_product["media"] = detailed_product.get("media", [])
    return enriched_product


def build_price_summary(variants: list[dict[str, Any]]) -> dict[str, Any]:
    """Compute min/max price values across all variants."""
    prices = [price for price in (parse_price(v.get("price")) for v in variants) if price is not None]
    compare_at_prices = [
        price
        for price in (parse_price(v.get("compare_at_price")) for v in variants)
        if price is not None
    ]
    return {
        "min": min(prices) if prices else None,
        "max": max(prices) if prices else None,
        "compareAtMin": min(compare_at_prices) if compare_at_prices else None,
        "compareAtMax": max(compare_at_prices) if compare_at_prices else None,
        "variantCount": len(variants),
    }


def download_images(
    raw_product: dict[str, Any],
    primary_category_handle: str,
    product_handle: str,
    skip_images: bool,
) -> list[dict[str, Any]]:
    """Mirror all product images locally and return inventory image metadata."""
    product_images = extract_product_image_records(raw_product)
    assets: list[dict[str, Any]] = []
    seen_sources: set[str] = set()

    for index, image in enumerate(product_images, start=1):
        source_url = str(image.get("src", "")).strip()
        if not source_url or source_url in seen_sources:
            continue

        seen_sources.add(source_url)
        suffix = file_extension_from_url(source_url)
        local_file = (
            IMAGES_ROOT
            / primary_category_handle
            / product_handle
            / f"{index:02d}{suffix}"
        )

        if not skip_images:
            ensure_parent(local_file)
            local_file.write_bytes(fetch_bytes(source_url))

        assets.append(
            {
                "localPath": public_image_path(local_file),
                "width": int(image["width"]) if image.get("width") is not None else None,
                "height": int(image["height"]) if image.get("height") is not None else None,
                "position": int(image["position"]) if image.get("position") is not None else None,
                "variantIds": [
                    int(variant_id)
                    for variant_id in image.get("variant_ids", [])
                    if variant_id is not None
                ],
            }
        )

    return assets


def download_collection_image(
    collection: CollectionRecord,
    skip_images: bool,
) -> dict[str, Any] | None:
    """Mirror one collection/category image locally when available."""
    source_url = normalize_remote_url(collection.image_url)
    if not source_url:
        return None

    suffix = file_extension_from_url(source_url)
    local_file = IMAGES_ROOT / "collections" / collection.handle / f"01{suffix}"

    if not skip_images:
        ensure_parent(local_file)
        local_file.write_bytes(fetch_bytes(source_url))

    return {
        "localPath": public_image_path(local_file),
        "width": None,
        "height": None,
    }


def build_product_payload(
    raw_product: dict[str, Any],
    categories: list[dict[str, str]],
    skip_images: bool,
) -> tuple[dict[str, Any], str]:
    """Transform one raw Shopify product into the persisted inventory schema."""
    primary_category = categories[0]
    handle = str(raw_product.get("handle", "")).strip()
    description_html = str(raw_product.get("body_html", "") or "")
    description_text = html_to_text(description_html)
    variants = raw_product.get("variants", [])
    options = raw_product.get("options", [])

    image_assets = download_images(
        raw_product=raw_product,
        primary_category_handle=primary_category["handle"],
        product_handle=handle,
        skip_images=skip_images,
    )

    payload = {
        "schemaVersion": SCHEMA_VERSION,
        "id": int(raw_product.get("id")),
        "handle": handle,
        "slug": handle,
        "name": str(raw_product.get("title", "")).strip(),
        "vendor": str(raw_product.get("vendor", "")).strip() or None,
        "productType": str(raw_product.get("product_type", "")).strip() or None,
        "primaryCategory": primary_category,
        "categories": categories,
        "descriptionHtml": description_html,
        "descriptionText": description_text,
        "tags": normalize_tags(raw_product.get("tags")),
        "skus": unique_strings(
            [str(variant.get("sku", "") or "").strip() for variant in variants]
        ),
        "price": build_price_summary(variants),
        "options": [
            {
                "name": str(option.get("name", "")).strip(),
                "position": int(option.get("position", 0) or 0),
                "values": [str(value).strip() for value in option.get("values", []) if str(value).strip()],
            }
            for option in options
        ],
        "variants": [
            {
                "id": int(variant.get("id")),
                "title": str(variant.get("title", "")).strip(),
                "sku": str(variant.get("sku", "")).strip() or None,
                "available": bool(variant.get("available")),
                "price": parse_price(variant.get("price")),
                "compareAtPrice": parse_price(variant.get("compare_at_price")),
                "optionValues": unique_strings(
                    [
                        str(variant.get("option1", "") or ""),
                        str(variant.get("option2", "") or ""),
                        str(variant.get("option3", "") or ""),
                    ]
                ),
                "requiresShipping": bool(variant.get("requires_shipping")),
                "taxable": bool(variant.get("taxable")),
                "grams": int(variant["grams"]) if variant.get("grams") is not None else None,
                "position": int(variant["position"]) if variant.get("position") is not None else None,
            }
            for variant in variants
        ],
        "images": image_assets,
        "createdAt": raw_product.get("created_at"),
        "updatedAt": raw_product.get("updated_at"),
        "publishedAt": raw_product.get("published_at"),
    }

    output_path = PRODUCTS_ROOT / primary_category["handle"] / f"{handle}.json"
    write_json(output_path, payload)
    return payload, relative_repo_path(output_path)


def crawl_catalog(skip_images: bool, base_url: str) -> dict[str, Any]:
    """Run the full crawl and return a summary manifest payload."""
    collections_url = collections_page_url(base_url)
    all_products_url = all_products_api_url(base_url)

    LOGGER.info("Fetching catalog page from %s", collections_url)
    catalog_html = fetch_text(collections_url)
    catalog_handles = parse_catalog_handles(catalog_html)
    catalog_tile_images = parse_catalog_tile_images(catalog_html)

    LOGGER.info("Loading collection metadata from public API")
    api_collections = load_collections(base_url, catalog_tile_images)
    ordered_collections, unknown_catalog_handles = order_collections(catalog_handles, api_collections)

    if unknown_catalog_handles:
        LOGGER.info(
            "Ignored %s catalog handles missing from collections API: %s",
            len(unknown_catalog_handles),
            ", ".join(sorted(set(unknown_catalog_handles))),
        )

    product_sources: dict[str, dict[str, Any]] = {}
    product_categories: dict[str, list[dict[str, str]]] = {}
    collection_manifests: list[dict[str, Any]] = []
    category_priority = {
        collection.handle: (collection.products_count, index)
        for index, collection in enumerate(ordered_collections)
    }
    category_priority[UNCATEGORIZED_HANDLE] = (10**9, 10**9)

    for collection in ordered_collections:
        LOGGER.info("Fetching products for collection %s", collection.handle)
        raw_products = fetch_collection_products(collection.handle, base_url)
        product_handles: list[str] = []
        category_ref = {
            "handle": collection.handle,
            "title": collection.title,
        }
        for raw_product in raw_products:
            handle = str(raw_product.get("handle", "")).strip()
            if not handle:
                continue
            if handle not in product_sources:
                product_sources[handle] = hydrate_product_media(raw_product, base_url)
            product_handles.append(handle)
            categories = product_categories.setdefault(handle, [])
            if category_ref not in categories:
                categories.append(category_ref)

        collection_payload = {
            "schemaVersion": SCHEMA_VERSION,
            "handle": collection.handle,
            "title": collection.title,
            "description": collection.description,
            "image": download_collection_image(collection, skip_images),
            "productsCount": collection.products_count,
            "productHandles": sorted(set(product_handles)),
        }
        collection_path = COLLECTIONS_ROOT / f"{collection.handle}.json"
        write_json(collection_path, collection_payload)
        collection_manifests.append(
            {
                "handle": collection.handle,
                "title": collection.title,
                "productsCount": collection.products_count,
                "filePath": relative_repo_path(collection_path),
            }
        )

    LOGGER.info("Fetching /collections/all fallback for uncategorized products")
    uncategorized_handles: list[str] = []
    uncategorized_category = {
        "handle": UNCATEGORIZED_HANDLE,
        "title": UNCATEGORIZED_TITLE,
    }
    for raw_product in fetch_json(all_products_url).get("products", []):
        handle = str(raw_product.get("handle", "")).strip()
        if not handle or handle in product_sources:
            continue
        product_sources[handle] = hydrate_product_media(raw_product, base_url)
        product_categories[handle] = [uncategorized_category]
        uncategorized_handles.append(handle)

    if uncategorized_handles:
        uncategorized_payload = {
            "schemaVersion": SCHEMA_VERSION,
            "handle": UNCATEGORIZED_HANDLE,
            "title": UNCATEGORIZED_TITLE,
            "description": "Products exposed only via /collections/all during crawl.",
            "productsCount": len(uncategorized_handles),
            "productHandles": sorted(uncategorized_handles),
        }
        uncategorized_path = COLLECTIONS_ROOT / f"{UNCATEGORIZED_HANDLE}.json"
        write_json(uncategorized_path, uncategorized_payload)
        collection_manifests.append(
            {
                "handle": UNCATEGORIZED_HANDLE,
                "title": UNCATEGORIZED_TITLE,
                "productsCount": len(uncategorized_handles),
                "filePath": relative_repo_path(uncategorized_path),
            }
        )

    LOGGER.info("Writing %s product files", len(product_sources))
    product_manifest_rows: list[dict[str, Any]] = []
    image_count = 0

    for handle in sorted(product_sources):
        categories = sorted(
            product_categories[handle],
            key=lambda category: category_priority.get(category["handle"], (10**9, 10**9)),
        )
        payload, data_path = build_product_payload(
            raw_product=product_sources[handle],
            categories=categories,
            skip_images=skip_images,
        )
        image_paths = [image["localPath"] for image in payload["images"]]
        image_count += len(image_paths)
        product_manifest_rows.append(
            {
                "handle": payload["handle"],
                "name": payload["name"],
                "primaryCategoryHandle": payload["primaryCategory"]["handle"],
                "primaryCategoryTitle": payload["primaryCategory"]["title"],
                "dataPath": data_path,
                "imagePaths": image_paths,
            }
        )

    category_folder_count = len(
        {
            row["primaryCategoryHandle"]
            for row in product_manifest_rows
        }
    )
    manifest = {
        "schemaVersion": SCHEMA_VERSION,
        "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "collectionCount": len(collection_manifests),
        "categoryFolderCount": category_folder_count,
        "productCount": len(product_manifest_rows),
        "uncategorizedProductCount": len(uncategorized_handles),
        "imageCount": image_count,
        "collections": sorted(collection_manifests, key=lambda item: item["handle"]),
        "products": sorted(product_manifest_rows, key=lambda item: item["handle"]),
    }
    write_json(MANIFEST_PATH, manifest)
    return manifest


def parse_args() -> argparse.Namespace:
    """Parse CLI arguments."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--skip-images",
        action="store_true",
        help="Write product JSON without downloading image files.",
    )
    parser.add_argument(
        "--keep-existing",
        action="store_true",
        help="Do not clear previously generated output before crawling.",
    )
    parser.add_argument(
        "--base-url",
        required=True,
        help="Storefront base URL to crawl, for example https://example.com.",
    )
    return parser.parse_args()


def main() -> int:
    """Entrypoint for CLI usage."""
    args = parse_args()
    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

    if not args.keep_existing:
        LOGGER.info("Removing previous generated crawl output")
        ensure_clean_generated_output()

    manifest = crawl_catalog(
        skip_images=args.skip_images,
        base_url=normalize_base_url(args.base_url),
    )
    LOGGER.info(
        "Imported %s products across %s category folders (%s images).",
        manifest["productCount"],
        manifest["categoryFolderCount"],
        manifest["imageCount"],
    )
    LOGGER.info("Manifest written to %s", relative_repo_path(MANIFEST_PATH))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
