import manifest from "./manifest.json";

export { NOTION_WORX_INVENTORY_SCHEMA_VERSION } from "./schema";
export type {
  InventoryCategoryReference,
  InventoryCollectionImageAsset,
  InventoryImageAsset,
  InventoryOption,
  InventoryPriceSummary,
  InventoryVariant,
  NotionWorxInventoryCollection,
  NotionWorxInventoryManifest,
  NotionWorxInventoryProduct,
} from "./schema";

export const notionWorxInventoryManifest = manifest;
