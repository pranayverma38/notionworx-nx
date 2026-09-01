"use server";

import "server-only";

import { cache } from "react";

import { categoriesCollection } from "@/data/categories";
import { products as localProducts } from "@/data/products/products";
import type { Category } from "@/types/categories";
import type { ProductCardItem, ProductSingleImage } from "@/types/productCard";
import type { ShopProduct } from "@/types/shopFilter";

const APPAREL_CATEGORY_NAME = "APPAREL";
const APPAREL_COLLECTION_HANDLE = "apparel";

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
    "/store/collections?limit=100",
  );

  return payload?.collections ?? [];
});

const getApparelCollection = cache(async () => {
  const collections = await getMedusaCollections();
  return collections.find((collection) => isApparelCollection(collection)) ?? null;
});

const getAdminApparelProducts = cache(async (collectionId: string): Promise<MedusaProduct[]> => {
  const query = new URLSearchParams({
    limit: "100",
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

function determineProductSizes(
  product: MedusaProduct,
  variants: MedusaVariant[],
): string[] {
  const sizeOption = (product.options ?? []).find(
    (option) => option.title?.trim().toLowerCase() === "size",
  );

  const explicitSizes = collectOptionValues(sizeOption);
  if (explicitSizes.length > 0) {
    return explicitSizes;
  }

  return Array.from(
    new Set(
      variants
        .map((variant) => buildVariantOptionsMap(variant).Size)
        .filter((value): value is string => Boolean(value)),
    ),
  );
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
  const sourcePrice = readMetadataRecord(metadata, "source_price");
  const sourceOptions = readMetadataRecordArray(metadata, "source_options");
  const sourceVariants = readMetadataRecordArray(metadata, "source_variants");
  const descriptionHtml = readMetadataString(metadata, [
    "description_html",
    "descriptionHtml",
  ]);
  const descriptionText =
    readMetadataString(metadata, ["description_text", "descriptionText"]) ??
    fallbackDescription;
  const howToOrderHtml = readMetadataString(metadata, [
    "how_to_order_html",
    "howToOrderHtml",
  ]);
  const howToOrderText = readMetadataString(metadata, [
    "how_to_order_text",
    "howToOrderText",
  ]);
  const warrantyHtml = readMetadataString(metadata, [
    "warranty_html",
    "warrantyHtml",
  ]);
  const warrantyText = readMetadataString(metadata, [
    "warranty_text",
    "warrantyText",
  ]);
  const dimensionsHtml = readMetadataString(metadata, [
    "dimensions_html",
    "dimensionsHtml",
  ]);
  const dimensionsText = readMetadataString(metadata, [
    "dimensions_text",
    "dimensionsText",
  ]);

  const sourcePriceMin =
    readJsonRecordNumber(sourcePrice, "min");
  const sourceCompareAtPrice = extractSourceCompareAtPrice(sourcePrice, sourceVariants);
  const sizeSourceOption = sourceOptions.find(
    (option) => option.name?.toString().trim().toLowerCase() === "size",
  );
  const fallbackSourceOption = sourceOptions[0];
  const metadataSizes = (
    (sizeSourceOption?.values as JsonValue[] | undefined) ??
    (fallbackSourceOption?.values as JsonValue[] | undefined) ??
    []
  )
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean);
  const price = sourcePriceMin ?? extractVariantPrice(primaryVariant ?? {}) ?? 0;
  const rawPriceOld = sourceCompareAtPrice ?? extractOldVariantPrice(primaryVariant ?? {});
  const priceOld =
    typeof rawPriceOld === "number" && rawPriceOld > price ? rawPriceOld : undefined;
  const sizes = metadataSizes.length > 0 ? metadataSizes : determineProductSizes(product, variants);
  const variantLabel =
    fallbackSourceOption?.name?.toString().trim() ||
    product.options?.[0]?.title?.trim() ||
    "Size";
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
  const sourceInStock =
    sourceVariants.length > 0
      ? sourceVariants.some((variant) => variant.available !== false)
      : undefined;
  const inStock = sourceInStock ?? isProductInStock(variants);

  return {
    id: buildStableProductId(`medusa:${medusaId}`),
    sourceProductId,
    sourceHandle: handle,
    sourceSlug,
    img: primaryImage ?? "/assets/images/shop/product-placeholder.jpg",
    imgHover: images[1]?.src ?? primaryImage,
    images,
    name: title,
    price,
    priceOld,
    sizes,
    variantLabel,
    category: APPAREL_CATEGORY_NAME,
    filterCategory: [APPAREL_CATEGORY_NAME],
    filterBrands: [],
    filterColor: [],
    filterSizes: sizes,
    tags: readMetadataStringArray(metadata, ["source_tags", "tags"]),
    rating: 5,
    inStock,
    isStockOut: !inStock,
    services: [],
    cardVariant: "",
    description: descriptionText,
    descriptionHtml,
    descriptionText,
    dimensionsHtml,
    dimensionsText,
    warrantyHtml,
    warrantyText,
    howToOrderHtml,
    howToOrderText,
    sku:
      (typeof sourceSku === "string" ? sourceSku.trim() : undefined) ??
      primaryVariant?.sku?.trim() ??
      undefined,
    badgeLabel: normalizeCollectionName(collection.title) === APPAREL_CATEGORY_NAME
      ? "Medusa"
      : undefined,
  };
}

const getMedusaApparelProducts = cache(async (): Promise<ShopProduct[]> => {
  const apparelCollection = await getApparelCollection();
  if (!apparelCollection?.id) {
    return [];
  }

  const query = new URLSearchParams({
    limit: "100",
    collection_id: apparelCollection.id,
  });

  const regionId = await getDefaultRegionId();
  if (regionId) {
    query.set("region_id", regionId);
  }

  const payload = await fetchMedusaJson<MedusaProductsResponse>(
    `/store/products?${query.toString()}`,
  );
  const products = payload?.products ?? [];
  const adminProducts = await getAdminApparelProducts(apparelCollection.id);
  const adminProductsById = new Map(
    adminProducts
      .filter((product) => typeof product.id === "string" && product.id.trim().length > 0)
      .map((product) => [product.id!.trim(), product]),
  );
  const adminProductsByHandle = new Map(
    adminProducts
      .filter((product) => typeof product.handle === "string" && product.handle.trim().length > 0)
      .map((product) => [product.handle!.trim(), product]),
  );

  return products
    .map((product) => {
      const adminProduct =
        (product.id ? adminProductsById.get(product.id.trim()) : undefined) ??
        (product.handle ? adminProductsByHandle.get(product.handle.trim()) : undefined);
      const mergedProduct: MedusaProduct =
        adminProduct?.metadata != null
          ? {
              ...product,
              metadata: adminProduct.metadata,
            }
          : product;

      return mapMedusaProductToStorefrontProduct(mergedProduct, apparelCollection);
    })
    .filter((product): product is ShopProduct => product != null);
});

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

function buildApparelCategory(
  collection: MedusaCollection,
  count: number,
  fallbackImage?: string,
): Category {
  const metadata = collection.metadata;
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
    name: collection.title?.trim() || APPAREL_CATEGORY_NAME,
    img: image,
    quantity: `${count} Product${count === 1 ? "" : "s"}`,
    href: `/shop-default?category=${encodeURIComponent(APPAREL_CATEGORY_NAME)}`,
  };
}

export const getCollectionPageCategories = cache(async (): Promise<Category[]> => {
  const categories = [...categoriesCollection];
  const apparelCollection = await getApparelCollection();
  if (!apparelCollection) {
    return categories;
  }

  const apparelProducts = await getMedusaApparelProducts();
  const mappedCategory = buildApparelCategory(
    apparelCollection,
    apparelProducts.length,
    apparelProducts[0]?.img,
  );

  const filtered = categories.filter(
    (category) => normalizeCollectionName(category.name) !== APPAREL_CATEGORY_NAME,
  );

  const apparelCount = parseCategoryQuantity(mappedCategory.quantity);
  if (apparelCount == null) {
    return [...filtered, mappedCategory];
  }

  const insertionIndex = filtered.findIndex((category) => {
    const count = parseCategoryQuantity(category.quantity);
    return count != null && apparelCount > count;
  });

  if (insertionIndex === -1) {
    return [...filtered, mappedCategory];
  }

  return [
    ...filtered.slice(0, insertionIndex),
    mappedCategory,
    ...filtered.slice(insertionIndex),
  ];
});

export const getShopCatalogProducts = cache(async (): Promise<ShopProduct[]> => {
  const apparelProducts = await getMedusaApparelProducts();
  return [...localProducts, ...apparelProducts] as ShopProduct[];
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
  const collection = await getApparelCollection();
  const products = await getMedusaApparelProducts();

  return {
    hasConfiguredStoreAccess: Boolean(getMedusaConfig()),
    collection,
    productsCount: products.length,
  };
}
