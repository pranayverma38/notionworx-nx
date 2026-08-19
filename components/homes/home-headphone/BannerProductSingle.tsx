"use client";
import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { bannerProductSingleItems } from "@/data/products/products";
import { ProductMediaThumbs } from "@/components/ui/ProductMediaThumbs";
import {
  ProductProvider,
  useProduct,
  ColorOption,
} from "@/context/ProductContext";
import DriftZoom from "@/components/ui/DriftZoom";
import { Swiper as SwiperType } from "swiper";
import { ProductExtraActions } from "@/components/shop-details/product-info/ProductExtraActions";
import { useContextElement } from "@/context/store";

function formatPrice(value: number): string {
  return "$" + value.toFixed(2);
}

const product = bannerProductSingleItems[2];
const imagesData = product.images ?? [];

const HEADPHONE_COLORS: ColorOption[] = [
  {
    label: "Brown",
    swatchClass: "bg-brown",
    img: "/assets/images/product/single/detail-4_4.jpg",
  },
  {
    label: "Metal",
    swatchClass: "bg-metal",
    img: "/assets/images/product/single/detail-4.jpg",
  },
  {
    label: "Blue",
    swatchClass: "bg-blue",
    img: "/assets/images/product/single/detail-4_6.jpg",
  },
];

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
    colors,
  } = useProduct();

  const { addProductToCart, isAddedToCartProducts } = useContextElement();
  const isAdded = isAddedToCartProducts(product.id);

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
      return -1;
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
    <section
      className={`banner-product-single style-4 section-image-zoom flat-spacing ${isZooming ? "zoom-active" : ""}`}
    >
      <div className="container">
        <div className="row">
          <div className="col-xl-7 col-md-6">
            <div className="tf-product-media-wrap sticky-top">
              <ProductMediaThumbs
                images={images}
                direction="vertical"
                preview={5}
                space={16}
                onMainSwiper={setSwiper}
                onSlideChange={handleSlideChange}
                renderMainSlide={(img) => (
                  <div className="item">
                    <DriftZoom
                      loading="lazy"
                      width={576}
                      height={768}
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
          <div className="col-xl-5 col-md-6">
            <div className="tf-product-info-wrap position-relative mt-md-0">
              <div ref={registerPane} className="tf-zoom-main sticky-top" />
              <div className="tf-product-info-list other-image-zoom">
                <div className="tf-product-info-heading">
                  {product.category && (
                    <p className="product-infor-cate text-caption-01 mb-4">
                      {product.category}
                    </p>
                  )}
                  <Link
                    href={`/product-detail/${product.id}`}
                    className="h3 product-infor-name mb-12 link"
                  >
                    {product.name}
                  </Link>
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
                  </div>
                  <div className="product-infor-price mb-12">
                    <h4 className="price-on-sale">
                      {formatPrice(product.price)}
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
                  {product.description && (
                    <p className="product-infor-desc cl-text-2 mb-12">
                      {product.description}
                    </p>
                  )}
                </div>
                <div className="br-line" />
                <div className="tf-product-variant">
                  {colors.length > 0 && (
                    <div className="variant-picker-item variant-color">
                      <div className="variant-picker-label">
                        <div>
                          Colors:
                          <span className="variant-picker-label-value text-capitalize fw-medium">
                            {" "}
                            {currentColor}
                          </span>
                        </div>
                      </div>
                      <div className="variant-picker-values">
                        {colors.map((c) => (
                          <div
                            key={c.label}
                            role="button"
                            tabIndex={0}
                            className={`hover-tooltip tooltip-bot color-btn style-image ${c.label.toLowerCase() === currentColor ? "active" : ""}`}
                            onClick={() =>
                              setCurrentColor(c.label.toLowerCase())
                            }
                          >
                            <div className="img">
                              <Image
                                loading="lazy"
                                width={60}
                                height={60}
                                src={c.img}
                                alt={c.label}
                              />
                            </div>
                            <span className="tooltip">{c.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="tf-product-total-quantity">
                    <p className="">Quantity:</p>
                    <div className="group-action">
                      <div className="wg-quantity">
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
                      <a
                        href="#shoppingCart"
                        data-bs-toggle="offcanvas"
                        suppressHydrationWarning
                        className={`tf-btn type-xl animate-btn w-100 ${isAdded ? "disabled" : ""}`}
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
                              {formatPrice(product.price * quantity)}
                            </span>
                          </>
                        )}
                      </a>
                    </div>
                    <Link
                      href="/checkout"
                      className="tf-btn type-xl btn-primary animate-btn w-100 mt-12"
                    >
                      Buy It Now
                    </Link>
                  </div>
                </div>
                <ProductExtraActions product={product} />
                <div className="mt-8">
                  <Link
                    href={`/product-detail/${product.id}`}
                    className="tf-btn-line-2 style-primary fw-semibold pb-4"
                  >
                    View All Details
                  </Link>
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
  return (
    <ProductProvider
      extraImages={imagesData}
      colors={HEADPHONE_COLORS}
      sizes={[]}
      initialColor="metal"
    >
      <BannerProductSingleInner />
    </ProductProvider>
  );
}
