"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { FreeMode, Thumbs } from "swiper/modules";

import type { ProductSingleImage } from "@/types/productCard";

export interface ProductMediaThumbsProps {
  images: ProductSingleImage[];
  direction?: "vertical" | "horizontal";
  preview?: number;
  xlPreview?: number;
  space?: number;
  onMainSwiper?: (swiper: SwiperType) => void;
  onSlideChange?: (index: number) => void;
  renderMainSlide: (img: ProductSingleImage, index: number) => React.ReactNode;
  renderThumbSlide: (img: ProductSingleImage, index: number) => React.ReactNode;
  mainId?: string;
  thumbClassName?: string;
  wrapperClassName?: string;
}

export function ProductMediaThumbs({
  images,
  direction = "horizontal",
  preview = 5,
  xlPreview,
  space = 8,
  onMainSwiper,
  onSlideChange,
  renderMainSlide,
  renderThumbSlide,
  mainId = "gallery-swiper-started",
  thumbClassName = "other-image-zoom",
  wrapperClassName,
}: ProductMediaThumbsProps) {
  const safeId = useId().replace(/:/g, "");

  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const mainRef = useRef<SwiperType | null>(null);
  const xl = xlPreview ?? preview;
  /** Match `assets/js/zoom.js`: breakpoint 1200 uses `xl_preview` (no cap). */
  const desktopSlidesPerView = xl;

  useEffect(() => {
    const main = mainRef.current;
    if (!main || !thumbsSwiper || thumbsSwiper.destroyed || !main.params.thumbs)
      return;
    Object.assign(main.params.thumbs, { swiper: thumbsSwiper });
    main.thumbs.init();
    main.thumbs.update(true);
    main.update();
  }, [thumbsSwiper]);

  return (
    <div
      id={`product-media-thumbs-${safeId}`}
      className={wrapperClassName ?? "product-thumbs-slider style-row row_left"}
    >
      <div className="flat-wrap-media-product">
        <Swiper
          modules={[Thumbs]}
          dir="ltr"
          spaceBetween={5}
          speed={800}
          observer
          observeParents
          thumbs={thumbsSwiper ? { swiper: thumbsSwiper } : undefined}
          onSwiper={(swiper) => {
            mainRef.current = swiper;
            onMainSwiper?.(swiper);
          }}
          onSlideChange={(swiper) => onSlideChange?.(swiper.activeIndex)}
          id={mainId}
          className="tf-product-media-main tf-product-media-main-inner"
        >
          {images.map((img, i) => (
            <SwiperSlide key={i}>{renderMainSlide(img, i)}</SwiperSlide>
          ))}
        </Swiper>
      </div>

      <Swiper
        modules={[FreeMode, Thumbs]}
        onSwiper={setThumbsSwiper}
        spaceBetween={space}
        slidesPerView={preview}
        freeMode
        watchSlidesProgress
        observer
        observeParents
        slideToClickedSlide
        breakpoints={{
          0: { direction: "horizontal", slidesPerView: 4 },
          575: { direction: "horizontal", slidesPerView: 5 },
          1200: { direction, slidesPerView: desktopSlidesPerView },
        }}
        dir="ltr"
        className={`swiper tf-product-media-thumbs ${thumbClassName}`.trim()}
      >
        {images.map((img, i) => (
          <SwiperSlide key={i} className="stagger-item">
            <div
              className={`item ${img.video ? "tf-btn-video btn-abs" : ""} ${img.model3d ? "position-relative" : ""}`.trim()}
            >
              {renderThumbSlide(img, i)}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default ProductMediaThumbs;
