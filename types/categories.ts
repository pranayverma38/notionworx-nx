export interface Category {
  name: string;
  /** Image path. Omit when icon or saleLabel is used. */
  img?: string;
  /** Optional product count label (e.g. "20 Products") */
  quantity?: string;
  /** Icon class name (e.g. "icon-SealPercent"). When set, tile uses bg-primary and icon instead of image. */
  icon?: string;
  /** Sale tile label (e.g. "15%"). When set, tile shows cate-sale with " OFF" and no image. */
  saleLabel?: string;
  /** Optional tile class (e.g. "bg-v1", "bg-v2" for pet-care category-v05). */
  variant?: string;
}
