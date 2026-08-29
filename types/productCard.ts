import type { ProductAddOnGroup } from "./productAddons";

export interface ProductColorSwatch {
  label: string;
  /** CSS class for swatch (e.g. "bg-olive-brown") */
  swatchClass: string;
  img: string;
}

/** One image in a product single gallery (main or thumb). */
export interface ProductSingleImage {
  src: string;
  dataSize?: string;
  dataColor?: string;
  video?: string;
  model3d?: string;
}

/** Optional shop-default filter facets (Unimart-style). Present on products that appear in `shopDefaultProducts`. */
export interface ShopProductFacetFields {
  cardVariant: "" | "square";
  filterBrands: string[];
  filterCategory: string[];
  filterColor: string[];
  /** Size labels for filtering (e.g. XS, S, M). */
  filterSizes: string[];
  tags: string[];
  rating: number;
  inStock: boolean;
  isStockOut: boolean;
  services: string[];
}

/** One product for cards, single-product sections, or any product UI. Use img/imgHover for cards; use images for single-product gallery. */
export interface ProductCardItem extends Partial<ShopProductFacetFields> {
  id: number;
  /** Stable product id from the source-of-truth inventory export. */
  sourceProductId?: number;
  /** Stable source handle used by crawled mapping data. */
  sourceHandle?: string;
  /** Source slug preserved from the mirrored inventory JSON. */
  sourceSlug?: string;
  /** Main image for card layout. Omit when using images[] (single-product). */
  img: string;
  imgHover?: string;
  /** Gallery images for single-product layout. When set, use instead of img. */
  images?: ProductSingleImage[];
  name: string;
  price: number;
  priceOld?: number;
  /** Badge text (e.g. "NEW", "-25%"). Rendered with class "new" or "sale" based on value. */
  badge?: string;
  /** Optional second badge (e.g. "TREND"). Rendered with class "trend". */
  badgeTrend?: string;
  /** Size options shown in variant-box (e.g. ["XS", "S", "M"]) */
  sizes?: string[];
  /** Label for the primary non-color variant group (e.g. "Size", "Frame Type"). */
  variantLabel?: string;
  /** Size variants with price for single-product (e.g. [{ value: "30ml", price: "39.99" }, { value: "100ml", price: "59.99", active: true }]). */
  sizeVariants?: { value: string; price: string; active?: boolean }[];
  /** Color swatches; first is active. */
  colors?: ProductColorSwatch[];
  /** Marquee text (e.g. "HOT SALE 25% OFF"); when set, shows product-marquee_sale. */
  marquee?: string;
  /** Countdown timer value for data-timer (seconds); when set, shows product-countdown. */
  countdown?: number;
  /** Optional tag to filter products for a section. Not rendered in UI. */
  tag?: string;
  /** Demo tab ids for filtered sections (e.g. home-mental TopPick). Not rendered in UI. */
  filterTabIds?: string[];
  /** Category for single-product (e.g. "Skin care", "Headphone"). */
  category?: string;
  /** Reviews text (e.g. "(134 reviews)"). */
  reviewsText?: string;
  /** Full description for single-product. */
  description?: string;
  /** Full rich description HTML for single-product detail content. */
  descriptionHtml?: string;
  /** Full plain-text description for single-product detail content. */
  descriptionText?: string;
  /** Optional rich dimensions/specification HTML for a dedicated product tab. */
  dimensionsHtml?: string;
  /** Optional plain-text dimensions/specification content for a dedicated product tab. */
  dimensionsText?: string;
  /** Optional rich warranty HTML for a dedicated product tab. */
  warrantyHtml?: string;
  /** Optional plain-text warranty content for a dedicated product tab. */
  warrantyText?: string;
  /** Optional rich how-to-order HTML for single-product detail content. */
  howToOrderHtml?: string;
  /** Optional plain-text how-to-order instructions for single-product detail content. */
  howToOrderText?: string;
  /** Sold progress for single-product (e.g. 84). */
  soldPercent?: number;
  /** Sold label (e.g. "84% Sold - Only 24 item(s) left in stock!"). */
  soldLabel?: string;
  sku?: string;
  /** Structured accessories/upgrades to attach on the PDP once mapping is available. */
  addOnGroups?: ProductAddOnGroup[];
  /** Badge label (e.g. "Best seller"). */
  badgeLabel?: string;
  /** Badge subtext (e.g. "Selling fast! 22 people have this in their carts."). */
  badgeSubtext?: string;
}
