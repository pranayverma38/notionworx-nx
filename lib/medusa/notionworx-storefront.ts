"use server";

import "server-only";

import { cache } from "react";

import { categoriesCollection } from "@/data/categories";
import { products as localProducts } from "@/data/products/products";
import type { Category } from "@/types/categories";
import type { ProductAddOnGroup, ProductAddOnOption } from "@/types/productAddons";
import type {
  ProductCardItem,
  ProductSingleImage,
  ProductSizeVariant,
} from "@/types/productCard";
import type { ShopProduct } from "@/types/shopFilter";

const APPAREL_CATEGORY_NAME = "APPAREL";
const APPAREL_CATEGORY_HANDLE = "apparel";
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

const localCollectionCategoriesByName = new Map(
  categoriesCollection.map((category) => [
    category.name.trim().toLowerCase(),
    category,
  ]),
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

type MedusaProductCategory = {
  id?: string;
  name?: string;
  handle?: string;
  metadata?: JsonRecord | null;
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
  categories?: MedusaProductCategory[] | null;
  options?: MedusaProductOption[] | null;
  variants?: MedusaVariant[] | null;
  tags?: Array<string | { value?: string | null }> | null;
};

type MedusaProductsResponse = {
  products?: MedusaProduct[];
};

type MedusaProductCategoriesResponse = {
  product_categories?: MedusaProductCategory[];
};

type MedusaRegionsResponse = {
  regions?: Array<{ id?: string }>;
};

type MedusaProductIndex = {
  byId: Map<string, MedusaProduct>;
  byHandle: Map<string, MedusaProduct>;
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

function isApparelCategory(category?: MedusaProductCategory | null): boolean {
  if (!category) return false;

  return (
    normalizeCollectionName(category.name) === APPAREL_CATEGORY_NAME ||
    category.handle?.trim().toLowerCase() === APPAREL_CATEGORY_HANDLE ||
    normalizeCollectionName(readMetadataString(category.metadata, ["title"])) ===
      APPAREL_CATEGORY_NAME ||
    readMetadataString(category.metadata, ["source_handle"]) ===
      APPAREL_CATEGORY_HANDLE
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

function readMetadataBoolean(
  metadata: JsonRecord | null | undefined,
  keys: string[],
): boolean | undefined {
  for (const key of keys) {
    const value = metadata?.[key];
    if (typeof value === "boolean") {
      return value;
    }
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (normalized === "true") {
        return true;
      }
      if (normalized === "false") {
        return false;
      }
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

const getAllStoreProducts = cache(async (regionId?: string): Promise<MedusaProduct[]> => {
  const query = new URLSearchParams({
    limit: "250",
  });

  if (regionId) {
    query.set("region_id", regionId);
  }

  const payload = await fetchMedusaJson<MedusaProductsResponse>(
    `/store/products?${query.toString()}`,
  );

  return payload?.products ?? [];
});

const getAllAdminProducts = cache(async (): Promise<MedusaProduct[]> => {
  const query = new URLSearchParams({
    limit: "250",
    fields: "*categories",
  });
  const payload = await fetchMedusaAdminJson<MedusaProductsResponse>(
    `/admin/products?${query.toString()}`,
  );

  return payload?.products ?? [];
});

const getAllAdminProductCategories = cache(async (): Promise<MedusaProductCategory[]> => {
  const query = new URLSearchParams({
    limit: "250",
  });
  const payload = await fetchMedusaAdminJson<MedusaProductCategoriesResponse>(
    `/admin/product-categories?${query.toString()}`,
  );

  return payload?.product_categories ?? [];
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

function isDefaultVariantSelectionValue(value?: string | null): boolean {
  const normalized = value?.trim().toLowerCase();
  return !normalized || DEFAULT_OPTION_TITLES.has(normalized) || normalized === "default variant";
}

function readSourcePrimaryCategoryTitle(
  metadata: JsonRecord | null | undefined,
): string | undefined {
  return readJsonRecordString(
    readMetadataRecord(metadata, "source_primary_category"),
    "title",
  );
}

type ProductCategoryEntry = Pick<
  MedusaProductCategory,
  "id" | "handle" | "name" | "metadata"
>;

function uniqueStrings(values: Array<string | undefined>): string[] {
  return Array.from(
    new Set(
      values
        .map((value) => value?.trim())
        .filter((value): value is string => Boolean(value)),
    ),
  );
}

function buildSourceCategoryEntry(
  record: JsonRecord | undefined,
): ProductCategoryEntry | null {
  if (!record) {
    return null;
  }

  const handle = readJsonRecordString(record, "handle");
  const name =
    readJsonRecordString(record, "title") ?? readJsonRecordString(record, "name");

  if (!handle && !name) {
    return null;
  }

  return {
    ...(handle ? { handle } : {}),
    ...(name ? { name } : {}),
    metadata: record,
  };
}

function getCategoryMapKey(
  category?: Pick<MedusaProductCategory, "id" | "handle" | "name"> | null,
): string | undefined {
  if (!category) {
    return undefined;
  }

  const handle = category.handle?.trim();
  if (handle) {
    return `handle:${handle.toLowerCase()}`;
  }

  const id = category.id?.trim();
  if (id) {
    return `id:${id}`;
  }

  const name = category.name?.trim();
  if (name) {
    return `name:${normalizeCollectionName(name)}`;
  }

  return undefined;
}

function getProductCategoryEntries(product: MedusaProduct): ProductCategoryEntry[] {
  const metadata = product.metadata;
  const entries: ProductCategoryEntry[] = [];

  const primarySourceCategory = buildSourceCategoryEntry(
    readMetadataRecord(metadata, "source_primary_category"),
  );
  if (primarySourceCategory) {
    entries.push(primarySourceCategory);
  }

  for (const sourceCategory of readMetadataRecordArray(metadata, "source_categories")) {
    const entry = buildSourceCategoryEntry(sourceCategory);
    if (entry) {
      entries.push(entry);
    }
  }

  for (const category of product.categories ?? []) {
    const id = category.id?.trim();
    const handle = category.handle?.trim();
    const name = category.name?.trim();
    if (!id && !handle && !name) {
      continue;
    }
    entries.push({
      ...(id ? { id } : {}),
      ...(handle ? { handle } : {}),
      ...(name ? { name } : {}),
      ...(category.metadata ? { metadata: category.metadata } : {}),
    });
  }

  const uniqueEntries = new Map<string, ProductCategoryEntry>();
  for (const entry of entries) {
    const key = getCategoryMapKey(entry);
    if (!key) {
      continue;
    }
    if (!uniqueEntries.has(key)) {
      uniqueEntries.set(key, entry);
      continue;
    }

    const existing = uniqueEntries.get(key)!;
    uniqueEntries.set(key, {
      ...entry,
      id: existing.id ?? entry.id,
      handle: existing.handle ?? entry.handle,
      name: existing.name ?? entry.name,
      metadata: existing.metadata ?? entry.metadata,
    });
  }

  return [...uniqueEntries.values()].filter(
    (entry): entry is ProductCategoryEntry & { name: string } =>
      typeof entry.name === "string" && entry.name.trim().length > 0,
  );
}

function isFrameTypeAddOnGroup(group: ProductAddOnGroup): boolean {
  const options = group.items ?? [];
  if (options.length < 2 || group.selectionMode !== "single") {
    return false;
  }

  return options.every((option) => {
    const sourceFieldName = option.metadata?.sourceFieldName?.toLowerCase() ?? "";
    const hoverDescription = option.hoverDescription?.toLowerCase() ?? "";

    return sourceFieldName.includes("frame type") || hoverDescription.includes("frame type");
  });
}

const SIMPLE_ADDON_METADATA_KEY =
  /^(Accessories|Upgrades)_(.+)$/;

type SimpleAddOnMetadataEntry = {
  kind: "accessory" | "upgrade";
  groupId: string;
  groupTitle: string;
  subgroupId: string;
  subgroupTitle: string;
  productIds: string[];
};

function readPrimaryProductImage(product?: MedusaProduct): string | undefined {
  if (!product) {
    return undefined;
  }

  return pickImageUrls(product)[0];
}

function isStandaloneAddOnProduct(product: MedusaProduct): boolean {
  const metadata = product.metadata;
  return (
    readMetadataBoolean(metadata, ["is_add_on_product", "isAddOnProduct"]) === true ||
    readMetadataString(metadata, ["source"]) === "notionworx-shared-addon" ||
    Boolean(readMetadataString(metadata, ["source_add_on_option_id", "sourceAddOnOptionId"]))
  );
}

function parseCommaSeparatedProductIds(value: unknown): string[] {
  if (typeof value !== "string" || !value.trim()) {
    return [];
  }

  const seen = new Set<string>();
  const ids: string[] = [];
  for (const part of value.split(/[,\n]+/)) {
    const id = part.trim();
    if (!id || seen.has(id)) {
      continue;
    }
    seen.add(id);
    ids.push(id);
  }
  return ids;
}

function subgroupTitleFromMetadataToken(token: string): string {
  return token.replace(/_+/g, " ").trim() || "General";
}

function readSimpleAddOnMetadataEntries(
  metadata: JsonRecord | null | undefined,
): SimpleAddOnMetadataEntry[] {
  if (!metadata || typeof metadata !== "object") {
    return [];
  }

  const entries: SimpleAddOnMetadataEntry[] = [];
  for (const [rawKey, rawValue] of Object.entries(metadata)) {
    const match = SIMPLE_ADDON_METADATA_KEY.exec(rawKey.trim());
    if (!match) {
      continue;
    }

    const productIds = parseCommaSeparatedProductIds(rawValue);
    if (!productIds.length) {
      continue;
    }

    const prefix = match[1];
    const subgroupToken = match[2];
    const kind = prefix === "Upgrades" ? "upgrade" : "accessory";
    const subgroupTitle = subgroupTitleFromMetadataToken(subgroupToken);
    entries.push({
      kind,
      groupId: kind === "upgrade" ? "upgrades" : "accessories",
      groupTitle: kind === "upgrade" ? "Upgrades" : "Accessories",
      subgroupId: subgroupToken.toLowerCase(),
      subgroupTitle,
      productIds,
    });
  }

  return entries;
}

function buildAddOnOptionFromProduct(
  product: MedusaProduct,
  kind: "accessory" | "upgrade",
  subgroupTitle: string,
  groupTitle: string,
): ProductAddOnOption | null {
  const linkedMetadata = product.metadata;
  const linkedVariant = getPrimaryVariant(product.variants ?? []);
  const handle = product.handle?.trim();
  const title = product.title?.trim();
  const addOnId =
    readMetadataString(linkedMetadata, [
      "source_add_on_option_id",
      "sourceAddOnOptionId",
    ]) ??
    handle ??
    product.id?.trim();
  if (!addOnId || !title) {
    return null;
  }

  const price =
    extractVariantPrice(linkedVariant) ??
    readMetadataNumber(linkedMetadata, [
      "source_add_on_price_surcharge",
      "sourceAddOnPriceSurcharge",
    ]);
  if (typeof price !== "number") {
    return null;
  }

  const hoverDescription = [subgroupTitle || groupTitle, `(+ $${price.toFixed(2)})`]
    .filter(Boolean)
    .join(" · ");
  const allowsQuantity = readMetadataBoolean(linkedMetadata, [
    "source_add_on_allows_quantity",
    "sourceAddOnAllowsQuantity",
  ]);
  const minQuantity = readMetadataNumber(linkedMetadata, [
    "source_add_on_min_quantity",
    "sourceAddOnMinQuantity",
  ]);
  const step = readMetadataNumber(linkedMetadata, [
    "source_add_on_step",
    "sourceAddOnStep",
  ]);
  const image = readPrimaryProductImage(product);

  return {
    id: addOnId,
    kind:
      normalizeCollectionName(
        readMetadataString(linkedMetadata, ["source_add_on_kind", "sourceAddOnKind"]),
      ) === "UPGRADE"
        ? "upgrade"
        : kind,
    title,
    ...(handle ? { handle } : {}),
    ...(product.id?.trim() ? { linkedMedusaProductId: product.id.trim() } : {}),
    ...(linkedVariant?.id?.trim()
      ? { linkedMedusaVariantId: linkedVariant.id.trim() }
      : {}),
    ...(linkedVariant?.sku?.trim() ? { sku: linkedVariant.sku.trim() } : {}),
    ...(image ? { image } : {}),
    ...(hoverDescription ? { hoverDescription } : {}),
    price: {
      surcharge: price,
      label: `(+ $${price.toFixed(2)})`,
    },
    ...(typeof allowsQuantity === "boolean" ? { allowsQuantity } : {}),
    ...(typeof minQuantity === "number" ? { minQuantity } : {}),
    ...(typeof step === "number" ? { step } : {}),
  };
}

function buildAddOnGroupsFromSimpleMetadata(
  metadata: JsonRecord | null | undefined,
  addOnProducts: MedusaProductIndex,
): ProductAddOnGroup[] | undefined {
  const entries = readSimpleAddOnMetadataEntries(metadata);
  if (!entries.length) {
    return undefined;
  }

  type MutableSubgroup = NonNullable<ProductAddOnGroup["subgroups"]>[number];
  type MutableGroup = ProductAddOnGroup & {
    items: ProductAddOnOption[];
    subgroups: MutableSubgroup[];
    _subgroupsByKey: Map<string, MutableSubgroup>;
  };

  const groups = new Map<string, MutableGroup>();

  for (const entry of entries) {
    const groupKey = `${entry.kind}:${entry.groupId}`;
    if (!groups.has(groupKey)) {
      groups.set(groupKey, {
        id: entry.groupId,
        kind: entry.kind,
        title: entry.groupTitle,
        displayStyle: "grid",
        selectionMode: "multiple",
        items: [],
        subgroups: [],
        _subgroupsByKey: new Map<string, MutableSubgroup>(),
      });
    }

    const group = groups.get(groupKey)!;
    if (!group._subgroupsByKey.has(entry.subgroupId)) {
      const subgroup: MutableSubgroup = {
        id: entry.subgroupId,
        title: entry.subgroupTitle,
        selectionMode: "single",
        items: [],
      };
      group._subgroupsByKey.set(entry.subgroupId, subgroup);
      group.subgroups.push(subgroup);
    }

    const subgroup = group._subgroupsByKey.get(entry.subgroupId)!;
    for (const productId of entry.productIds) {
      const linkedProduct = addOnProducts.byId.get(productId);
      if (!linkedProduct) {
        continue;
      }
      const option = buildAddOnOptionFromProduct(
        linkedProduct,
        entry.kind,
        entry.subgroupTitle,
        entry.groupTitle,
      );
      if (option) {
        subgroup.items.push(option);
      }
    }
  }

  const finalizedGroups = [...groups.values()]
    .map(({ _subgroupsByKey: _subgroupsByKey, ...group }) => ({
      ...group,
      subgroups: group.subgroups.filter((subgroup) => subgroup.items.length > 0),
    }))
    .filter((group) => (group.subgroups?.length ?? 0) > 0);

  return finalizedGroups.length ? finalizedGroups : undefined;
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
    .map((variant): ProductSizeVariant | null => {
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

  if (
    uniqueEntries.length === 1 &&
    isDefaultVariantSelectionValue(uniqueEntries[0]?.value)
  ) {
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

function normalizeSourceSizeVariants(
  metadata: JsonRecord | null | undefined,
): {
  variantLabel?: string;
  sizes?: string[];
  sizeVariants?: ProductSizeVariant[];
} {
  const sourceVariantLabel = readMetadataString(metadata, [
    "source_variant_label",
    "sourceVariantLabel",
  ]);
  const sourceSizeVariants = readMetadataRecordArray(metadata, "source_size_variants")
    .map((entry): ProductSizeVariant | null => {
      const value = readJsonRecordString(entry, "value");
      const price = readJsonRecordNumber(entry, "price");
      const compareAtPrice = readJsonRecordNumber(entry, "compareAtPrice");
      const activeValue = entry.active;

      if (!value || typeof price !== "number") {
        return null;
      }

      return {
        value,
        price,
        ...(typeof compareAtPrice === "number" && compareAtPrice > price
          ? { compareAtPrice }
          : {}),
        ...(activeValue === true ? { active: true } : {}),
      } satisfies ProductSizeVariant;
    })
    .filter((entry): entry is ProductSizeVariant => entry != null);

  const uniqueEntries = Array.from(
    new Map(sourceSizeVariants.map((entry) => [entry.value, entry])).values(),
  );

  if (
    uniqueEntries.length === 1 &&
    isDefaultVariantSelectionValue(uniqueEntries[0]?.value)
  ) {
    return {};
  }

  if (
    uniqueEntries.length <= 1 &&
    (!sourceVariantLabel || isDefaultOptionTitle(sourceVariantLabel))
  ) {
    return {};
  }

  if (uniqueEntries.length === 0) {
    return {};
  }

  const hasExplicitActive = uniqueEntries.some((entry) => entry.active);
  const minPrice = Math.min(
    ...uniqueEntries.map((entry) =>
      typeof entry.price === "number" ? entry.price : Number.POSITIVE_INFINITY,
    ),
  );
  const normalizedEntries = uniqueEntries.map((entry) => ({
    ...entry,
    ...(hasExplicitActive
      ? {}
      : entry.price === minPrice
        ? { active: true }
        : {}),
  }));

  return {
    ...(sourceVariantLabel && !isDefaultOptionTitle(sourceVariantLabel)
      ? { variantLabel: sourceVariantLabel }
      : {}),
    sizes: normalizedEntries.map((entry) => entry.value),
    sizeVariants: normalizedEntries,
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
  fallbackCategoryName?: string,
  addOnProducts: MedusaProductIndex = {
    byId: new Map<string, MedusaProduct>(),
    byHandle: new Map<string, MedusaProduct>(),
  },
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
  const categoryEntries = getProductCategoryEntries(product);
  const liveCategoryTitles = uniqueStrings(
    categoryEntries.map((entry) => entry.name),
  );
  const liveVariantChoices = buildVariantChoices(
    product,
    variants,
    sourceOptions,
    sourceVariants,
  );
  const sourceVariantChoices = normalizeSourceSizeVariants(metadata);
  const shouldPreferSourceVariantChoices =
    normalizeCollectionName(
      sourceVariantChoices.variantLabel ?? liveVariantChoices.variantLabel,
    ) === "FRAME TYPE" &&
    (sourceVariantChoices.sizeVariants?.length ?? 0) >=
      (liveVariantChoices.sizeVariants?.length ?? 0);
  const variantChoices =
    shouldPreferSourceVariantChoices && sourceVariantChoices.sizeVariants?.length
      ? sourceVariantChoices
      : liveVariantChoices.sizeVariants?.length
        ? liveVariantChoices
        : sourceVariantChoices;
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
  const rawAddOnGroups = buildAddOnGroupsFromSimpleMetadata(metadata, addOnProducts);
  const addOnGroups =
    variantLabel?.trim().toLowerCase() === "frame type"
      ? rawAddOnGroups?.filter((group) => !isFrameTypeAddOnGroup(group))
      : rawAddOnGroups;
  const sourceInStock =
    sourceVariants.length > 0
      ? sourceVariants.some((variant) => variant.available !== false)
      : undefined;
  const inStock = sourceInStock ?? isProductInStock(variants);
  const filterCategory = uniqueStrings([
    ...liveCategoryTitles,
    ...(localFallback?.filterCategory ?? []),
    fallbackCategoryName,
  ]);
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
    readSourcePrimaryCategoryTitle(metadata) ??
    categoryEntries[0]?.name?.trim() ??
    localFallback?.category ??
    fallbackCategoryName ??
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
      (normalizeCollectionName(category) === APPAREL_CATEGORY_NAME
        ? "Medusa"
        : undefined),
    ...(localFallback?.badgeSubtext
      ? { badgeSubtext: localFallback.badgeSubtext }
      : {}),
  };
}

type MedusaMappedCollection = {
  category: ProductCategoryEntry & { name: string };
  products: ShopProduct[];
};

let migratedCollectionsCache:
  | { expiresAt: number; value: { categories: MedusaMappedCollection[]; products: ShopProduct[] } }
  | null = null;
let migratedCollectionsPromise:
  | Promise<{ categories: MedusaMappedCollection[]; products: ShopProduct[] }>
  | null = null;
const MIGRATED_COLLECTIONS_CACHE_TTL_MS = 5 * 60 * 1000;

const getMedusaMigratedCollections = cache(
  async (): Promise<{ categories: MedusaMappedCollection[]; products: ShopProduct[] }> => {
    const cachedValue = migratedCollectionsCache;
    if (cachedValue && cachedValue.expiresAt > Date.now()) {
      return cachedValue.value;
    }

    if (migratedCollectionsPromise) {
      return migratedCollectionsPromise;
    }

    migratedCollectionsPromise = (async () => {
      const regionId = await getDefaultRegionId();
      const [storeProducts, adminProducts, adminCategories] = await Promise.all([
        getAllStoreProducts(regionId),
        getAllAdminProducts(),
        getAllAdminProductCategories(),
      ]);
      const sourceProducts = storeProducts.length > 0 ? storeProducts : adminProducts;

      if (sourceProducts.length === 0) {
        return { categories: [], products: [] };
      }

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
      const categoriesByKey = new Map<
        string,
        ProductCategoryEntry & { name: string }
      >(
        adminCategories
          .map((category) => {
            const key = getCategoryMapKey(category);
            const name = category.name?.trim();
            if (!key || !name) {
              return null;
            }

            return [
              key,
              {
                ...category,
                name,
              },
            ] as const;
          })
          .filter(
            (
              entry,
            ): entry is readonly [string, ProductCategoryEntry & { name: string }] =>
              entry != null,
          ),
      );
      const uniqueProducts = new Map<string, ShopProduct>();
      const productsByCategoryKey = new Map<string, Map<string, ShopProduct>>();
      const mergedProducts = sourceProducts.map((sourceProduct) => {
        const adminProduct =
          (sourceProduct.id ? adminProductsById.get(sourceProduct.id.trim()) : undefined) ??
          (sourceProduct.handle
            ? adminProductsByHandle.get(sourceProduct.handle.trim())
            : undefined);

        return {
          ...sourceProduct,
          ...(adminProduct?.metadata != null
            ? { metadata: adminProduct.metadata }
            : {}),
          ...(adminProduct?.categories != null
            ? { categories: adminProduct.categories }
            : {}),
        } satisfies MedusaProduct;
      });
      const addOnProducts: MedusaProductIndex = {
        byId: new Map(
          mergedProducts
            .filter(
              (product): product is MedusaProduct & { id: string } =>
                isStandaloneAddOnProduct(product) &&
                typeof product.id === "string" &&
                product.id.trim().length > 0,
            )
            .map((product) => [product.id.trim(), product]),
        ),
        byHandle: new Map(
          mergedProducts
            .filter(
              (product): product is MedusaProduct & { handle: string } =>
                isStandaloneAddOnProduct(product) &&
                typeof product.handle === "string" &&
                product.handle.trim().length > 0,
            )
            .map((product) => [product.handle.trim(), product]),
        ),
      };

      for (const mergedProduct of mergedProducts) {
        if (isStandaloneAddOnProduct(mergedProduct)) {
          continue;
        }

        const categoryEntries = getProductCategoryEntries(mergedProduct);

        for (const categoryEntry of categoryEntries) {
          const key = getCategoryMapKey(categoryEntry);
          const name = categoryEntry.name?.trim();
          if (!key || !name || categoriesByKey.has(key)) {
            continue;
          }

          categoriesByKey.set(key, {
            ...categoryEntry,
            name,
          });
        }

        const mappedProduct = mapMedusaProductToStorefrontProduct(
          mergedProduct,
          categoryEntries[0]?.name,
          addOnProducts,
        );

        if (!mappedProduct) {
          continue;
        }

        const productKey =
          (typeof mappedProduct.sourceHandle === "string" &&
          mappedProduct.sourceHandle.trim().length > 0
            ? mappedProduct.sourceHandle.trim()
            : undefined) ?? `medusa:${mappedProduct.id}`;
        if (!uniqueProducts.has(productKey)) {
          uniqueProducts.set(productKey, mappedProduct);
        }

        const resolvedProduct = uniqueProducts.get(productKey)!;
        for (const categoryEntry of categoryEntries) {
          const categoryKey = getCategoryMapKey(categoryEntry);
          if (!categoryKey) {
            continue;
          }

          const categoryProducts =
            productsByCategoryKey.get(categoryKey) ?? new Map<string, ShopProduct>();
          categoryProducts.set(productKey, resolvedProduct);
          productsByCategoryKey.set(categoryKey, categoryProducts);
        }
      }

      const result = {
        categories: [...categoriesByKey.entries()]
          .map(([key, category]) => ({
            category,
            products: [...(productsByCategoryKey.get(key)?.values() ?? [])],
          }))
          .filter(
            (entry) =>
              entry.products.length > 0 && Boolean(entry.category.name?.trim()),
          )
          .sort(
            (left, right) =>
              right.products.length - left.products.length ||
              left.category.name.localeCompare(right.category.name),
          ),
        products: [...uniqueProducts.values()],
      };
      migratedCollectionsCache = {
        value: result,
        expiresAt: Date.now() + MIGRATED_COLLECTIONS_CACHE_TTL_MS,
      };

      return result;
    })().finally(() => {
      migratedCollectionsPromise = null;
    });

    return migratedCollectionsPromise;
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
  category: ProductCategoryEntry & { name: string },
  count: number,
  fallbackImage?: string,
): Category {
  const metadata = category.metadata;
  const displayName =
    category.name?.trim() ||
    readMetadataString(metadata, ["source_title", "title"]) ||
    APPAREL_CATEGORY_NAME;
  const localCategoryFallback = localCollectionCategoriesByName.get(
    displayName.trim().toLowerCase(),
  );
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
    localCategoryFallback?.img ??
    fallbackImage;

  return {
    name: displayName,
    img: image,
    quantity: `${count} Product${count === 1 ? "" : "s"}`,
    href: `/shop-default?category=${encodeURIComponent(displayName)}`,
  };
}

export const getCategoryPageCategories = cache(async (): Promise<Category[]> => {
  const migratedCollections = await getMedusaMigratedCollections();
  if (migratedCollections.categories.length === 0) {
    return [...categoriesCollection];
  }

  const uniqueCategories = Array.from(
    new Map(
      migratedCollections.categories.map(({ category, products }) => {
        const mappedCategory = buildCollectionCategory(
          category,
          products.length,
          products[0]?.img,
        );
        return [normalizeCollectionName(mappedCategory.name), mappedCategory] as const;
      }),
    ).values(),
  );

  return uniqueCategories
    .sort(
      (left, right) =>
        (parseCategoryQuantity(right.quantity) ?? -1) -
        (parseCategoryQuantity(left.quantity) ?? -1),
    );
});

export const getCollectionPageCategories = getCategoryPageCategories;

export const getShopCatalogProducts = cache(async (): Promise<ShopProduct[]> => {
  const migratedCatalog = await getMedusaMigratedCollections();
  const migratedProducts = migratedCatalog.products;
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
  const migratedCatalog = await getMedusaMigratedCollections();
  const category =
    migratedCatalog.categories.find((entry) => isApparelCategory(entry.category))
      ?.category ?? null;
  const products =
    migratedCatalog.categories.find((entry) =>
      isApparelCategory(entry.category),
    )?.products ?? [];

  return {
    hasConfiguredStoreAccess: Boolean(getMedusaConfig()),
    collection: category,
    productsCount: products.length,
  };
}
