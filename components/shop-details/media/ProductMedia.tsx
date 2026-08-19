"use client";
import DriftZoom from "@/components/ui/DriftZoom";
import ProductMediaThumbs from "@/components/ui/ProductMediaThumbs";
import { ProductCardItem, ProductSingleImage } from "@/types/productCard";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import ModelViewer from "@/components/ui/ModelViewer";

import { useProduct } from "@/context/ProductContext";
import { Swiper as SwiperType } from "swiper";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";

export default function ProductMedia({
  product,
}: {
  product: ProductCardItem;
}) {
  const {
    currentColor,
    currentSize,
    setCurrentColor,
    setCurrentSize,
    extraImages,
    thumbnailPosition,
  } = useProduct();

  const images: ProductSingleImage[] = useMemo(
    () => [
      {
        src:
          product.img ||
          extraImages[0]?.src ||
          "/assets/images/product/single/detail-1.jpg",
        dataColor: extraImages[0]?.dataColor,
        dataSize: extraImages[0]?.dataSize,
      },
      ...extraImages.slice(1),
    ],
    [product.img, extraImages],
  );

  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  // Sync Gallery with Variant Selection
  useEffect(() => {
    if (!swiper || swiper.destroyed) return;

    // Prioritized search: 1. Both match, 2. Color match, 3. Size match
    const findIndex = () => {
      const both = images.findIndex(
        (img) => img.dataColor === currentColor && img.dataSize === currentSize,
      );
      if (both !== -1) return both;

      const colorMatch = images.findIndex(
        (img) => img.dataColor === currentColor,
      );
      if (colorMatch !== -1) return colorMatch;

      const sizeMatch = images.findIndex((img) => img.dataSize === currentSize);
      return sizeMatch !== -1 ? sizeMatch : -1;
    };

    const targetIndex = findIndex();
    if (targetIndex !== -1 && targetIndex !== swiper.activeIndex) {
      swiper.slideTo(targetIndex);
    }
  }, [currentColor, currentSize, swiper, images]);

  // Handle Manual Gallery Swipe -> Updates Variants
  const handleSlideChange = (index: number) => {
    const activeImg = images[index];
    if (!activeImg) return;

    if (activeImg.dataColor) setCurrentColor(activeImg.dataColor);
    if (activeImg.dataSize) setCurrentSize(activeImg.dataSize);
  };

  return (
    <div className="col-md-6">
      <div className="tf-product-media-wrap sticky-top">
        <Gallery>
          <ProductMediaThumbs
            images={images}
            direction={
              thumbnailPosition === "bottom" ? "horizontal" : "vertical"
            }
            preview={7}
            wrapperClassName={
              thumbnailPosition === "bottom"
                ? "product-thumbs-slider"
                : thumbnailPosition === "right"
                  ? "product-thumbs-slider style-row"
                  : undefined
            }
            onMainSwiper={setSwiper}
            onSlideChange={handleSlideChange}
            renderMainSlide={(img: ProductSingleImage) => {
              if (img.model3d) {
                return <ModelViewer src={img.model3d} />;
              }
              return img.video ? (
                <div className="video-product">
                  <video
                    playsInline
                    autoPlay
                    preload="metadata"
                    muted
                    controls
                    loop
                    src={img.video}
                  ></video>
                </div>
              ) : (
                <Item
                  original={img.src}
                  thumbnail={img.src}
                  width={576}
                  height={768}
                >
                  {({ ref, open }) => (
                    <a
                      ref={ref as React.LegacyRef<HTMLAnchorElement>}
                      onClick={open}
                      className="item"
                      style={{ cursor: "pointer" }}
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
              );
            }}
            renderThumbSlide={(img: ProductSingleImage) => (
              <>
                {img.model3d && (
                  <div className="wrap-btn-viewer">
                    <i className="icon icon-btn3d"></i>
                  </div>
                )}
                <Image
                  loading="lazy"
                  width={82}
                  height={110}
                  src={img.src}
                  alt="Image"
                />
                {img.video && <i className="icon icon-video"></i>}
              </>
            )}
          />
        </Gallery>
      </div>
    </div>
  );
}
