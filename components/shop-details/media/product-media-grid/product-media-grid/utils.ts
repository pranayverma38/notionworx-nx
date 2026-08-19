import type { ProductCardItem, ProductSingleImage } from "@/types/productCard";

/** Matches Bootstrap `md` — desktop uses scroll-sync; below uses Swiper. */
export const PRODUCT_MEDIA_DESKTOP_MIN_WIDTH = 768;

export const PRODUCT_MEDIA_SCROLL_OBSERVER_OPTIONS: IntersectionObserverInit = {
  root: null,
  rootMargin: "-50% 0px",
  threshold: [0, 0.25, 0.5, 0.75, 1],
};

export function buildProductGalleryImages(
  productImg: string,
  extraImages: ProductSingleImage[]
): ProductSingleImage[] {
  return [
    {
      src:
        productImg ||
        extraImages[0]?.src ||
        "/assets/images/product/single/detail-1.jpg",
      dataColor: extraImages[0]?.dataColor,
      dataSize: extraImages[0]?.dataSize,
    },
    ...extraImages.slice(1),
  ];
}

/** Same matching rule as {@link findImageIndexForVariant} for a single image. */
function imageMatchesVariant(
  img: ProductSingleImage,
  targetColor: string,
  targetSize: string
): boolean {
  const imgColor = img.dataColor?.toLowerCase();
  const imgSize = img.dataSize?.toLowerCase();
  const ts = targetSize?.toLowerCase() ?? "";
  return (
    (imgColor === targetColor &&
      (imgSize === ts || !ts || !imgSize)) ||
    imgColor === targetColor
  );
}

/** First gallery image whose color (and loosely size) matches the selected variant. */
export function findImageIndexForVariant(
  images: ProductSingleImage[],
  color: string,
  size: string
): number {
  const targetColor = color.toLowerCase();
  const targetSize = size?.toLowerCase() ?? "";
  return images.findIndex((img) =>
    imageMatchesVariant(img, targetColor, targetSize)
  );
}

/**
 * When several slides share the same variant metadata, keep the main swiper on
 * `activeIndex` if it still matches — avoids snapping to the first duplicate after a thumb tap.
 */
export function findVariantSlideIndexPreferringActive(
  images: ProductSingleImage[],
  color: string,
  size: string,
  activeIndex: number
): number {
  const targetColor = color.toLowerCase();
  const targetSize = size?.toLowerCase() ?? "";
  const indices: number[] = [];
  for (let i = 0; i < images.length; i++) {
    if (imageMatchesVariant(images[i], targetColor, targetSize)) {
      indices.push(i);
    }
  }
  if (indices.length === 0) return -1;
  if (indices.includes(activeIndex)) return activeIndex;
  return indices[0];
}

/** Map `dataColor` from gallery metadata to the canonical swatch `label` when possible. */
export function resolveSwatchLabel(
  colors: ProductCardItem["colors"],
  dataColor: string | undefined
): string {
  if (!dataColor) return "";
  const matched = colors?.find(
    (c) => c.label.toLowerCase() === dataColor.toLowerCase()
  )?.label;
  return matched || dataColor;
}

/**
 * Among intersecting entries, pick the slide index with the highest intersection ratio.
 */
export function pickDominantVisibleSlideIndex(
  entries: IntersectionObserverEntry[],
  slideIndexByEl: Map<Element, number>
): number | undefined {
  const visible = entries
    .filter((e) => e.isIntersecting)
    .map((e) => {
      const index = slideIndexByEl.get(e.target);
      if (index === undefined) return null;
      return { index, ratio: e.intersectionRatio };
    })
    .filter((v): v is { index: number; ratio: number } => v !== null);

  if (visible.length === 0) return undefined;
  visible.sort((a, b) => b.ratio - a.ratio);
  return visible[0].index;
}

/**
 * Grid1-style: wait 200ms; if the user did not scroll, smooth-scroll the slide to the center band.
 */
export function scheduleDeferredScrollIntoView(
  element: HTMLElement,
  onAutoScrollStart: () => void,
  onAutoScrollEnd: () => void
): void {
  const scrollBefore = window.scrollY;
  window.setTimeout(() => {
    if (window.scrollY !== scrollBefore) return;
    onAutoScrollStart();
    element.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(onAutoScrollEnd, 1000);
  }, 200);
}
