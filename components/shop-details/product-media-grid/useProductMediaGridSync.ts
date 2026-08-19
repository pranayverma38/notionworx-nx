import { useCallback, useEffect, useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import type { ProductCardItem, ProductSingleImage } from "@/types/productCard";
import {
  PRODUCT_MEDIA_DESKTOP_MIN_WIDTH,
  PRODUCT_MEDIA_SCROLL_OBSERVER_OPTIONS,
  findImageIndexForVariant,
  findVariantSlideIndexPreferringActive,
  pickDominantVisibleSlideIndex,
  resolveSwatchLabel,
  scheduleDeferredScrollIntoView,
} from "./utils";

type LastVariant = { color: string; size: string };

export function useProductMediaGridSync({
  images,
  colors,
  currentColor,
  currentSize,
  setCurrentColor,
  setCurrentSize,
  mainSwiper,
}: {
  images: ProductSingleImage[];
  colors: ProductCardItem["colors"];
  currentColor: string;
  currentSize: string;
  setCurrentColor: (c: string) => void;
  setCurrentSize: (s: string) => void;
  mainSwiper: SwiperType | null;
}) {
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const slideIndexByEl = useRef(new Map<Element, number>());
  const isAutoScrolling = useRef(false);
  const lastUpdate = useRef<LastVariant>({ color: "", size: "" });

  const setSlideRef = useCallback((index: number, el: HTMLDivElement | null) => {
    const prev = slideRefs.current[index];
    if (prev) slideIndexByEl.current.delete(prev);
    slideRefs.current[index] = el;
    if (el) slideIndexByEl.current.set(el, index);
  }, []);

  const seedLastUpdateFromVariant = useCallback(
    (color: string, size: string) => {
      const index = findImageIndexForVariant(images, color, size);
      if (index !== -1) {
        const img = images[index];
        const matchedColor = resolveSwatchLabel(colors, img.dataColor);
        if (matchedColor) lastUpdate.current.color = matchedColor;
        if (img.dataSize) lastUpdate.current.size = img.dataSize;
      } else {
        lastUpdate.current = { color, size: size ?? "" };
      }
    },
    [images, colors]
  );

  const handleVariantChange = useCallback(
    (color: string, size: string) => {
      if (typeof window === "undefined") return;

      if (
        color.toLowerCase() === lastUpdate.current.color.toLowerCase() &&
        size?.toLowerCase() === lastUpdate.current.size.toLowerCase()
      ) {
        return;
      }

      const index = findImageIndexForVariant(images, color, size);
      if (index === -1) return;

      const img = images[index];
      const matchedColor = resolveSwatchLabel(colors, img.dataColor);

      if (window.innerWidth >= PRODUCT_MEDIA_DESKTOP_MIN_WIDTH) {
        const target = slideRefs.current[index];
        if (!target) return;

        scheduleDeferredScrollIntoView(
          target,
          () => {
            isAutoScrolling.current = true;
          },
          () => {
            isAutoScrolling.current = false;
          }
        );

        if (matchedColor) lastUpdate.current.color = matchedColor;
        if (img.dataSize) lastUpdate.current.size = img.dataSize;
      } else if (mainSwiper && !mainSwiper.destroyed) {
        const slideIndex = findVariantSlideIndexPreferringActive(
          images,
          color,
          size,
          mainSwiper.activeIndex
        );
        if (slideIndex === -1) return;
        const chosen = images[slideIndex];
        const matchedColorMobile = resolveSwatchLabel(colors, chosen.dataColor);
        mainSwiper.slideTo(slideIndex, 800);
        if (matchedColorMobile) lastUpdate.current.color = matchedColorMobile;
        if (chosen.dataSize) lastUpdate.current.size = chosen.dataSize;
      }
    },
    [images, mainSwiper, colors]
  );

  /** After reload, only sync refs — do not scroll or animate Swiper (user-requested). */
  const hasSyncedInitialVariant = useRef(false);

  useEffect(() => {
    if (!hasSyncedInitialVariant.current) {
      hasSyncedInitialVariant.current = true;
      seedLastUpdateFromVariant(currentColor, currentSize);
      return;
    }
    handleVariantChange(currentColor, currentSize);
  }, [currentColor, currentSize, handleVariantChange, seedLastUpdateFromVariant]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (
        window.innerWidth < PRODUCT_MEDIA_DESKTOP_MIN_WIDTH ||
        isAutoScrolling.current
      ) {
        return;
      }

      const dominantIndex = pickDominantVisibleSlideIndex(
        entries,
        slideIndexByEl.current
      );
      if (dominantIndex === undefined) return;

      const img = images[dominantIndex];
      if (!img) return;

      const matchedColor = resolveSwatchLabel(colors, img.dataColor);
      if (matchedColor && matchedColor !== lastUpdate.current.color) {
        lastUpdate.current.color = matchedColor;
        setCurrentColor(matchedColor);
      }
      if (img.dataSize && img.dataSize !== lastUpdate.current.size) {
        lastUpdate.current.size = img.dataSize;
        setCurrentSize(img.dataSize);
      }
    }, PRODUCT_MEDIA_SCROLL_OBSERVER_OPTIONS);

    slideRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [images, colors, setCurrentColor, setCurrentSize]);

  return { setSlideRef };
}
