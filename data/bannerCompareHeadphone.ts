import type { BannerCompareImages } from "@/types/bannerCompare";

/**
 * Theme paths: add `headphone-before.jpg` / `headphone-after.jpg` under
 * `public/assets/images/section/`. Remote URLs keep the slider working before assets exist.
 */
export const headphoneCompareImages: BannerCompareImages = {
  beforeSrc: "/assets/images/section/headphone-before.jpg",
  afterSrc: "/assets/images/section/headphone-after.jpg",
};
