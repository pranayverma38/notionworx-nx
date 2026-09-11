import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const outputPath = path.join(
  repoRoot,
  "data/inventory/notionworx/storefront.generated.ts",
);
const sharedProductAddOnCatalogPath = path.join(
  repoRoot,
  "data/inventory/notionworx/product-addons.shared.generated.json",
);
const manifestPath = path.join(
  repoRoot,
  "data/inventory/notionworx/manifest.json",
);

function readJson(absolutePath) {
  return JSON.parse(readFileSync(absolutePath, "utf8"));
}

function getRequiredEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required to generate the Medusa storefront snapshot.`);
  }
  return value;
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeImageUrl(value) {
  const normalized = normalizeString(value);
  return normalized || undefined;
}

function readMetadataRecord(metadata, key) {
  const value = metadata?.[key];
  return value && typeof value === "object" && !Array.isArray(value) ? value : undefined;
}

function readMetadataRecordArray(metadata, key) {
  const value = metadata?.[key];
  return Array.isArray(value)
    ? value.filter((entry) => entry && typeof entry === "object" && !Array.isArray(entry))
    : [];
}

function readMetadataString(metadata, keys) {
  for (const key of keys) {
    const value = metadata?.[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
}

function readMetadataStringArray(metadata, keys) {
  for (const key of keys) {
    const value = metadata?.[key];
    if (Array.isArray(value)) {
      return value
        .filter((entry) => typeof entry === "string")
        .map((entry) => entry.trim())
        .filter(Boolean);
    }
  }
  return [];
}

function firstNonEmptyArray(...candidates) {
  for (const candidate of candidates) {
    if (Array.isArray(candidate) && candidate.length > 0) {
      return candidate;
    }
  }
  return [];
}

function readMetadataNumber(metadata, keys) {
  for (const key of keys) {
    const value = metadata?.[key];
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === "string" && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }
  return undefined;
}

function readPriceAmount(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value > 1000 ? value / 100 : value;
  }
  return undefined;
}

function firstDefined(values) {
  return values.find((value) => value != null);
}

function buildSizeVariants(metadata, variants) {
  const sourceVariants =
    readMetadataRecordArray(metadata, "source_variants") ||
    readMetadataRecordArray(variants?.[0]?.metadata, "source_variants");

  if (sourceVariants.length > 0) {
    return sourceVariants
      .map((variant, index) => {
        const title = normalizeString(variant.title);
        const price = readPriceAmount(variant.price);
        const compareAtPrice = readPriceAmount(variant.compareAtPrice);
        if (!title || typeof price !== "number") {
          return null;
        }
        return {
          value: title,
          price,
          ...(typeof compareAtPrice === "number" && compareAtPrice > price
            ? { compareAtPrice }
            : {}),
          ...(index === 0 ? { active: true } : {}),
        };
      })
      .filter(Boolean);
  }

  const options =
    readMetadataRecordArray(metadata, "source_options") ||
    readMetadataRecordArray(variants?.[0]?.metadata, "source_options");
  const option = options.find((entry) => Array.isArray(entry.values) && entry.values.length > 0);

  if (!option) {
    return [];
  }

  const values = option.values
    .filter((entry) => typeof entry === "string" && entry.trim())
    .map((entry) => entry.trim());

  if (values.length === 0) {
    return [];
  }

  const fallbackPrice = readMetadataNumber(readMetadataRecord(metadata, "source_price"), ["min"]);
  return values.map((value, index) => ({
    value,
    ...(typeof fallbackPrice === "number" ? { price: fallbackPrice } : {}),
    ...(index === 0 ? { active: true } : {}),
  }));
}

function buildProduct(product, sharedAddOnCatalog, orderIndexByHandle) {
  const metadata = product.metadata ?? {};
  const handle =
    readMetadataString(metadata, ["source_handle", "sourceHandle"]) ??
    normalizeString(product.handle);
  if (!handle) {
    return null;
  }

  const sourcePrice = readMetadataRecord(metadata, "source_price");
  const sizeVariants = buildSizeVariants(metadata, product.variants ?? []);
  const sizes = sizeVariants.map((variant) => variant.value);
  const primaryVariant = product.variants?.[0];
  const productTags = Array.isArray(product.tags)
    ? product.tags
        .map((tag) =>
          typeof tag === "string" ? tag : normalizeString(tag?.value),
        )
        .filter(Boolean)
    : [];
  const filterCategory = firstNonEmptyArray(
    readMetadataStringArray(metadata, ["source_categories", "source_category_titles"]),
    [normalizeString(product.collection?.title)].filter(Boolean),
  );
  const images = (product.images ?? [])
    .map((image) => normalizeImageUrl(image?.url))
    .filter(Boolean)
    .map((src) => ({ src }));
  const primaryImage =
    images[0]?.src ??
    normalizeImageUrl(product.thumbnail) ??
    "/assets/images/shop/product-placeholder.jpg";
  const imageUrls = primaryImage && images.length === 0 ? [{ src: primaryImage }] : images;
  const price = firstDefined([
    readMetadataNumber(sourcePrice, ["min"]),
    typeof sizeVariants[0]?.price === "number" ? sizeVariants[0].price : undefined,
    readPriceAmount(primaryVariant?.prices?.[0]?.amount),
  ]) ?? 0;
  const priceOld = firstDefined([
    readMetadataNumber(sourcePrice, ["compareAtPrice", "compare_at_price", "max"]),
    typeof sizeVariants[0]?.compareAtPrice === "number"
      ? sizeVariants[0].compareAtPrice
      : undefined,
  ]);
  const descriptionText =
    readMetadataString(metadata, ["description_text", "descriptionText"]) ??
    normalizeString(product.description);
  const addOnGroupKeys =
    readMetadataStringArray(metadata, ["source_add_on_group_keys", "sourceAddOnGroupKeys"]) ||
    sharedAddOnCatalog.products?.[handle] ||
    [];
  const addOnGroups = addOnGroupKeys
    .map((key) => sharedAddOnCatalog.groups?.[key])
    .filter(Boolean);
  const sourceVariants =
    readMetadataRecordArray(metadata, "source_variants") ||
    readMetadataRecordArray(primaryVariant?.metadata, "source_variants");
  const sku =
    (
      sourceVariants
        .map((variant) => normalizeString(variant.sku))
        .find((value) => value && value.toLowerCase() !== "none") ??
      normalizeString(primaryVariant?.sku)
    ) || undefined;
  const inStock =
    sourceVariants.length > 0
      ? sourceVariants.some((variant) => variant.available !== false)
      : true;
  const orderIndex = orderIndexByHandle.get(handle) ?? Number.MAX_SAFE_INTEGER;

  return {
    id:
      readMetadataNumber(metadata, ["source_product_id", "sourceProductId"]) ??
      orderIndex + 1,
    sourceProductId: readMetadataNumber(metadata, [
      "source_product_id",
      "sourceProductId",
    ]),
    sourceHandle: handle,
    sourceSlug:
      readMetadataString(metadata, ["source_slug", "sourceSlug"]) ?? handle,
    img: primaryImage,
    ...(imageUrls[1]?.src ? { imgHover: imageUrls[1].src } : {}),
    images: imageUrls,
    name: normalizeString(product.title) || handle,
    price,
    ...(typeof priceOld === "number" && priceOld > price ? { priceOld } : {}),
    ...(sizes.length > 0 ? { sizes } : {}),
    ...(sizeVariants.length > 0 ? { sizeVariants } : {}),
    ...(readMetadataString(metadata, ["source_variant_label", "sourceVariantLabel"])
      ? {
          variantLabel: readMetadataString(metadata, [
            "source_variant_label",
            "sourceVariantLabel",
          ]),
        }
      : {}),
    cardVariant: "",
    filterBrands: [
      readMetadataString(metadata, ["source_vendor", "sourceVendor"]) ?? "Notion Worx",
    ],
    filterCategory,
    filterColor: [],
    filterSizes: sizes,
    tags: firstNonEmptyArray(
      readMetadataStringArray(metadata, ["source_tags", "tags"]),
      productTags,
    ),
    rating: 0,
    inStock,
    isStockOut: !inStock,
    services: [],
    category: filterCategory[0] ?? normalizeString(product.collection?.title),
    description: descriptionText,
    ...(readMetadataString(metadata, ["description_html", "descriptionHtml"])
      ? {
          descriptionHtml: readMetadataString(metadata, [
            "description_html",
            "descriptionHtml",
          ]),
        }
      : {}),
    ...(descriptionText ? { descriptionText } : {}),
    ...(readMetadataString(metadata, ["dimensions_html", "dimensionsHtml"])
      ? {
          dimensionsHtml: readMetadataString(metadata, [
            "dimensions_html",
            "dimensionsHtml",
          ]),
        }
      : {}),
    ...(readMetadataString(metadata, ["dimensions_text", "dimensionsText"])
      ? {
          dimensionsText: readMetadataString(metadata, [
            "dimensions_text",
            "dimensionsText",
          ]),
        }
      : {}),
    ...(readMetadataString(metadata, ["warranty_html", "warrantyHtml"])
      ? {
          warrantyHtml: readMetadataString(metadata, [
            "warranty_html",
            "warrantyHtml",
          ]),
        }
      : {}),
    ...(readMetadataString(metadata, ["warranty_text", "warrantyText"])
      ? {
          warrantyText: readMetadataString(metadata, [
            "warranty_text",
            "warrantyText",
          ]),
        }
      : {}),
    ...(readMetadataString(metadata, ["how_to_order_html", "howToOrderHtml"])
      ? {
          howToOrderHtml: readMetadataString(metadata, [
            "how_to_order_html",
            "howToOrderHtml",
          ]),
        }
      : {}),
    ...(readMetadataString(metadata, ["how_to_order_text", "howToOrderText"])
      ? {
          howToOrderText: readMetadataString(metadata, [
            "how_to_order_text",
            "howToOrderText",
          ]),
        }
      : {}),
    ...(sku ? { sku } : {}),
    ...(addOnGroups.length > 0 ? { addOnGroups } : {}),
    badgeLabel: filterCategory[0] ?? undefined,
    badgeSubtext: `${imageUrls.length} product image${imageUrls.length === 1 ? "" : "s"} available`,
  };
}

async function fetchPaginated(pathname, headers, key) {
  const baseUrl = getRequiredEnv("MEDUSA_BACKEND_URL").replace(/\/+$/, "");
  const records = [];
  let offset = 0;
  const limit = 250;

  while (true) {
    const separator = pathname.includes("?") ? "&" : "?";
    const response = await fetch(
      `${baseUrl}${pathname}${separator}limit=${limit}&offset=${offset}`,
      { headers },
    );

    if (!response.ok) {
      throw new Error(`${pathname} failed with ${response.status}`);
    }

    const payload = await response.json();
    const page = Array.isArray(payload[key]) ? payload[key] : [];
    if (page.length === 0) {
      break;
    }

    records.push(...page);
    offset += page.length;

    if (typeof payload.count === "number" && offset >= payload.count) {
      break;
    }
  }

  return records;
}

async function main() {
  const adminApiKey = getRequiredEnv("MEDUSA_ADMIN_API_KEY");
  const collections = await fetchPaginated(
    "/admin/collections",
    {
      Authorization: `Basic ${adminApiKey}`,
      Accept: "application/json",
    },
    "collections",
  );
  const products = await fetchPaginated(
    "/admin/products",
    {
      Authorization: `Basic ${adminApiKey}`,
      Accept: "application/json",
    },
    "products",
  );

  const manifest = readJson(manifestPath);
  const sharedAddOnCatalog = readJson(sharedProductAddOnCatalogPath);
  const orderIndexByHandle = new Map(
    (manifest.products ?? [])
      .filter((record) => typeof record.handle === "string" && record.handle.trim())
      .map((record, index) => [record.handle.trim(), index]),
  );

  const storefrontProducts = products
    .map((product) => buildProduct(product, sharedAddOnCatalog, orderIndexByHandle))
    .filter(Boolean)
    .sort((left, right) => {
      const leftIndex = orderIndexByHandle.get(left.sourceHandle) ?? Number.MAX_SAFE_INTEGER;
      const rightIndex = orderIndexByHandle.get(right.sourceHandle) ?? Number.MAX_SAFE_INTEGER;
      if (leftIndex !== rightIndex) {
        return leftIndex - rightIndex;
      }
      return left.name.localeCompare(right.name);
    });
  const storefrontProductsByHandle = new Map(
    storefrontProducts.map((product) => [product.sourceHandle, product]),
  );

  const storefrontCategories = collections
    .map((collection) => {
      const title =
        readMetadataString(collection.metadata, ["source_title", "title"]) ??
        normalizeString(collection.title);
      if (!title) {
        return null;
      }

      const collectionProducts = products.filter((product) => {
        const collectionId = normalizeString(product.collection_id);
        const nestedCollectionId = normalizeString(product.collection?.id);
        return collectionId === normalizeString(collection.id) ||
          nestedCollectionId === normalizeString(collection.id);
      });
      const matchingProductImage = collectionProducts
        .map((product) => storefrontProductsByHandle.get(normalizeString(product.handle)))
        .find(Boolean)?.img;
      const sourceImageUrl = readMetadataString(collection.metadata, [
        "source_image_url",
        "image_url",
        "thumbnail",
      ]);
      const localSourceImage = sourceImageUrl?.includes("/assets/")
        ? sourceImageUrl.slice(sourceImageUrl.indexOf("/assets/"))
        : undefined;
      const img =
        matchingProductImage ??
        localSourceImage ??
        sourceImageUrl;

      return {
        name: title,
        img,
        quantity: `${collectionProducts.length} Product${collectionProducts.length === 1 ? "" : "s"}`,
        href: `/shop-default?category=${encodeURIComponent(title)}`,
      };
    })
    .filter((category) => category && category.img)
    .sort((left, right) => {
      const leftCount = Number.parseInt(left.quantity, 10) || 0;
      const rightCount = Number.parseInt(right.quantity, 10) || 0;
      return rightCount - leftCount;
    });

  const fileContents = `/* This file is generated by scripts/generate-medusa-storefront.mjs. */

export const storefrontProducts = ${JSON.stringify(storefrontProducts, null, 2)} as const;

export const storefrontCategories = ${JSON.stringify(storefrontCategories, null, 2)} as const;

export const storefrontCollectionGalleries = [] as const;
`;

  writeFileSync(outputPath, fileContents);
  console.log(
    `Generated Medusa storefront adapter with ${storefrontProducts.length} products and ${storefrontCategories.length} categories.`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
