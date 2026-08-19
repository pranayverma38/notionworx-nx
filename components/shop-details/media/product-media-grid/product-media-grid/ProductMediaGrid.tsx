"use client";

import { useMemo, useState } from "react";
import { useProduct } from "@/context/ProductContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import DriftZoom from "@/components/ui/DriftZoom";
import type { ProductCardItem } from "@/types/productCard";
import {
  PRODUCT_MEDIA_DESKTOP_MIN_WIDTH,
  buildProductGalleryImages,
  findImageIndexForVariant,
  resolveSwatchLabel,
} from "./utils";
import { useProductMediaGridSync } from "./useProductMediaGridSync";
import Image from "next/image";

export type ProductMediaGridVariant = "default" | "grid2" | "stacked";

export default function ProductMediaGrid({
  product,
  variant = "default",
}: {
  product: ProductCardItem;
  /** `grid2`: two-column grid (`.grid-img_2`). `stacked`: hero + two-column (`.grid-img_stacked`). Both use thumb data attrs + `data-spacing` on main. */
  variant?: ProductMediaGridVariant;
}) {
  const {
    currentColor,
    currentSize,
    setCurrentColor,
    setCurrentSize,
    extraImages,
  } = useProduct();

  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);

  const images = useMemo(
    () => buildProductGalleryImages(product.img, extraImages),
    [product.img, extraImages],
  );

  const initialSlideIndex = useMemo(() => {
    const idx = findImageIndexForVariant(images, currentColor, currentSize);
    return idx === -1 ? 0 : idx;
  }, [images, currentColor, currentSize]);

  const { setSlideRef } = useProductMediaGridSync({
    images,
    colors: product.colors,
    currentColor,
    currentSize,
    setCurrentColor,
    setCurrentSize,
    mainSwiper,
  });

  const onMainSlideChange = (swiper: SwiperType) => {
    if (window.innerWidth >= PRODUCT_MEDIA_DESKTOP_MIN_WIDTH) return;
    const img = images[swiper.activeIndex];
    if (!img) return;
    const matchedColor = resolveSwatchLabel(product.colors, img.dataColor);
    if (matchedColor) setCurrentColor(matchedColor);
    if (img.dataSize) setCurrentSize(img.dataSize);
  };

  const gridModifier =
    variant === "grid2"
      ? " grid-img_2"
      : variant === "stacked"
        ? " grid-img_stacked"
        : "";

  return (
    <div className="col-md-6">
      <div className="tf-product-media-wrap wrapper-gallery-scroll sticky-top">
        <div className="product-thumbs-slider">
          <div
            className={`flat-wrap-media-product product-grid-img${gridModifier}`}
          >
            <Gallery>
              <Swiper
                id="gallery-swiper-started"
                className="tf-product-media-main"
                onSwiper={setMainSwiper}
                modules={[Thumbs]}
                initialSlide={initialSlideIndex}
                thumbs={{
                  swiper:
                    thumbsSwiper && !thumbsSwiper.destroyed
                      ? thumbsSwiper
                      : null,
                }}
                dir="ltr"
                spaceBetween={0}
                breakpoints={{
                  768: {
                    allowTouchMove: false,
                  },
                }}
                onSlideChange={onMainSlideChange}
              >
                {images.map((img, i) => (
                  <SwiperSlide key={i}>
                    <div
                      ref={(el) => setSlideRef(i, el)}
                      className="item-scroll-target w-100 h-100"
                    >
                      <Item
                        original={img.src}
                        thumbnail={img.src}
                        width={576}
                        height={768}
                      >
                        {({ ref, open }) => (
                          <a
                            ref={ref as React.LegacyRef<HTMLAnchorElement>}
                            onClick={(e) => {
                              e.preventDefault();
                              open(e);
                            }}
                            href={img.src}
                            target="_blank"
                            className="item"
                            data-pswp-width="576px"
                            data-pswp-height="768px"
                          >
                            <DriftZoom
                              loading="lazy"
                              width={576}
                              height={768}
                              className="tf-image-zoom"
                              dataZoom={img.src}
                              src={img.src}
                              alt="img-product"
                            />
                          </a>
                        )}
                      </Item>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </Gallery>
          </div>
          <Swiper
            dir="ltr"
            className="tf-product-media-thumbs other-image-zoom d-md-none"
            onSwiper={setThumbsSwiper}
            modules={[FreeMode, Thumbs]}
            initialSlide={initialSlideIndex}
            spaceBetween={10}
            slidesPerView={5}
            freeMode={false}
            watchSlidesProgress={true}
            slideToClickedSlide
            wrapperClass="swiper-wrapper stagger-wrap"
          >
            {images.map((img, i) => (
              <SwiperSlide key={i} className="stagger-item stagger-finished">
                <div
                  className="item"
                  onClick={() => {
                    if (mainSwiper && !mainSwiper.destroyed) {
                      mainSwiper.slideTo(i);
                    }
                  }}
                >
                  <Image
                    loading="lazy"
                    width={82}
                    height={110}
                    src={img.src}
                    alt="Image"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
