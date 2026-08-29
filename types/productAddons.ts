export type ProductAddOnKind = "accessory" | "upgrade";

export type ProductAddOnSelectionMode = "single" | "multiple";

/** Pricing for an attached accessory/upgrade selection. */
export interface ProductAddOnPrice {
  surcharge: number;
  compareAtSurcharge?: number;
  label?: string;
}

/** One selectable accessory/upgrade option attached to a PDP. */
export interface ProductAddOnOption {
  id: string;
  kind: ProductAddOnKind;
  title: string;
  shortTitle?: string;
  handle?: string;
  linkedStorefrontProductId?: number;
  linkedSourceProductId?: number;
  sku?: string;
  image?: string;
  imageHover?: string;
  hoverTitle?: string;
  hoverDescription?: string;
  price: ProductAddOnPrice;
  defaultSelected?: boolean;
  allowsQuantity?: boolean;
  minQuantity?: number;
  maxQuantity?: number | null;
  step?: number;
  metadata?: Record<string, string>;
}

/** Optional subgroup used by the original site for grouped add-ons. */
export interface ProductAddOnSubgroup {
  id: string;
  title: string;
  description?: string;
  selectionMode?: ProductAddOnSelectionMode;
  maxSelections?: number | null;
  items: ProductAddOnOption[];
}

/** Top-level accessories/upgrades section for a product detail page. */
export interface ProductAddOnGroup {
  id: string;
  kind: ProductAddOnKind;
  title: string;
  description?: string;
  selectionMode?: ProductAddOnSelectionMode;
  maxSelections?: number | null;
  displayStyle?: "grid" | "list";
  subgroups?: ProductAddOnSubgroup[];
  items?: ProductAddOnOption[];
}

/** Cart/PDP state for one selected add-on. */
export interface ProductAddOnSelection {
  groupId: string;
  subgroupId?: string;
  addOnId: string;
  quantity: number;
}
