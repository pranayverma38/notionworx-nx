"use server";

import "server-only";

import { cache } from "react";

import { categoriesCollection } from "@/data/categories";
import { products as localProducts } from "@/data/products/products";
import {
  getSharedProductAddOnGroupsByHandle,
  getSharedProductAddOnGroupsByKeys,
  getSharedProductAddOnKeysByHandle,
} from "@/lib/notionworx-shared-addons";
import type { Category } from "@/types/categories";
import type {
  ProductCardItem,
  ProductSingleImage,
  ProductSizeVariant,
} from "@/types/productCard";
import type { ShopProduct } from "@/types/shopFilter";

const APPAREL_CATEGORY_NAME = "APPAREL";
const APPAREL_COLLECTION_HANDLE = "apparel";
const DEFAULT_OPTION_TITLES = new Set(["default option", "default title", "title"]);

const localProductsBySourceHandle = new Map(
  localProducts
    .filter(
      (product): product is ProductCardItem & { sourceHandle: string } =>
        typeof product.sourceHandle === "string" &&
        product.sourceHandle.trim().length > 0,
    )
    .map((product) => [product.sourceHandle.trim(), product]),
);

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

type JsonRecord = { [key: string]: JsonValue };

type MedusaCollection = {
  id?: string;
  title?: string;
  handle?: string;
  metadata?: JsonRecord | null;
  products?: unknown[];
  thumbnail?: string | null;
  images?: Array<string | { url?: string | null }> | null;
};

type MedusaProductOption = {
  title?: string;
  values?: Array<string | { value?: string | null }> | null;
};

type MedusaPrice = {
  amount?: number | null;
  currency_code?: string | null;
};

type MedusaCalculatedPrice = {
  calculated_amount?: number | null;
  original_amount?: number | null;
  currency_code?: string | null;
};

type MedusaVariant = {
  id?: string;
  title?: string;
  sku?: string | null;
  prices?: MedusaPrice[] | null;
  calculated_price?: MedusaCalculatedPrice | null;
  manage_inventory?: boolean | null;
  allow_backorder?: boolean | null;
  inventory_quantity?: number | null;
  options?: Array<{
    value?: string | null;
    option?: { title?: string | null } | null;
  }> | null;
  metadata?: JsonRecord | null;
};

type MedusaProduct = {
  id?: string;
  title?: string;
  handle?: string;
  description?: string | null;
  subtitle?: string | null;
  thumbnail?: string | null;
  images?: Array<string | { url?: string | null }> | null;
  metadata?: JsonRecord | null;
  collection?: MedusaCollection | null;
  collection_id?: string | null;
  options?: MedusaProductOption[] | null;
  variants?: MedusaVariant[] | null;
  tags?: Array<string | { value?: string | null }> | null;
};

type MedusaCollectionsResponse = {
  collections?: MedusaCollection[];
};

type MedusaProductsResponse = {
  products?: MedusaProduct[];
};

type MedusaRegionsResponse = {
  regions?: Array<{ id?: string }>;
};

function getMedusaConfig() {
  const backendUrl =
    process.env.MEDUSA_BACKEND_URL?.trim().replace(/\/+$/, "") ?? "";
  const apiKey = process.env.MEDUSA_API_KEY?.trim() ?? "";

  if (!backendUrl || !apiKey) {
    return null;
  }

  return { backendUrl, apiKey };
}

function getMedusaAdminConfig() {
  const backendUrl =
    process.env.MEDUSA_BACKEND_URL?.trim().replace(/\/+$/, "") ?? "";
  const adminApiKey = process.env.MEDUSA_ADMIN_API_KEY?.trim() ?? "";

  if (!backendUrl || !adminApiKey) {
    return null;
  }

  return { backendUrl, adminApiKey };
}

function buildStableProductId(seed: string): number {
  let hash = 2166136261;
  for (const character of seed) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }

  return 900_000_000 + ((hash >>> 0) % 100_000_000);
}

