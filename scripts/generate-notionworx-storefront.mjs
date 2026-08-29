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

function normalizeLongFormField(value) {
  const normalized = String(value || "").trim();
  return normalized.length > 0 ? normalized : undefined;
}

const STRUCTURED_DESCRIPTION_COLLECTIONS = new Set(["10x10", "10x20"]);
const SECTION_TITLES = new Set([
  "features",
  "product dimensions",
  "kit include",
  "kit includes",
  "materials",
  "primary usage",
  "order cutoff time",
  "warranty",
  "faq",
  "what's included",
  "additional notes",
  "optional accessories",
  "compatibility",
  "certifications",
  "imprint method",
]);

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function decodeHtmlEntities(value) {
  return String(value)
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&#x27;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, codePoint) =>
      String.fromCodePoint(Number.parseInt(codePoint, 10)),
    )
    .replace(/&#x([0-9a-f]+);/gi, (_, codePoint) =>
      String.fromCodePoint(Number.parseInt(codePoint, 16)),
    );
}

function stripHtml(value) {
  return decodeHtmlEntities(String(value || ""))
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitHtmlLines(innerHtml) {
  return String(innerHtml || "")
    .split(/<br\s*\/?>/gi)
    .map((segment) => ({
      html: segment.trim(),
      text: stripHtml(segment),
    }))
    .filter((segment) => segment.text.length > 0);
}

function normalizeSectionTitle(value) {
  return String(value || "")
    .replace(/:$/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isSectionTitle(value) {
  return SECTION_TITLES.has(normalizeSectionTitle(value).toLowerCase());
}

function startsWithEmojiOrSymbol(value) {
  return /^[\u2190-\u2BFF\u2600-\u27BF\u{1F000}-\u{1FAFF}]/u.test(
    String(value || "").trim(),
  );
}

function looksLikeCompactListItem(value) {
  const text = String(value || "").trim();

  if (!text) return false;
  if (startsWithEmojiOrSymbol(text)) return true;
  if (/^(?:[•*-]|\d+[.)])\s*/.test(text)) return true;
  if (/^[^.!?]{1,60}:/.test(text)) return true;
  if (text.length < 48 && !/[.!?]$/.test(text)) return true;

  return false;
}

function renderList(lines) {
  return `<ul>\n${lines.map((line) => `  <li>${line.html}</li>`).join("\n")}\n</ul>`;
}

function normalizeMultilineParagraph(match, innerHtml) {
  const lines = splitHtmlLines(innerHtml);

  if (lines.length === 0) {
    return match;
  }

  if (lines.length === 1 && isSectionTitle(lines[0].text)) {
    return `<h3>${escapeHtml(normalizeSectionTitle(lines[0].text))}</h3>`;
  }

  if (isSectionTitle(lines[0].text)) {
    const [titleLine, ...contentLines] = lines;
    const title = escapeHtml(normalizeSectionTitle(titleLine.text));

    if (contentLines.length === 0) {
      return `<h3>${title}</h3>`;
    }

    if (
      contentLines.length === 1 &&
      !looksLikeCompactListItem(contentLines[0].text)
    ) {
      return `<h3>${title}</h3>\n<p>${contentLines[0].html}</p>`;
    }

    return `<h3>${title}</h3>\n${renderList(contentLines)}`;
  }

  if (lines.length < 2) {
    return match;
  }

  const averageLength =
    lines.reduce((sum, line) => sum + line.text.length, 0) / lines.length;
  const compactItemCount = lines.filter((line) =>
    looksLikeCompactListItem(line.text),
  ).length;

  if (
    averageLength <= 90 &&
    (compactItemCount >= Math.max(2, lines.length - 1) ||
      lines.every((line) => line.text.length <= 36))
  ) {
    return renderList(lines);
  }

  return match;
}

function normalizeAboutThisItemList(html) {
  return String(html || "").replace(
    /<ul>\s*<li>(About this item[\s\S]*?)<\/li>\s*<\/ul>/i,
    (match, listItemHtml) => {
      const plainText = stripHtml(listItemHtml);

      if (!/^About this item\b/i.test(plainText)) {
        return match;
      }

      const bodyText = plainText.replace(/^About this item\b[:\s-]*/i, "").trim();
      const labelPattern = /([A-Z0-9][A-Z0-9/&()'",.\- ]{6,}?):/g;
      const labelMatches = [...bodyText.matchAll(labelPattern)].filter(
        (entry) =>
          entry.index != null &&
          /^[A-Z0-9/&()'",.\- ]+$/.test(entry[1]) &&
          entry[1].trim().split(/\s+/).length >= 2,
      );

      if (labelMatches.length < 2 || labelMatches[0].index !== 0) {
        return match;
      }

      const sections = labelMatches.map((entry, index) => {
        const start = entry.index ?? 0;
        const label = entry[1].trim();
        const bodyStart = start + entry[0].length;
        const nextStart =
          index < labelMatches.length - 1
            ? (labelMatches[index + 1].index ?? bodyText.length)
            : bodyText.length;
        const content = bodyText
          .slice(bodyStart, nextStart)
          .replace(/\s+/g, " ")
          .trim();

        return { label, content };
      });

      if (sections.some((section) => !section.content)) {
        return match;
      }

      return `<h3>About this item</h3>\n<ul>\n${sections
        .map(
          (section) =>
            `  <li><strong>${escapeHtml(section.label)}:</strong> ${escapeHtml(section.content)}</li>`,
        )
        .join("\n")}\n</ul>`;
    },
  );
}

function normalizeDescriptionHtml(product) {
  const html = normalizeLongFormField(product.descriptionHtml);

  if (!html) {
    return undefined;
  }

  const isTargetCollectionProduct = (product.categories || []).some((category) =>
    STRUCTURED_DESCRIPTION_COLLECTIONS.has(category.handle),
  );

  if (!isTargetCollectionProduct) {
    return html;
  }

  return normalizeAboutThisItemList(html).replace(
    /<p\b[^>]*>([\s\S]*?)<\/p>/gi,
    normalizeMultilineParagraph,
  );
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
  const descriptionHtml = normalizeDescriptionHtml(product);
  const descriptionText = normalizeLongFormField(product.descriptionText);
  const howToOrderHtml = normalizeLongFormField(product.howToOrderHtml);
  const howToOrderText = normalizeLongFormField(product.howToOrderText);

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
    ...(descriptionHtml ? { descriptionHtml } : {}),
    ...(descriptionText ? { descriptionText } : {}),
    ...(howToOrderHtml ? { howToOrderHtml } : {}),
    ...(howToOrderText ? { howToOrderText } : {}),
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
