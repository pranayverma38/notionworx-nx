export const NOTION_WORX_INVENTORY_SCHEMA_VERSION = 2;

/** Minimal reference to a collection/category the product belongs to. */
export interface InventoryCategoryReference {
  handle: string;
  title: string;
}

/** Locally mirrored product image metadata used by the storefront. */
export interface InventoryImageAsset {
  localPath: string;
  width: number | null;
  height: number | null;
  position: number | null;
  variantIds: number[];
}

/** Locally mirrored collection/category image metadata. */
export interface InventoryCollectionImageAsset {
  localPath: string;
  width: number | null;
  height: number | null;
}

/** Product option as exposed by Shopify's public collection endpoints. */
export interface InventoryOption {
  name: string;
  position: number;
  values: string[];
}

/** Variant-level inventory row with pricing and option selections. */
export interface InventoryVariant {
  id: number;
  title: string;
  sku: string | null;
  available: boolean;
  price: number | null;
  compareAtPrice: number | null;
  optionValues: string[];
  requiresShipping: boolean;
  taxable: boolean;
  grams: number | null;
  position: number | null;
}

/** Aggregated price snapshot across all variants. */
export interface InventoryPriceSummary {
  min: number | null;
  max: number | null;
  compareAtMin: number | null;
  compareAtMax: number | null;
  variantCount: number;
}

/** One persisted product file under `data/inventory/notionworx/products/**`. */
export interface NotionWorxInventoryProduct {
  schemaVersion: number;
  id: number;
  handle: string;
  slug: string;
  name: string;
  vendor: string | null;
  productType: string | null;
  primaryCategory: InventoryCategoryReference;
  categories: InventoryCategoryReference[];
  descriptionHtml: string;
  descriptionText: string;
  tags: string[];
  skus: string[];
  price: InventoryPriceSummary;
  options: InventoryOption[];
  variants: InventoryVariant[];
  images: InventoryImageAsset[];
  createdAt: string | null;
  updatedAt: string | null;
  publishedAt: string | null;
}

/** Summary record for one collection manifest file. */
export interface NotionWorxInventoryCollection {
  schemaVersion: number;
  handle: string;
  title: string;
  description: string;
  image?: InventoryCollectionImageAsset | null;
  images?: InventoryCollectionImageAsset[];
  productsCount: number;
  productHandles: string[];
}

/** Top-level generated manifest for the full crawl. */
export interface NotionWorxInventoryManifest {
  schemaVersion: number;
  generatedAt: string;
  collectionCount: number;
  categoryFolderCount: number;
  productCount: number;
  uncategorizedProductCount: number;
  imageCount: number;
  collections: Array<{
    handle: string;
    title: string;
    productsCount: number;
    filePath: string;
  }>;
  products: Array<{
    handle: string;
    name: string;
    primaryCategoryHandle: string;
    primaryCategoryTitle: string;
    dataPath: string;
    imagePaths: string[];
  }>;
}
