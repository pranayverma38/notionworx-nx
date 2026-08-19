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

const COLOR_SWATCHES = [
  "bg-black",
  "bg-white",
  "bg-dark-gray",
  "bg-dark-blue",
  "bg-olive-brown",
  "bg-beige",
  "bg-warm-brown",
  "bg-midnight-blue",
  "bg-light-pink",
  "bg-sand-beige",
];

function readJson(relativePath) {
  const absolutePath = path.join(repoRoot, relativePath);
  return JSON.parse(readFileSync(absolutePath, "utf8"));
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function toSentenceCase(value) {
  const normalized = String(value || "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) return "";
  return normalized
    .split(" ")
    .map((part) =>
      part.length <= 3 && /^[A-Z0-9]+$/.test(part)
        ? part
        : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(),
    )
    .join(" ");
}

function cleanDescription(text) {
  const cleaned = String(text || "")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/\bDownload Template\b/gi, "")
    .replace(/\bTemplate\b/gi, "")
    .replace(/\bInstallation Guide\b/gi, "")
    .replace(/\bsetup instruction\b/gi, "")
    .replace(/\binstallation instruction\b/gi, "")
    .replace(/\bSpecsheet\b/gi, "")
    .replace(/\bWarning Label\b/gi, "")
    .replace(/\bFire Certificate\b/gi, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\s{2,}/g, " ")
    .trim();

  return cleaned;
}

function buildExcerpt(text, maxLength = 280) {
  const normalized = cleanDescription(text);
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

function looksLikeColorOption(name) {
  return /color|colour/i.test(String(name || ""));
}

function normalizeOptionValues(option) {
  return unique(
    (option?.values || []).filter(
      (value) =>
        value &&
        value !== "Default Title" &&
        value.toLowerCase() !== "default title",
    ),
  );
}

function deriveColorSwatches(product) {
  const colorOption = product.options.find((option) =>
    looksLikeColorOption(option.name),
  );
  const colorValues = normalizeOptionValues(colorOption);

  if (!colorValues.length) {
    return [];
  }

  const imagePool =
    product.images.length > 0
      ? product.images.map((image) => image.localPath)
      : ["/assets/images/product/product-1.jpg"];

  return colorValues.slice(0, 8).map((label, index) => ({
    label,
    swatchClass: COLOR_SWATCHES[index % COLOR_SWATCHES.length],
    img: imagePool[index % imagePool.length],
  }));
}

function deriveSizes(product) {
  const sizeOption = product.options.find(
    (option) => !looksLikeColorOption(option.name) && !/^title$/i.test(option.name),
  );

  const values = normalizeOptionValues(sizeOption);
  if (values.length) return values.slice(0, 8);

  const variantTitles = unique(
    (product.variants || [])
      .map((variant) => variant.title)
      .filter((title) => title && title !== "Default Title"),
  );

  return variantTitles.slice(0, 8);
}

function buildBadges(price, compareAtPrice) {
  if (
    typeof price !== "number" ||
    typeof compareAtPrice !== "number" ||
    compareAtPrice <= price
  ) {
    return undefined;
  }

  const discount = Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
  return discount > 0 ? `-${discount}%` : undefined;
}

function isOptionSetArtifact(product) {
  return (
    String(product.handle || "").startsWith("option-set-") ||
    (product.tags || []).some(
      (tag) =>
        tag === "globo-product-options" || String(tag || "").startsWith("option-set-"),
    )
  );
}

function isStorefrontEligible(product) {
  return product.images.length > 0 && !isOptionSetArtifact(product);
}

function buildProduct(product, index) {
  const primaryImage =
    product.images[0]?.localPath ?? "/assets/images/product/product-1.jpg";
  const hoverImage = product.images[1]?.localPath ?? primaryImage;
  const images = product.images.map((image) => ({
    src: image.localPath,
  }));
  const colors = deriveColorSwatches(product);
  const sizes = deriveSizes(product);
  const price = product.price?.min ?? 0;
  const priceOld = product.price?.compareAtMax ?? undefined;
  const categoryTitles = unique(product.categories.map((category) => category.title));
  const inStock = product.variants.some((variant) => variant.available);
  const description = buildExcerpt(product.descriptionText);

  return {
    id: index + 1,
    img: primaryImage,
    imgHover: hoverImage,
    images,
    name: product.name,
    price,
    ...(typeof priceOld === "number" && priceOld > price ? { priceOld } : {}),
    ...(buildBadges(price, priceOld) ? { badge: buildBadges(price, priceOld) } : {}),
    ...(sizes.length ? { sizes } : {}),
    ...(colors.length ? { colors } : {}),
    cardVariant: "",
    filterBrands: [product.vendor || "Notion Worx"],
    filterCategory: categoryTitles,
    filterColor: colors.map((color) => color.label),
    filterSizes: sizes,
    tags: [],
    rating: 0,
    inStock,
    isStockOut: !inStock,
    services: [],
    category: product.primaryCategory.title,
    description,
    sku: product.skus[0] || undefined,
    reviewsText: `${product.price?.variantCount ?? product.variants.length} option${(product.price?.variantCount ?? product.variants.length) === 1 ? "" : "s"}`,
    soldLabel: inStock ? "Available to order" : "Currently unavailable",
    badgeLabel: toSentenceCase(product.productType || product.primaryCategory.title),
    badgeSubtext: `${product.images.length} product image${product.images.length === 1 ? "" : "s"} available`,
  };
}

function buildCategory(collection, eligibleProducts) {
  const matchingProducts = eligibleProducts.filter((product) =>
    product.categories.some((category) => category.handle === collection.handle),
  );
  const productsCount = matchingProducts.length;
  const sampleProduct = matchingProducts[0];

  return {
    name: collection.title,
    img:
      collection.image?.localPath ||
      sampleProduct?.images?.[0]?.localPath ||
      "/assets/images/collection/cls-19.jpg",
    quantity: `${productsCount} Product${productsCount === 1 ? "" : "s"}`,
    href: `/shop-default?category=${encodeURIComponent(collection.title)}`,
  };
}

function buildCollectionGallery(collection) {
  const images =
    Array.isArray(collection.images) && collection.images.length > 0
      ? collection.images
      : collection.image
        ? [collection.image]
        : [];

  return {
    handle: collection.handle,
    title: collection.title,
    description: collection.description,
    productsCount: collection.productsCount,
    image: collection.image?.localPath || null,
    images: images.map((image) => ({
      src: image.localPath,
      width: image.width,
      height: image.height,
    })),
  };
}

const manifest = readJson("data/inventory/notionworx/manifest.json");
const inventoryCollections = manifest.collections.map((record) =>
  readJson(record.filePath),
);
const inventoryProducts = manifest.products.map((record) => readJson(record.dataPath));
const storefrontInventoryProducts = inventoryProducts.filter(isStorefrontEligible);
const storefrontProducts = storefrontInventoryProducts.map(buildProduct);

const storefrontCategories = inventoryCollections
  .filter(
    (collection) =>
      collection.handle.toLowerCase() !== "uncategorized" &&
      (collection.image?.localPath ||
        storefrontInventoryProducts.some((product) =>
          product.categories.some((category) => category.handle === collection.handle),
        )),
  )
  .sort((left, right) => right.productsCount - left.productsCount)
  .map((collection) => buildCategory(collection, storefrontInventoryProducts))
  .sort((left, right) => parseInt(right.quantity, 10) - parseInt(left.quantity, 10));

const storefrontCollectionGalleries = inventoryCollections
  .filter((collection) => collection.handle.toLowerCase() !== "uncategorized")
  .map(buildCollectionGallery);

const fileContents = `/* This file is generated by scripts/generate-notionworx-storefront.mjs. */

export const storefrontProducts = ${JSON.stringify(storefrontProducts, null, 2)} as const;

export const storefrontCategories = ${JSON.stringify(storefrontCategories, null, 2)} as const;

export const storefrontCollectionGalleries = ${JSON.stringify(storefrontCollectionGalleries, null, 2)} as const;
`;

writeFileSync(outputPath, fileContents);
console.log(
  `Generated storefront adapter with ${storefrontProducts.length} products and ${storefrontCategories.length} categories.`,
);
