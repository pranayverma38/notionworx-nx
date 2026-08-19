"use client";

import Link from "next/link";
import { bannerProductSingleItems } from "@/data/products/products";
import CountdownTimer from "@/components/common/Countdown";
import {
  ProductProvider,
  useProduct,
  SizeOption,
} from "@/context/ProductContext";
import DriftZoom from "@/components/ui/DriftZoom";

function formatPrice(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return "$" + num.toFixed(2).replace(".", ",");
}

const product = bannerProductSingleItems[5];
const imagesData = product.images ?? [];

function ProductSingleInner() {
  const {
    currentSize,
    setCurrentSize,
    quantity,
    setQuantity,
    registerPane,
    isZooming,
    sizes,
  } = useProduct();

  const mainImage = imagesData[0];
  const src = mainImage?.src?.startsWith("/")
    ? mainImage.src
    : `/${mainImage.src}`;

  const activeSizeObj = sizes.find((s) => s.value === currentSize) || sizes[0];

  return (
    <section className="flat-spacing">
      <div
        className={`banner-product-single section-image-zoom ${isZooming ? "zoom-active" : ""}`}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="single-image radius-16 overflow-hidden">
                {mainImage && (
                  <DriftZoom
                    className="tf-image-zoom"
                    loading="lazy"
                    width={690}
                    height={645}
                    src={src}
                    dataZoom={src}
                    alt="Image"
                  />
                )}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="tf-product-info-wrap position-relative mt-lg-0">
                <div ref={registerPane} className="tf-zoom-main sticky-top" />
                <div className="tf-product-info-list other-image-zoom">
                  <div className="single-heading">
                    {product.category && (
                      <p className="detail-tag text-caption-01 cl-text-2 fw-semibold mb-4 text-uppercase">
                        {product.category}
                      </p>
                    )}
                    <Link
                      href={`/product-detail/${product.id}`}
                      className="detail-name h3 fw-medium link mb-12"
                    >
                      {product.name}
                    </Link>
                    <div className="detail-rate d-flex align-items-center flex-wrap gap-16 mb-16">
                      <div className="d-flex align-items-center gap-4">
                        <div className="star-wrap normal d-flex align-items-center">
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className="icon icon-Star" />
                          ))}
                        </div>
                        {product.reviewsText && (
                          <span className="cl-text-2">
                            {product.reviewsText}
                          </span>
                        )}
                      </div>
                      {product.badgeSubtext && (
                        <div className="d-flex align-items-center gap-4">
                          <i className="icon icon-Lightning fs-20 text-primary" />
                          {product.badgeSubtext}
                        </div>
                      )}
                    </div>
                    <div className="detail-price mb-8">
                      <h4 className="price-on-sale">
                        {formatPrice(activeSizeObj?.price || product.price)}
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
                      <p className="detail-desc text-body-1 cl-text-2">
                        {product.description}
                      </p>
                    )}
                  </div>
                  {(product.countdown != null ||
                    product.soldPercent != null) && (
                    <div className="single-count">
                      {product.countdown != null && (
                        <div className="detail-sale mb-16">
                          <p className="mini-title fw-semibold">
                            Hurry Up! <br /> Offer ends In:
                          </p>
                          <div className="countdown-v03 h4">
                            <div className="js-countdown cd-has-zero cd-custom">
                              <CountdownTimer style={7} />
                            </div>
                          </div>
                        </div>
                      )}
                      {product.soldPercent != null && (
                        <div className="detail-sold">
                          <p className="mini-title fw-semibold">Sold It:</p>
                          <div className="sold-it">
                            <div
                              className="progress"
                              role="progressbar"
                              aria-valuenow={product.soldPercent}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            >
                              <div
                                className="progress-bar"
                                style={{ width: `${product.soldPercent}%` }}
                              />
                            </div>
                            {product.soldLabel && (
                              <p className="text-caption-01">
                                {product.soldLabel}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="single-choose-option d-grid gap-20">
                    {sizes.length > 0 && (
                      <div className="variant-picker-item variant-size-2 d-grid gap-12">
                        <div className="variant-picker-label">
                          <div>
                            Size:
                            <span className="variant-picker-label-value text-capitalize fw-medium">
                              {" "}
                              {currentSize}
                            </span>
                          </div>
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
                        <div
                          className="btn-action-price tf-btn type-xl animate-btn w-100"
                          style={{ cursor: "pointer" }}
                        >
                          Add To Cart -{" "}
                          {formatPrice(
                            parseFloat(
                              activeSizeObj?.price || product.price.toString(),
                            ) * quantity,
                          )}
                        </div>
                      </div>
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

export default function ProductSingle() {
  return (
    <ProductProvider
      extraImages={imagesData}
      colors={[]}
      sizes={(product.sizeVariants as SizeOption[]) || []}
    >
      <ProductSingleInner />
    </ProductProvider>
  );
}
