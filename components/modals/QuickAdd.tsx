"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";

import { useContextElement } from "@/context/Context";
import { products } from "@/data/products/products";
import { formatPrice } from "@/utils/formatPrice";

export default function QuickAdd({
  registerModalElement,
}: {
  registerModalElement?: (el: HTMLElement | null) => void;
}) {
  const { quickAddItem, addProductToCart, isAddedToCartProducts } =
    useContextElement();

  const product = useMemo(
    () =>
      products.find((item) => item.id === Number(quickAddItem)) ?? products[0],
    [quickAddItem],
  );

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const hasSizes = Boolean(product.sizes?.length);
  const sizeOptions = product.sizes ?? [];
  const selectedColor = product.colors?.[selectedColorIndex];
  const selectedSize = sizeOptions[selectedSizeIndex] ?? null;
  const previewImage =
    selectedColor?.img ??
    product.img ??
    product.images?.[0]?.src ??
    "/assets/images/product/product-1.jpg";

  const handleAddToCart = () => {
    if (isAddedToCartProducts(product.id)) return;
    addProductToCart(product, quantity);
  };

  return (
    <div
      ref={registerModalElement}
      className="modal modalCentered fade modal-quickadd"
      id="quickAdd"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="d-flex align-items-center justify-content-between mb-20">
            <h5>Quick Add</h5>
            <span className="d-flex cs-pointer link" data-bs-dismiss="modal">
              <i className="icon icon-X2 fs-24" />
            </span>
          </div>
          <div className="tf-product-quick_add tf-quick-prd_variant">
            <div className="product-mini-view">
              <Link
                href={`/product-detail/${product.id}`}
                className="prd-image"
              >
                <Image
                  className="img-product"
                  width={80}
                  height={107}
                  src={previewImage}
                  alt={product.name}
                />
              </Link>
              <div className="prd-content">
                <Link
                  href={`/product-detail/${product.id}`}
                  className="prd-name fw-medium link-underline link text-capitalize"
                >
                  {product.name}
                </Link>
                <div className="price-wrap">
                  <span className="price-new text-primary fw-semibold price-on-sale">
                    {formatPrice(product.price)}
                  </span>
                  {product.priceOld != null ? (
                    <span className="price-old text-caption-01 cl-text-3">
                      {formatPrice(product.priceOld)}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="quick-variant-picker picker_color">
              <div className="variant-picker_label mb-12">
                <div>
                  Colors:{" "}
                  <span className="variant__value text-capitalize fw-medium">
                    {selectedColor?.label ?? "N/A"}
                  </span>
                </div>
              </div>
              <div className="variant-picker_values">
                {product.colors?.length ? (
                  product.colors.map((color, index) => (
                    <button
                      key={`${color.label}-${index}`}
                      type="button"
                      className={`hover-tooltip tooltip-bot color_btn style-image ${selectedColorIndex === index ? "active" : ""}`}
                      onClick={() => setSelectedColorIndex(index)}
                    >
                      <div className="img">
                        <Image
                          loading="lazy"
                          width={60}
                          height={60}
                          src={color.img}
                          alt={color.label}
                        />
                      </div>
                      <span className="tooltip color__label">
                        {color.label}
                      </span>
                    </button>
                  ))
                ) : (
                  <span className="text-caption-01 cl-text-2">
                    No color options
                  </span>
                )}
              </div>
            </div>
            <div className="quick-variant-picker picker_size">
              <div className="variant-picker_label mb-12">
                <div>
                  Size:{" "}
                  <span className="variant__value text-capitalize fw-medium">
                    {selectedSize ?? "N/A"}
                  </span>
                </div>
                {hasSizes ? (
                  <a
                    href="#findSize"
                    data-bs-toggle="modal"
                    className="tf-btn-line-2 style-primary text-caption-01 fw-semibold"
                  >
                    Size Guide
                  </a>
                ) : null}
              </div>
              <div className="variant-picker_values">
                {hasSizes ? (
                  sizeOptions.map((size, index) => (
                    <button
                      key={`${size}-${index}`}
                      type="button"
                      className={`size_btn ${selectedSizeIndex === index ? "active" : ""}`}
                      onClick={() => setSelectedSizeIndex(index)}
                    >
                      {size}
                    </button>
                  ))
                ) : (
                  <span className="text-caption-01 cl-text-2">
                    No size available
                  </span>
                )}
              </div>
            </div>
            <div className="product-total-quantity">
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
                    name="number"
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
                  {isAddedToCartProducts(product.id) ? "Added" : "Add to Cart"}
                  <span className="d-none d-sm-block d-md-none d-lg-block">
                    &nbsp;-&nbsp;
                  </span>
                  <span className="price-add d-none d-sm-block d-md-none d-lg-block">
                    {formatPrice(product.price * quantity)}
                  </span>
                </a>
              </div>
              <Link
                href={`/checkout`}
                className="tf-btn type-xl btn-primary animate-btn w-100"
              >
                Buy It Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
