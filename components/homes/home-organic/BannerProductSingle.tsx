"use client";
import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { bannerProductSingleItems } from "@/data/products/products";
import { ProductMediaThumbs } from "@/components/ui/ProductMediaThumbs";
import {
  ProductProvider,
  useProduct,
  SizeOption,
} from "@/context/ProductContext";
import DriftZoom from "@/components/ui/DriftZoom";
import { Swiper as SwiperType } from "swiper";
import WishlistButton from "@/components/common/WishlistButton";
import CompareButton from "@/components/common/CompareButton";
import { useContextElement } from "@/context/store";

function formatPrice(value: number): string {
  return "$" + value.toFixed(2);
}

const product = bannerProductSingleItems[4];
const imagesData = product.images ?? [];

function BannerProductSingleInner() {
  const {
    currentColor,
    setCurrentColor,
    currentSize,
    setCurrentSize,
    quantity,
    setQuantity,
    registerPane,
    isZooming,
    sizes,
  } = useProduct();

  const { addProductToCart, isAddedToCartProducts } = useContextElement();
  const isAdded = isAddedToCartProducts(product.id);

  const currentVariant = useMemo(
    () => sizes.find((s) => s.value === currentSize) || sizes[0],
    [currentSize, sizes],
  );

  const currentPrice = currentVariant?.price
    ? parseFloat(currentVariant.price)
    : product.price;

  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  const images = useMemo(
    () =>
      imagesData.map((img) => ({
        ...img,
        src: img.src?.startsWith("/") ? img.src : `/${img.src}`,
      })),
    [],
  );

  // Sync Gallery with Variant Selection
  useEffect(() => {
    if (!swiper || swiper.destroyed) return;

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

  const handleSlideChange = (index: number) => {
    const activeImg = images[index];
    if (!activeImg) return;
    if (activeImg.dataColor) setCurrentColor(activeImg.dataColor);
    if (activeImg.dataSize) setCurrentSize(activeImg.dataSize);
  };

  return (
    <section className="flat-spacing bg-main">
      <div
        className={`banner-product-single style-3 section-image-zoom ${isZooming ? "zoom-active" : ""}`}
      >
        <div className="container-2">
          <div className="row">
            <div className="col-lg-6">
              <div className="tf-product-media-wrap sticky-top">
                <ProductMediaThumbs
                  images={images}
                  direction="vertical"
                  preview={3}
                  space={8}
                  onMainSwiper={setSwiper}
                  onSlideChange={handleSlideChange}
                  renderMainSlide={(img) => (
                    <div className="item">
                      <DriftZoom
                        loading="lazy"
                        width={490}
                        height={548}
                        className="tf-image-zoom"
                        dataZoom={img.src}
                        src={img.src}
                        alt="img-product"
                      />
                    </div>
                  )}
                  renderThumbSlide={(img) => (
                    <Image
                      loading="lazy"
                      width={82}
                      height={110}
                      src={img.src}
                      alt="Image"
                    />
                  )}
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="tf-product-info-wrap position-relative mt-lg-0">
                <div ref={registerPane} className="tf-zoom-main sticky-top" />
                <div className="tf-product-info-list other-image-zoom gap-24">
                  <div className="single-heading">
                    {product.category && (
                      <p className="detail-tag text-label cl-text-2 mb-4">
                        {product.category}
                      </p>
                    )}
                    <Link
                      href={`/product-detail/${product.id}`}
                      className="detail-name h3 fw-medium mb-12 link"
                    >
                      {product.name}
                    </Link>
                    <div className="d-flex align-items-center gap-4 mb-12">
                      <div className="star-wrap normal d-flex align-items-center">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className="icon icon-Star fs-12" />
                        ))}
                      </div>
                      {product.reviewsText && (
                        <span className="cl-text-2 text-caption-02">
                          {product.reviewsText}
                        </span>
                      )}
                    </div>
                    {product.badgeLabel && (
                      <div className="d-flex align-items-center gap-4 mb-20">
                        <div className="tf-product-pre-order style-2">
                          <span className="text-caption-01">
                            {product.badgeLabel}
                          </span>
                        </div>
                        <i className="icon icon-Lightning fs-20 text-primary" />
                        <span className="text-caption-01 cl-text-2">
                          {product.badgeSubtext}
                        </span>
                      </div>
                    )}
                    <div className="detail-price">
                      <h4 className="price-on-sale">
                        {formatPrice(currentPrice)}
                      </h4>
                      {product.priceOld != null && (
                        <p className="cl-text-3 text-decoration-line-through">
                          {formatPrice(product.priceOld)}
                        </p>
                      )}
                      {product.badge && (
                        <span className="badge-sale text-white fw-semibold text-caption-02">
                          {product.badge}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="single-choose-option d-grid gap-20">
                    <div className="tf-product-total-quantity">
                      <p className="">Quantity:</p>
                      <div className="wg-quantity mb-8">
                        <button
                          type="button"
                          className="btn-quantity btn-decrease"
                          disabled={quantity <= 1}
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                          <i className="icon icon-minus" />
                        </button>
                        <input
                          className="quantity-product"
                          type="text"
                          value={quantity}
                          readOnly
                        />
                        <button
                          type="button"
                          className="btn-quantity btn-increase"
                          onClick={() => setQuantity(quantity + 1)}
                        >
                          <i className="icon icon-plus" />
                        </button>
                      </div>
                      <div className="group-action w-100">
                        <a
                          href="#shoppingCart"
                          data-bs-toggle="offcanvas"
                          suppressHydrationWarning
                          className={`btn-action-price type-xl tf-btn animate-btn w-100 ${isAdded ? "disabled" : ""}`}
                          onClick={() =>
                            !isAdded && addProductToCart(product, quantity)
                          }
                          style={
                            isAdded
                              ? { pointerEvents: "none", opacity: "0.7" }
                              : {}
                          }
                        >
                          {isAdded ? (
                            "Already Added"
                          ) : (
                            <>
                              Add To Cart
                              <span className="d-none d-sm-block d-md-none d-lg-block">
                                &nbsp;-&nbsp;
                              </span>
                              <span className="price-add d-none d-sm-block d-md-none d-lg-block">
                                {formatPrice(currentPrice * quantity)}
                              </span>
                            </>
                          )}
                        </a>
                        <WishlistButton
                          product={product}
                          variant="button"
                          className="hover-tooltip box-icon bg-white btn-add-wishlist"
                        />
                        <CompareButton
                          product={product}
                          icon="icon-GitDiff"
                          className="hover-tooltip tooltip-top box-icon bg-white btn-add-compare"
                        />
                      </div>
                      <Link
                        href="/checkout"
                        className="btn-action-buy type-xl tf-btn btn-primary animate-btn w-100"
                      >
                        Buy It Now
                      </Link>
                    </div>
                    <div className="">
                      <Link
                        href={`/product-detail/${product.id}`}
                        className="tf-btn-line-2 fw-semibold style-primary pb-4"
                      >
                        View Full Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function BannerProductSingle() {
  const sizes: SizeOption[] = (product.sizeVariants || []).map((s) => ({
    value: s.value,
    price: s.price,
    active: s.active,
  }));

  return (
    <ProductProvider
      extraImages={imagesData}
      colors={product.colors || []}
      sizes={sizes}
    >
      <BannerProductSingleInner />
    </ProductProvider>
  );
}
