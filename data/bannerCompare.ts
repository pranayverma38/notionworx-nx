import type { BannerCompareImages } from "@/types/bannerCompare";

/**
 * Default: Unsplash crops in the same aspect as the HTML demo. Replace with local theme
 * assets when present: `public/assets/images/section/skin-before.jpg` and `skin-after.jpg`.
 */
export const bannerCompareImages: BannerCompareImages = {
  beforeSrc: "/assets/images/section/skin-before.jpg",
  afterSrc: "/assets/images/section/skin-after.jpg",
};
