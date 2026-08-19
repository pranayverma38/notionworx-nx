"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";

import { useContextElement } from "@/context/Context";
import { formatPrice } from "@/utils/formatPrice";

export default function QuickView({
  registerOffcanvasElement,
}: {
  registerOffcanvasElement?: (el: HTMLElement | null) => void;
}) {
  const { quickViewItem, addProductToCart, isAddedToCartProducts } =
    useContextElement();
  const product = quickViewItem;

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const selectedColor = product?.colors?.[selectedColorIndex];
  const selectedSize = product?.sizes?.[selectedSizeIndex];
  const hasColors = Boolean(product?.colors?.length);
  const hasSizes = Boolean(product?.sizes?.length);
  const isAdded = product ? isAddedToCartProducts(product.id) : false;

  const galleryImages = useMemo(() => {
    if (product?.images?.length) return product.images.map((img) => img.src);

    const fromColors = product?.colors?.map((c) => c.img) ?? [];
    const base = [product?.img, product?.imgHover].filter(
      (img): img is string => Boolean(img),
    );
    const all = [...fromColors, ...base];
    const unique = Array.from(new Set(all));
    if (unique.length > 1) return unique;

    return [
      product?.img,
      "/assets/images/product/product-2.jpg",
      "/assets/images/product/product-3.jpg",
      "/assets/images/product/product-4.jpg",
    ];
  }, [product]);

  const handleAddToCart = () => {
    if (!product || isAdded) return;
    addProductToCart(product, quantity);
  };

  if (!product) {
    return (
      <div
        ref={registerOffcanvasElement}
        className="offcanvas offcanvas-end canvas-quickview"
        id="quickView"
      />
    );
  }

  return (
    <div
      ref={registerOffcanvasElement}
      className="offcanvas offcanvas-end canvas-quickview"
      id="quickView"
    >
      <div className="mini-quick-image">
        <div className="wrap-quick wrapper-scroll-quickview">
          {galleryImages.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className="image item-scroll-quickview"
            >
              <Image
                loading="lazy"
                width={340}
                height={444}
                src={src}
                alt={product.name}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="wrap-canvas">
        <div className="canvas-header ps-md-0">
          <h5 className="title-pop">Quick View</h5>
          <span className="icon-close-popup" data-bs-dismiss="offcanvas">
            <i className="icon icon-X2" />
          </span>
        </div>
        <div className="canvas-body ps-md-0">
          <div className="tf-product-quick_view tf-quick-prd_variant">
            <div className="tf-product-info-heading">
              <p className="product-infor-cate text-caption-01 mb-4">
                {product.category ?? "Clothing"}
              </p>
              <h3 className="product-infor-name mb-12 letter-space-0">
                {product.name}
              </h3>
              <div className="product-infor-meta mb-20">
                <div className="meta_rate">
                  <div className="star-wrap normal d-flex align-items-center">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="icon icon-Star" />
                    ))}
                  </div>
                  <span className="text-caption-01 cl-text-2">
                    {product.reviewsText ?? "(134 reviews)"}
                  </span>
                </div>
                <div className="br-line type-vertical" />
                <div className="meta_sold">
                  <i className="icon icon-Lightning text-primary" />
                  <span className="text-caption-01 cl-text-2">
                    {product.soldLabel ?? "18 sold in last 32 hours"}
                  </span>
                </div>
              </div>
              <div className="product-infor-price mb-12">
                <h4 className="price-on-sale">{formatPrice(product.price)}</h4>
                {product.priceOld != null ? (
                  <>
                    <div className="br-line type-vertical" />
                    <p className="cl-text-3 text-decoration-line-through">
                      {formatPrice(product.priceOld)}
                    </p>
                  </>
                ) : null}
                {product.badge ? (
                  <span className="badge-sale text-white fw-semibold text-caption-02">
                    {product.badge}
                  </span>
                ) : null}
              </div>
              <p className="product-infor-desc cl-text-2 mb-12">
                {product.description ??
                  "The garments labelled as Committed are products that have been produced using sustainable fibres or processes, reducing their environmental impact."}
              </p>
            </div>
            <div className="br-line" />
            <div className="tf-product-variant">
              {hasColors ? (
                <div className="variant-picker-item variant-color">
                  <div className="variant-picker-label">
                    <div>
                      Colors:{" "}
                      <span className="variant-picker-label-value value-currentColor text-capitalize fw-medium">
                        {selectedColor?.label}
                      </span>
                    </div>
                  </div>
                  <div className="variant-picker-values">
                    {product.colors.map((color, index) => (
                      <button
                        key={`${color.label}-${index}`}
                        type="button"
                        className={`hover-tooltip tooltip-bot color-btn color-btn_quick style-image btn-scroll-quickview ${selectedColorIndex === index ? "active" : ""}`}
                        onClick={() => setSelectedColorIndex(index)}
                      >
                        <span className="img">
                          <Image
                            loading="lazy"
                            width={60}
                            height={60}
                            src={color.img}
                            alt={color.label}
                          />
                        </span>
                        <span className="tooltip">{color.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
              {hasSizes ? (
                <div className="quick-variant-picker picker_size">
                  <div className="variant-picker_label mb-12">
                    <div>
                      Size:{" "}
                      <span className="variant__value text-capitalize fw-medium">
                        {selectedSize}
                      </span>
                    </div>
                    <div data-bs-dismiss="offcanvas">
                      <a
                        href="#findSize"
                        data-bs-toggle="modal"
                        className="tf-btn-line-2 style-primary text-caption-01 fw-semibold"
                      >
                        Size Guide
                      </a>
                    </div>
                  </div>
                  <div className="variant-picker_values">
                    {product.sizes.map((size, index) => (
                      <button
                        key={`${size}-${index}`}
                        type="button"
                        className={`size_btn ${selectedSizeIndex === index ? "active" : ""}`}
                        onClick={() => setSelectedSizeIndex(index)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="tf-product-total-quantity">
                <p className="">Quantity:</p>
                <div className="group-action">
                  <div className="wg-quantity">
                    <button
                      type="button"
                      className="btn-quantity btn-decrease"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    >
                      <i className="icon icon-minus" />
                    </button>
                    <input
                      className="quantity-product"
                      type="text"
                      readOnly
                      value={quantity}
                    />
                    <button
                      type="button"
                      className="btn-quantity btn-increase"
                      onClick={() => setQuantity((q) => q + 1)}
                    >
                      <i className="icon icon-plus" />
                    </button>
                  </div>
                  <a
                    href="#shoppingCart"
                    onClick={handleAddToCart}
                    data-bs-toggle="offcanvas"
                    className="btn-action-price tf-btn type-xl animate-btn w-100"
                  >
                    {isAdded ? "Added" : "Add to Cart"}
                    <span className="d-none d-sm-block d-md-none d-lg-block">
                      &nbsp;-&nbsp;
                    </span>
                    <span className="price-add d-none d-sm-block d-md-none d-lg-block">
                      {formatPrice(product.price * quantity)}
                    </span>
                  </a>
                </div>
                <Link
                  href="/checkout"
                  className="tf-btn type-xl btn-primary animate-btn w-100"
                >
                  Buy It Now
                </Link>
              </div>
            </div>
            <div className="box-action">
              <Link
                href={`/product-detail/${product.id}`}
                className="tf-btn-line-2 style-primary fw-semibold"
              >
                View Full Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
