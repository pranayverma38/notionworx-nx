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
import CompareButton from "@/components/common/CompareButton";
import { useContextElement } from "@/context/store";

function formatPrice(value: number): string {
  return "$" + value.toFixed(2);
}

const product = bannerProductSingleItems[1];
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
    <div
      className={`banner-product-single style-6 section-image-zoom flat-spacing-8 ${isZooming ? "zoom-active" : ""}`}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-7">
            <div className="tf-product-media-wrap sticky-top">
              <ProductMediaThumbs
                images={images}
                direction="vertical"
                preview={5}
                space={8}
                onMainSwiper={setSwiper}
                onSlideChange={handleSlideChange}
                renderMainSlide={(img) => (
                  <div className="item">
                    <DriftZoom
                      loading="lazy"
                      width={700}
                      height={700}
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
                    width={80}
                    height={80}
                    src={img.src}
                    alt="Image"
                  />
                )}
              />
            </div>
          </div>
          <div className="col-lg-5">
            <div className="tf-product-info-wrap position-relative mt-lg-0">
              <div ref={registerPane} className="tf-zoom-main sticky-top" />
              <div className="tf-product-info-list other-image-zoom">
                <div className="tf-product-info-heading">
                  {product.category && (
                    <p className="product-infor-cate text-caption-01 mb-4">
                      {product.category}
                    </p>
                  )}
                  <h3 className="product-infor-name mb-12">{product.name}</h3>
                  <div className="product-infor-meta mb-20">
                    <div className="meta_rate">
                      <div className="star-wrap normal d-flex align-items-center">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className="icon icon-Star" />
                        ))}
                      </div>
                      {product.reviewsText && (
                        <span className="text-caption-01 cl-text-2">
                          {product.reviewsText}
                        </span>
                      )}
                    </div>
                    <div className="br-line type-vertical" />
                    <div className="meta_sold">
                      <i className="icon icon-Lightning text-primary" />
                      <span className="text-caption-01 cl-text-1">
                        {product.badgeSubtext}
                      </span>
                    </div>
                    <div className="br-line type-vertical" />
                    <div className="meta_prd_code text-caption-01">
                      <span className="cl-text-2">SKU:</span>
                      <span> {product.sku}</span>
                    </div>
                  </div>
                  <div className="product-infor-price mb-12">
                    <h4 className="price-on-sale">
                      {formatPrice(currentPrice)}
                    </h4>
                    {product.priceOld != null && (
                      <>
                        <div className="br-line type-vertical" />
                        <p className="cl-text-3 text-decoration-line-through">
                          {formatPrice(product.priceOld)}
                        </p>
                      </>
                    )}
                    {product.badge && (
                      <span className="badge-sale text-white fw-semibold text-caption-02">
                        {product.badge}
                      </span>
                    )}
                  </div>
                  {product.description && (
                    <p className="product-infor-desc cl-text-2 mb-12">
                      {product.description}
                    </p>
                  )}
                  <div className="product-infor-reality lh-24">
                    <div className="ic d-flex">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          width="24"
                          height="24"
                          rx="4"
                          fill="#101010"
                        ></rect>
                        <path
                          d="M19.4569 11.7975C19.435 11.7481 18.9056 10.5738 17.7287 9.39687C16.1606 7.82875 14.18 7 12 7C9.81999 7 7.83937 7.82875 6.27124 9.39687C5.09437 10.5738 4.56249 11.75 4.54312 11.7975C4.51469 11.8614 4.5 11.9306 4.5 12.0006C4.5 12.0706 4.51469 12.1398 4.54312 12.2037C4.56499 12.2531 5.09437 13.4269 6.27124 14.6038C7.83937 16.1713 9.81999 17 12 17C14.18 17 16.1606 16.1713 17.7287 14.6038C18.9056 13.4269 19.435 12.2531 19.4569 12.2037C19.4853 12.1398 19.5 12.0706 19.5 12.0006C19.5 11.9306 19.4853 11.8614 19.4569 11.7975ZM12 14.5C11.5055 14.5 11.0222 14.3534 10.6111 14.0787C10.1999 13.804 9.87951 13.4135 9.69029 12.9567C9.50107 12.4999 9.45157 11.9972 9.54803 11.5123C9.64449 11.0273 9.88259 10.5819 10.2322 10.2322C10.5819 9.8826 11.0273 9.6445 11.5123 9.54804C11.9972 9.45157 12.4999 9.50108 12.9567 9.6903C13.4135 9.87952 13.804 10.2 14.0787 10.6111C14.3534 11.0222 14.5 11.5055 14.5 12C14.5 12.663 14.2366 13.2989 13.7678 13.7678C13.2989 14.2366 12.663 14.5 12 14.5Z"
                          fill="white"
                        ></path>
                      </svg>
                    </div>
                    <span className="text-caption-01">
                      28 people are viewing this right now
                    </span>
                  </div>
                </div>
                <div className="br-line" />
                <div className="single-choose-option d-grid gap-20">
                  {sizes.length > 0 && (
                    <div className="variant-picker-item variant-size-2 d-grid gap-12">
                      <div className="variant-picker-label">
                        <div>
                          Pick a Size:
                          <span className="variant-picker-label-value text-capitalize fw-medium">
                            {" "}
                            {currentSize}
                          </span>
                        </div>
                        <a
                          href="#findSize"
                          data-bs-toggle="modal"
                          className="tf-btn-line-2 style-primary text-caption-01 fw-semibold"
                        >
                          Size Guide
                        </a>
                      </div>
                      <div className="variant-picker-values">
                        {sizes.map((s) => (
                          <span
                            key={s.value}
                            className={`size-btn ${s.value === currentSize ? "active" : ""}`}
                            onClick={() => setCurrentSize(s.value)}
                          >
                            {s.value}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="tf-product-variant mb-4">
                    <div className="tf-product-total-quantity">
                      <p className="">Quantity:</p>
                      <div className="group-action">
                        <div className="wg-quantity">
                          <button
                            type="button"
                            className="btn-quantity btn-decrease"
                            disabled={quantity <= 1}
                            onClick={() =>
                              setQuantity(Math.max(1, quantity - 1))
                            }
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
                        <a
                          href="#shoppingCart"
                          data-bs-toggle="offcanvas"
                          suppressHydrationWarning
                          className={`btn-action-price tf-btn type-xl animate-btn w-100 ${isAdded ? "disabled" : ""}`}
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
                      </div>
                      <Link
                        href="/checkout"
                        className="tf-btn type-xl btn-secondary animate-btn w-100"
                      >
                        Buy It Now
                      </Link>
                    </div>
                  </div>
                  <div className="tf-product-extra-link mb-8">
                    <CompareButton product={product} variant="extra" />
                    <a
                      href="#ask"
                      data-bs-toggle="modal"
                      className="product-extra-icon link fw-medium"
                    >
                      <i className="icon icon-Question"></i>
                      Ask A Question
                    </a>
                    <a
                      href="#findSize"
                      data-bs-toggle="modal"
                      className="product-extra-icon link fw-medium"
                    >
                      <i className="icon icon-Ruler"></i>
                      Size Guide
                    </a>
                    <a
                      href="#share"
                      data-bs-toggle="modal"
                      className="product-extra-icon link fw-medium"
                    >
                      <i className="icon icon-ShareNetwork"></i>
                      Share
                    </a>
                  </div>
                  <div className="">
                    <Link
                      href={`/product-detail/${product.id}`}
                      className="tf-btn-line-2 fw-semibold style-primary pb-4"
                    >
                      View All Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