function normalizeCollectionName(value?: string | null): string {
  return value?.trim().toUpperCase() ?? "";
}

function isApparelCollection(collection?: MedusaCollection | null): boolean {
  if (!collection) return false;

  return (
    normalizeCollectionName(collection.title) === APPAREL_CATEGORY_NAME ||
    collection.handle?.trim().toLowerCase() === APPAREL_COLLECTION_HANDLE ||
    normalizeCollectionName(readMetadataString(collection.metadata, ["title"])) ===
      APPAREL_CATEGORY_NAME ||
    readMetadataString(collection.metadata, ["source_handle"]) ===
      APPAREL_COLLECTION_HANDLE
  );
}

function readMetadataString(
  metadata: JsonRecord | null | undefined,
  keys: string[],
): string | undefined {
  if (!metadata) {
    return undefined;
  }

  for (const key of keys) {
    const value = metadata[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return undefined;
}

function readMetadataStringArray(
  metadata: JsonRecord | null | undefined,
  keys: string[],
): string[] {
  if (!metadata) {
    return [];
  }

  for (const key of keys) {
    const value = metadata[key];
    if (Array.isArray(value)) {
      return value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
}

function readMetadataNumber(
  metadata: JsonRecord | null | undefined,
  keys: string[],
): number | undefined {
  if (!metadata) {
    return undefined;
  }

  for (const key of keys) {
    const value = metadata[key];
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === "string" && value.trim().length > 0) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return undefined;
}

function readMetadataRecord(
  metadata: JsonRecord | null | undefined,
  key: string,
): JsonRecord | undefined {
  if (!metadata) {
    return undefined;
  }

  const value = metadata[key];
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as JsonRecord;
  }

  return undefined;
}

function readMetadataRecordArray(
  metadata: JsonRecord | null | undefined,
  key: string,
): JsonRecord[] {
  if (!metadata) {
    return [];
  }

  const value = metadata[key];
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is JsonRecord =>
      item != null && typeof item === "object" && !Array.isArray(item),
  );
}

function readJsonRecordNumber(record: JsonRecord | undefined, key: string): number | undefined {
  const value = record?.[key];
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return undefined;
}

function readJsonRecordString(record: JsonRecord | undefined, key: string): string | undefined {
  const value = record?.[key];
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;
}

function normalizeImageUrl(url: string | undefined): string | undefined {
  if (!url) {
    return undefined;
  }

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  if (!url.startsWith("/")) {
    return `/${url}`;
  }

  const config = getMedusaConfig();
  if (!config) {
    return url;
  }

  return `${config.backendUrl}${url}`;
}

function pickImageUrls(
  collectionOrProduct:
    | Pick<MedusaCollection, "thumbnail" | "images">
    | Pick<MedusaProduct, "thumbnail" | "images">,
): string[] {
  const urls = new Set<string>();

  const thumbnail = normalizeImageUrl(collectionOrProduct.thumbnail ?? undefined);
  if (thumbnail) {
    urls.add(thumbnail);
  }

  for (const image of collectionOrProduct.images ?? []) {
    const url =
      typeof image === "string"
        ? normalizeImageUrl(image)
        : normalizeImageUrl(image?.url ?? undefined);
    if (url) {
      urls.add(url);
    }
  }

  return [...urls];
}

async function fetchMedusaJson<T>(pathWithQuery: string): Promise<T | null> {
  const config = getMedusaConfig();
  if (!config) {
    return null;
  }

  const response = await fetch(`${config.backendUrl}${pathWithQuery}`, {
    headers: {
      Accept: "application/json",
      "x-publishable-api-key": config.apiKey,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as T;
}

async function fetchMedusaAdminJson<T>(pathWithQuery: string): Promise<T | null> {
  const config = getMedusaAdminConfig();
  if (!config) {
    return null;
  }

  const response = await fetch(`${config.backendUrl}${pathWithQuery}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${config.adminApiKey}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as T;
}

const getMedusaRegions = cache(async () => {
  const payload = await fetchMedusaJson<MedusaRegionsResponse>("/store/regions");
  return payload?.regions ?? [];
});

const getDefaultRegionId = cache(async () => {
  const regions = await getMedusaRegions();
  return regions.find((region) => Boolean(region.id))?.id ?? undefined;
});

const getMedusaCollections = cache(async () => {
  const payload = await fetchMedusaJson<MedusaCollectionsResponse>(
    "/store/collections?limit=250",
  );

  return payload?.collections ?? [];
});

const getAdminCollectionProducts = cache(async (collectionId: string): Promise<MedusaProduct[]> => {
  const query = new URLSearchParams({
    limit: "250",
    collection_id: collectionId,
  });
  const payload = await fetchMedusaAdminJson<MedusaProductsResponse>(
    `/admin/products?${query.toString()}`,
  );
  return payload?.products ?? [];
});

function normalizeDisplayPrice(amount: number | undefined | null): number | undefined {
  if (typeof amount !== "number" || !Number.isFinite(amount)) {
    return undefined;
  }

  return Number((amount / 100).toFixed(2));
}

function extractVariantPrice(variant: MedusaVariant): number | undefined {
  const calculatedAmount = variant.calculated_price?.calculated_amount;
  if (typeof calculatedAmount === "number") {
    return normalizeDisplayPrice(calculatedAmount);
  }

  const rawAmount = variant.prices?.find((price) => typeof price.amount === "number")?.amount;
  return normalizeDisplayPrice(rawAmount);
}

function extractOldVariantPrice(variant: MedusaVariant): number | undefined {
  const originalAmount = variant.calculated_price?.original_amount;
  const calculatedAmount = variant.calculated_price?.calculated_amount;
  if (typeof originalAmount === "number") {
    if (typeof calculatedAmount === "number" && originalAmount <= calculatedAmount) {
      return undefined;
    }
    return normalizeDisplayPrice(originalAmount);
  }

  return undefined;
}

function extractSourceCompareAtPrice(sourcePrice: JsonRecord | undefined, sourceVariants: JsonRecord[]): number | undefined {
  const compareAtMin = readJsonRecordNumber(sourcePrice, "compareAtMin");
  if (typeof compareAtMin === "number") {
    return compareAtMin;
  }

  const variantCompareAtValues = sourceVariants
    .map((variant) => readJsonRecordNumber(variant, "compareAtPrice"))
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value));

  if (variantCompareAtValues.length === 0) {
    return undefined;
  }

  return Math.min(...variantCompareAtValues);
}

function collectOptionValues(option?: MedusaProductOption | null): string[] {
  return (option?.values ?? [])
    .map((value) => {
      if (typeof value === "string") {
        return value.trim();
      }

      return value?.value?.trim() ?? "";
    })
    .filter(Boolean);
}

function buildVariantOptionsMap(variant: MedusaVariant): Record<string, string> {
  const optionMap: Record<string, string> = {};

  for (const option of variant.options ?? []) {
    const optionTitle = option?.option?.title?.trim();
    const optionValue = option?.value?.trim();
    if (optionTitle && optionValue) {
      optionMap[optionTitle] = optionValue;
    }
  }

  return optionMap;
}

function isDefaultOptionTitle(title?: string | null): boolean {
  const normalized = title?.trim().toLowerCase();
  return !normalized || DEFAULT_OPTION_TITLES.has(normalized);
}

function readSourceCategoryTitles(metadata: JsonRecord | null | undefined): string[] {
  return readMetadataRecordArray(metadata, "source_categories")
    .map((category) => readJsonRecordString(category, "title"))
    .filter((title): title is string => Boolean(title));
}

function readSourcePrimaryCategoryTitle(
  metadata: JsonRecord | null | undefined,
): string | undefined {
  return readJsonRecordString(
    readMetadataRecord(metadata, "source_primary_category"),
    "title",
  );
}

function getMeaningfulOptionTitles(
  product: MedusaProduct,
  sourceOptions: JsonRecord[],
): string[] {
  const medusaTitles = (product.options ?? [])
    .map((option) => option.title?.trim())
    .filter((title): title is string => Boolean(title) && !isDefaultOptionTitle(title));

  if (medusaTitles.length > 0) {
    return medusaTitles;
  }

  return sourceOptions
    .map((option) => {
      const rawName = option.name;
      return typeof rawName === "string" ? rawName.trim() : undefined;
    })
    .filter((title): title is string => Boolean(title) && !isDefaultOptionTitle(title));
}

function buildVariantSelectionValue(
  variant: MedusaVariant,
  optionTitles: string[],
): string {
  const optionMap = buildVariantOptionsMap(variant);
  const optionValues = optionTitles
    .map((title) => optionMap[title])
    .filter((value): value is string => Boolean(value));

  if (optionValues.length > 0) {
    return optionValues.join(" / ");
  }

  const title = variant.title?.trim();
  if (title && !/^default(?: variant| title)?$/i.test(title)) {
    return title;
  }

  return "Default option";
}

function buildSourceVariantSelectionValue(
  sourceVariant: JsonRecord,
  optionTitles: string[],
): string | undefined {
  const optionValues = Array.isArray(sourceVariant.optionValues)
    ? sourceVariant.optionValues
        .filter((value): value is string => typeof value === "string")
        .map((value) => value.trim())
        .filter(Boolean)
    : [];

  if (optionTitles.length > 0 && optionValues.length > 0) {
    return optionValues.join(" / ");
  }

  const title = readJsonRecordString(sourceVariant, "title");
  if (title && !/^default(?: variant| title)?$/i.test(title)) {
    return title;
  }

  return undefined;
}

function findMatchingSourceVariant(
  sourceVariants: JsonRecord[],
  variant: MedusaVariant,
  optionTitles: string[],
): JsonRecord | undefined {
  const sku = variant.sku?.trim();
  const selectionValue = buildVariantSelectionValue(variant, optionTitles);

  return sourceVariants.find((sourceVariant) => {
    const sourceSku = readJsonRecordString(sourceVariant, "sku");
    if (sku && sourceSku && sku === sourceSku) {
      return true;
    }

    const sourceTitle = readJsonRecordString(sourceVariant, "title");
    if (sourceTitle && variant.title?.trim() === sourceTitle) {
      return true;
    }

    return buildSourceVariantSelectionValue(sourceVariant, optionTitles) === selectionValue;
  });
}

function buildVariantChoices(
  product: MedusaProduct,
  variants: MedusaVariant[],
  sourceOptions: JsonRecord[],
  sourceVariants: JsonRecord[],
): {
  variantLabel?: string;
  sizes?: string[];
  sizeVariants?: ProductSizeVariant[];
} {
  const optionTitles = getMeaningfulOptionTitles(product, sourceOptions);

  if (variants.length <= 1 && optionTitles.length === 0) {
    return {};
  }

  const entries = variants
    .map((variant) => {
      const sourceVariant = findMatchingSourceVariant(
        sourceVariants,
        variant,
        optionTitles,
      );
      const price =
        extractVariantPrice(variant) ?? readJsonRecordNumber(sourceVariant, "price");
      const compareAtPrice =
        extractOldVariantPrice(variant) ??
        readJsonRecordNumber(sourceVariant, "compareAtPrice");
      const value = buildVariantSelectionValue(variant, optionTitles);

      if (!value || typeof price !== "number") {
        return null;
      }

      return {
        value,
        price,
        ...(typeof compareAtPrice === "number" && compareAtPrice > price
          ? { compareAtPrice }
          : {}),
      } satisfies ProductSizeVariant;
    })
    .filter((entry): entry is ProductSizeVariant => entry != null);

  const uniqueEntries = Array.from(
    new Map(entries.map((entry) => [entry.value, entry])).values(),
  );

  if (uniqueEntries.length === 0) {
    return {};
  }

  const minPrice = Math.min(
    ...uniqueEntries.map((entry) =>
      typeof entry.price === "number" ? entry.price : Number.POSITIVE_INFINITY,
    ),
  );
  const sizeVariants = uniqueEntries.map((entry) => ({
    ...entry,
    ...(entry.price === minPrice ? { active: true } : {}),
  }));

  return {
    ...(optionTitles.length > 0
      ? { variantLabel: optionTitles.join(" / ") }
      : {}),
    sizes: sizeVariants.map((entry) => entry.value),
    sizeVariants,
  };
}

function isProductInStock(variants: MedusaVariant[]): boolean {
  return variants.some((variant) => {
    if (variant.allow_backorder) {
      return true;
    }

    if (variant.manage_inventory === false) {
      return true;
    }

    return typeof variant.inventory_quantity === "number"
      ? variant.inventory_quantity > 0
      : true;
  });
}

function getPrimaryVariant(variants: MedusaVariant[]): MedusaVariant | undefined {
  return variants.find((variant) => typeof extractVariantPrice(variant) === "number") ?? variants[0];
}

function mapMedusaProductToStorefrontProduct(
  product: MedusaProduct,
  collection: MedusaCollection,
): ShopProduct | null {
  const medusaId = product.id?.trim();
  const handle = product.handle?.trim();
  const title = product.title?.trim();

  if (!medusaId || !handle || !title) {
    return null;
  }

  const variants = product.variants ?? [];
  const primaryVariant = getPrimaryVariant(variants);
  const imageUrls = pickImageUrls(product);
  const images: ProductSingleImage[] = imageUrls.map((src) => ({ src }));
  const primaryImage = images[0]?.src;
  const fallbackDescription = product.description?.trim() || "";
  const metadata = product.metadata;
  const localFallback = localProductsBySourceHandle.get(handle);
  const sourcePrice = readMetadataRecord(metadata, "source_price");
  const sourceOptions = readMetadataRecordArray(metadata, "source_options");
  const sourceVariants = readMetadataRecordArray(metadata, "source_variants");
  const sourceCategoryTitles = readSourceCategoryTitles(metadata);
  const variantChoices = buildVariantChoices(
    product,
    variants,
    sourceOptions,
    sourceVariants,
  );
  const descriptionHtml = readMetadataString(metadata, [
    "description_html",
    "descriptionHtml",
  ]) ?? localFallback?.descriptionHtml;
  const descriptionText =
    readMetadataString(metadata, ["description_text", "descriptionText"]) ??
    localFallback?.descriptionText ??
    fallbackDescription;
  const howToOrderHtml = readMetadataString(metadata, [
    "how_to_order_html",
    "howToOrderHtml",
  ]) ?? localFallback?.howToOrderHtml;
  const howToOrderText = readMetadataString(metadata, [
    "how_to_order_text",
    "howToOrderText",
  ]) ?? localFallback?.howToOrderText;
  const warrantyHtml = readMetadataString(metadata, [
    "warranty_html",
    "warrantyHtml",
  ]) ?? localFallback?.warrantyHtml;
  const warrantyText = readMetadataString(metadata, [
    "warranty_text",
    "warrantyText",
  ]) ?? localFallback?.warrantyText;
  const dimensionsHtml = readMetadataString(metadata, [
    "dimensions_html",
    "dimensionsHtml",
  ]) ?? localFallback?.dimensionsHtml;
  const dimensionsText = readMetadataString(metadata, [
    "dimensions_text",
    "dimensionsText",
  ]) ?? localFallback?.dimensionsText;

  const sourcePriceMin = readJsonRecordNumber(sourcePrice, "min");
  const sourceCompareAtPrice = extractSourceCompareAtPrice(sourcePrice, sourceVariants);
  const defaultSizeVariant =
    variantChoices.sizeVariants?.find((variant) => variant.active) ??
    variantChoices.sizeVariants?.[0];
  const price =
    sourcePriceMin ??
    (typeof defaultSizeVariant?.price === "number"
      ? defaultSizeVariant.price
      : extractVariantPrice(primaryVariant ?? {}) ?? localFallback?.price ?? 0);
  const rawPriceOld =
    (typeof defaultSizeVariant?.compareAtPrice === "number"
      ? defaultSizeVariant.compareAtPrice
      : undefined) ??
    sourceCompareAtPrice ??
    extractOldVariantPrice(primaryVariant ?? {});
  const priceOld =
    typeof rawPriceOld === "number" && rawPriceOld > price ? rawPriceOld : undefined;
  const sizes = variantChoices.sizes ?? localFallback?.sizes ?? [];
  const variantLabel =
    variantChoices.variantLabel ??
    localFallback?.variantLabel ??
    product.options?.[0]?.title?.trim();
  const sourceProductId = readMetadataNumber(metadata, [
    "source_product_id",
    "sourceProductId",
  ]);
  const sourceSlug = readMetadataString(metadata, ["source_slug", "sourceSlug"]);
  const sourceSku = sourceVariants.find((variant) => {
    if (typeof variant.sku !== "string") {
      return false;
    }
    const normalized = variant.sku.trim();
    return normalized.length > 0 && normalized.toLowerCase() !== "none";
  })?.sku;
  const metadataAddOnGroupKeys = readMetadataStringArray(metadata, [
    "source_add_on_group_keys",
    "sourceAddOnGroupKeys",
  ]);
  const addOnGroupKeys =
    metadataAddOnGroupKeys.length > 0
      ? metadataAddOnGroupKeys
      : getSharedProductAddOnKeysByHandle(handle);
  const addOnGroups =
    getSharedProductAddOnGroupsByKeys(addOnGroupKeys) ??
    getSharedProductAddOnGroupsByHandle(handle);
  const sourceInStock =
    sourceVariants.length > 0
      ? sourceVariants.some((variant) => variant.available !== false)
      : undefined;
  const inStock = sourceInStock ?? isProductInStock(variants);
  const filterCategory =
    localFallback?.filterCategory && localFallback.filterCategory.length > 0
      ? [...localFallback.filterCategory]
      : sourceCategoryTitles.length > 0
        ? sourceCategoryTitles
        : [collection.title?.trim() || ""].filter(Boolean);
  const filterBrands =
    localFallback?.filterBrands && localFallback.filterBrands.length > 0
      ? [...localFallback.filterBrands]
      : [
          readMetadataString(metadata, ["source_vendor", "sourceVendor"]) ??
            "Notion Worx",
        ];
  const filterColor =
    localFallback?.filterColor && localFallback.filterColor.length > 0
      ? [...localFallback.filterColor]
      : [];
  const filterSizes =
    localFallback?.filterSizes && localFallback.filterSizes.length > 0
      ? [...localFallback.filterSizes]
      : sizes;
  const description = localFallback?.description ?? descriptionText;
  const category =
    localFallback?.category ??
    readSourcePrimaryCategoryTitle(metadata) ??
    collection.title?.trim() ??
    "";

  return {
    id: localFallback?.id ?? buildStableProductId(`medusa:${medusaId}`),
    sourceProductId,
    sourceHandle: handle,
    sourceSlug,
    img: primaryImage ?? "/assets/images/shop/product-placeholder.jpg",
    imgHover: images[1]?.src ?? primaryImage,
    images,
    name: title,
    price,
    priceOld,
    ...(sizes.length > 0 ? { sizes } : {}),
    ...(variantChoices.sizeVariants && variantChoices.sizeVariants.length > 0
      ? { sizeVariants: variantChoices.sizeVariants }
      : {}),
    ...(variantLabel ? { variantLabel } : {}),
    category,
    filterCategory,
    filterBrands,
    filterColor,
    filterSizes,
    tags: readMetadataStringArray(metadata, ["source_tags", "tags"]),
    rating: localFallback?.rating ?? 5,
    inStock,
    isStockOut: !inStock,
    services: localFallback?.services ? [...localFallback.services] : [],
    cardVariant: localFallback?.cardVariant ?? "",
    description,
    descriptionHtml,
    descriptionText,
    dimensionsHtml,
    dimensionsText,
    warrantyHtml,
    warrantyText,
    howToOrderHtml,
    howToOrderText,
    ...(addOnGroups ? { addOnGroups } : {}),
    ...(localFallback?.colors ? { colors: localFallback.colors } : {}),
    ...(localFallback?.reviewsText ? { reviewsText: localFallback.reviewsText } : {}),
    ...(localFallback?.badge ? { badge: localFallback.badge } : {}),
    ...(localFallback?.badgeTrend ? { badgeTrend: localFallback.badgeTrend } : {}),
    ...(localFallback?.marquee ? { marquee: localFallback.marquee } : {}),
    sku:
      localFallback?.sku ??
      (typeof sourceSku === "string" ? sourceSku.trim() : undefined) ??
      primaryVariant?.sku?.trim() ??
      undefined,
    soldLabel:
      localFallback?.soldLabel ?? (inStock ? "Available to order" : "Currently unavailable"),
    badgeLabel:
      localFallback?.badgeLabel ??
      (normalizeCollectionName(collection.title) === APPAREL_CATEGORY_NAME
        ? "Medusa"
        : undefined),
    ...(localFallback?.badgeSubtext
      ? { badgeSubtext: localFallback.badgeSubtext }
      : {}),
  };
}

type MedusaMappedCollection = {
  collection: MedusaCollection;
  products: ShopProduct[];
};

const getMedusaMigratedCollections = cache(
  async (): Promise<MedusaMappedCollection[]> => {
    const collections = await getMedusaCollections();

    if (collections.length === 0) {
      return [];
    }

    const regionId = await getDefaultRegionId();

    return (
      await Promise.all(
        collections
          .filter(
            (collection): collection is MedusaCollection & { id: string } =>
              typeof collection.id === "string" && collection.id.trim().length > 0,
          )
          .map(async (collection) => {
            const query = new URLSearchParams({
              limit: "250",
              collection_id: collection.id,
            });

            if (regionId) {
              query.set("region_id", regionId);
            }

            const payload = await fetchMedusaJson<MedusaProductsResponse>(
              `/store/products?${query.toString()}`,
            );
            const storeProducts = payload?.products ?? [];
            const adminProducts = await getAdminCollectionProducts(collection.id);
            const adminProductsById = new Map(
              adminProducts
                .filter(
                  (product): product is MedusaProduct & { id: string } =>
                    typeof product.id === "string" &&
                    product.id.trim().length > 0,
                )
                .map((product) => [product.id.trim(), product]),
            );
            const adminProductsByHandle = new Map(
              adminProducts
                .filter(
                  (product): product is MedusaProduct & { handle: string } =>
                    typeof product.handle === "string" &&
                    product.handle.trim().length > 0,
                )
                .map((product) => [product.handle.trim(), product]),
            );

            const products = storeProducts
              .map((product) => {
                const adminProduct =
                  (product.id
                    ? adminProductsById.get(product.id.trim())
                    : undefined) ??
                  (product.handle
                    ? adminProductsByHandle.get(product.handle.trim())
                    : undefined);
                const mergedProduct: MedusaProduct =
                  adminProduct?.metadata != null
                    ? {
                        ...product,
                        metadata: adminProduct.metadata,
                      }
                    : product;

                return mapMedusaProductToStorefrontProduct(
                  mergedProduct,
                  collection,
                );
              })
              .filter((product): product is ShopProduct => product != null);

            return { collection, products };
          }),
      )
    ).filter(
      (entry) =>
        entry.products.length > 0 ||
        Boolean(entry.collection.title?.trim()),
    );
  },
);

function parseCategoryQuantity(quantity?: string): number | null {
  if (!quantity) {
    return null;
  }

  const match = quantity.match(/\d+/);
  if (!match) {
    return null;
  }

  return Number(match[0]);
}

function buildCollectionCategory(
  collection: MedusaCollection,
  count: number,
  fallbackImage?: string,
): Category {
  const metadata = collection.metadata;
  const displayName =
    collection.title?.trim() ||
    readMetadataString(metadata, ["source_title", "title"]) ||
    APPAREL_CATEGORY_NAME;
  const image =
    normalizeImageUrl(
      readMetadataString(metadata, [
        "image",
        "image_url",
        "source_image_url",
        "sourceImageUrl",
        "thumbnail",
      ]),
    ) ??
    pickImageUrls(collection)[0] ??
    fallbackImage;

  return {
    name: displayName,
    img: image,
    quantity: `${count} Product${count === 1 ? "" : "s"}`,
    href: `/shop-default?category=${encodeURIComponent(displayName)}`,
  };
}

export const getCollectionPageCategories = cache(async (): Promise<Category[]> => {
  const migratedCollections = await getMedusaMigratedCollections();
  if (migratedCollections.length === 0) {
    return [...categoriesCollection];
  }

  const mappedCategories = migratedCollections.map(({ collection, products }) =>
    buildCollectionCategory(collection, products.length, products[0]?.img),
  );
  const migratedCategoryNames = new Set(
    mappedCategories.map((category) => normalizeCollectionName(category.name)),
  );

  return [...categoriesCollection]
    .filter(
      (category) =>
        !migratedCategoryNames.has(normalizeCollectionName(category.name)),
    )
    .concat(mappedCategories)
    .sort(
      (left, right) =>
        (parseCategoryQuantity(right.quantity) ?? -1) -
        (parseCategoryQuantity(left.quantity) ?? -1),
    );
});

export const getShopCatalogProducts = cache(async (): Promise<ShopProduct[]> => {
  const migratedCollections = await getMedusaMigratedCollections();
  const migratedProducts = migratedCollections.flatMap((entry) => entry.products);
  const migratedProductsByHandle = new Map(
    migratedProducts
      .filter(
        (product): product is ShopProduct & { sourceHandle: string } =>
          typeof product.sourceHandle === "string" &&
          product.sourceHandle.trim().length > 0,
      )
      .map((product) => [product.sourceHandle.trim(), product]),
  );

  const catalog = localProducts.map((product) => {
    const handle = product.sourceHandle?.trim();
    return handle && migratedProductsByHandle.has(handle)
      ? migratedProductsByHandle.get(handle)!
      : product;
  });
  const appendedProducts = migratedProducts.filter(
    (product) =>
      !product.sourceHandle ||
      !localProductsBySourceHandle.has(product.sourceHandle.trim()),
  );

  return [...catalog, ...appendedProducts] as ShopProduct[];
});

export const getShopProductByRouteId = cache(
  async (routeId: string): Promise<ProductCardItem | undefined> => {
    const parsedId = Number(routeId);
    const catalog = await getShopCatalogProducts();

    if (Number.isFinite(parsedId)) {
      return catalog.find((product) => product.id === parsedId);
    }

    return undefined;
  },
);

export async function getMedusaApparelStatus() {
  const collection =
    (await getMedusaCollections()).find((entry) => isApparelCollection(entry)) ??
    null;
  const products =
    (await getMedusaMigratedCollections()).find((entry) =>
      isApparelCollection(entry.collection),
    )?.products ?? [];

  return {
    hasConfiguredStoreAccess: Boolean(getMedusaConfig()),
    collection,
    productsCount: products.length,
  };
}
