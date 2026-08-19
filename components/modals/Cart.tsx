"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";

import { useContextElement, type CartProduct } from "@/context/Context";
import type { ProductId } from "@/context/store";
import { products } from "@/data/products/products";
import { formatPrice } from "@/utils/formatPrice";
import {
  MiniCartToolButtons,
  MiniCartToolPanels,
} from "@/components/modals/cart-tools/MiniCartTools";

const FREE_SHIPPING_THRESHOLD = 100;

export default function Cart({
  registerOffcanvasElement,
}: {
  registerOffcanvasElement?: (el: HTMLElement | null) => void;
}) {
  const { cartProducts, setCartProducts, updateQuantity, totalPrice } =
    useContextElement();
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [activeTool, setActiveTool] = useState<
    "note" | "shipping" | "coupon" | null
  >(null);

  const recommendations = useMemo(() => {
    const inCart = new Set(cartProducts.map((p) => p.id));
    const notInCart = products.filter((p) => !inCart.has(p.id));
    return notInCart.length > 0 ? notInCart.slice(0, 3) : products.slice(0, 3);
  }, [cartProducts]);

  const amountToFreeship = Math.max(0, FREE_SHIPPING_THRESHOLD - totalPrice);
  const shipProgressPercent = Math.min(
    100,
    FREE_SHIPPING_THRESHOLD > 0
      ? (totalPrice / FREE_SHIPPING_THRESHOLD) * 100
      : 0,
  );

  const removeLine = (id: ProductId) => {
    setCartProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const setQty = (id: ProductId, qty: number) => {
    if (qty < 1) {
      return;
    }
    updateQuantity(id, qty);
  };

  return (
    <div
      ref={registerOffcanvasElement}
      className="offcanvas offcanvas-end popup-shopping-cart"
      id="shoppingCart"
    >
      {showRecommendations ? (
        <div className="tf-minicart-recommendations file-delete">
          <div className="title d-flex justify-content-between align-items-center">
            <h5>You Might Like</h5>
            <button
              type="button"
              className="icon icon-X2 link remove fs-24 cs-pointer border-0 bg-transparent p-0"
              onClick={() => setShowRecommendations(false)}
              aria-label="Close recommendations"
            />
          </div>
          <div className="wrap-recommendations">
            <div className="list-cart">
              {recommendations.map((product) => (
                <div className="list-cart-item" key={product.id}>
                  <Link href={`/product-detail/${product.id}`} className="image">
                    <Image
                      loading="lazy"
                      width={212}
                      height={283}
                      src={product.img ?? "/assets/images/product/product-1.jpg"}
                      alt=""
                    />
                  </Link>
                  <div className="content">
                    <Link
                      className="name fw-medium link text-line-clamp-1"
                      href={`/product-detail/${product.id}`}
                    >
                      {product.name}
                    </Link>
                    <div className="price-wrap">
                      <span className="price-new text-primary fw-semibold">
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
              ))}
            </div>
          </div>
        </div>
      ) : null}
      <div className="canvas-wrapper">
        <div className="popup-header">
          <div className="d-flex align-items-center justify-content-between mb-12">
            <h5 className="title">Shopping Cart</h5>
            <span
              className="icon-X2 icon-close-popup"
              data-bs-dismiss="offcanvas"
            />
          </div>
          <div className="cart-threshold">
            <p className="text">
              {totalPrice >= FREE_SHIPPING_THRESHOLD ? (
                <>
                  You qualify for{" "}
                  <span className="text-primary fw-7">free shipping</span>
                </>
              ) : (
                <>
                  Buy
                  <span className="text-primary fw-7">
                    {" "}
                    {formatPrice(amountToFreeship)}{" "}
                  </span>
                  more to get freeship
                </>
              )}
            </p>
            <div className="tf-progress-bar tf-progress-ship">
              <div
                className="value"
                style={{ width: `${shipProgressPercent}%` }}
                data-progress={Math.round(shipProgressPercent)}
              />
            </div>
          </div>
        </div>
        <div className="wrap">
          <div
            className={`tf-mini-cart-wrap list-file-delete ${cartProducts.length === 0 ? "wrap-empty_text" : ""}`}
          >
            <div className="tf-mini-cart-main">
              <div className="tf-mini-cart-sroll">
                <div
                  className={`tf-mini-cart-items ${cartProducts.length === 0 ? "list-empty" : ""}`}
                >
                  {cartProducts.length === 0 ? (
                    <div className="box-text_empty type-shop_cart">
                      <div className="shop-empty_top">
                        <span className="icon">
                          <i className="icon-Handbag" />
                        </span>
                        <h4 className="text-emp">Your cart is empty</h4>
                        <p className="cl-text-2">
                          Your cart is currently empty. Let us assist you in
                          finding the right product
                        </p>
                      </div>
                      <div className="shop-empty_bot">
                        <Link
                          href="/shop-default"
                          className="tf-btn animate-btn"
                        >
                          Shopping
                        </Link>
                        <Link href="/" className="tf-btn btn-stroke">
                          Back to home
                        </Link>
                      </div>
                    </div>
                  ) : (
                    cartProducts.map((item, i) => (
                      <CartMiniLine
                        key={i}
                        item={item}
                        onRemove={() => removeLine(item.id)}
                        onQtyChange={(qty) => setQty(item.id, qty)}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
            <div className="tf-mini-cart-bottom box-empty_clear">
              <MiniCartToolButtons
                activeTool={activeTool}
                setActiveTool={setActiveTool}
              />
              <div className="tf-mini-cart-bottom-wrap">
                <div className="tf-mini-cart-total">
                  <h5 className="text-total d-flex align-content-center justify-content-between">
                    <span className="subtotal">Subtotal</span>
                    <span className="total-price tf-totals-total-value">
                      {formatPrice(totalPrice)}
                    </span>
                  </h5>
                </div>
                <div className="checkbox-wrap">
                  <input
                    className="tf-check style-2"
                    type="checkbox"
                    id="agree-term"
                  />
                  <label htmlFor="agree-term">
                    I agree with{" "}
                    <Link
                      href="/term-and-condition"
                      className="text-decoration-underline"
                    >
                      Terms &amp; Conditions
                    </Link>
                  </label>
                </div>
                <div className="tf-mini-cart-view-checkout">
                  <Link href="/view-cart" className="tf-btn btn-stroke">
                    View cart
                  </Link>
                  <Link href="/checkout" className="tf-btn animate-btn">
                    Check Out
                  </Link>
                </div>
                <Link
                  href="/shop-default"
                  className="d-flex justify-content-center fw-semibold text-center link"
                >
                  Or Continue Shopping
                </Link>
              </div>
            </div>
            <MiniCartToolPanels
              activeTool={activeTool}
              setActiveTool={setActiveTool}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function CartMiniLine({
  item,
  onRemove,
  onQtyChange,
}: {
  item: CartProduct;
  onRemove: () => void;
  onQtyChange: (qty: number) => void;
}) {
  const imgSrc =
    item.img ?? item.images?.[0]?.src ?? "/assets/images/product/product-1.jpg";

  const colorLabel = item.selectedColor ?? item.colors?.[0]?.label ?? null;
  const sizeLabel = item.selectedSize ?? null;

  return (
    <div className="tf-mini-cart-item file-delete">
      <div className="tf-mini-cart-image">
        <Image loading="lazy" width={100} height={133} src={imgSrc} alt="" />
      </div>
      <div className="tf-mini-cart-info">
        <Link
          href={`/product-detail/${item.id}`}
          className="name fw-medium link text-line-clamp-1"
        >
          {item.name}
        </Link>
        {colorLabel ? (
          <div className="tf-prd-select select-color text-caption-01 mb-4">
            <span className="type-text cl-text-3"> Color:&nbsp; </span>
            <span className="fw-medium">{colorLabel}</span>
          </div>
        ) : null}
        {sizeLabel ? (
          <div className="tf-prd-select text-caption-01">
            <span className="type-text cl-text-3"> Size:&nbsp; </span>
            <span className="fw-medium">{sizeLabel}</span>
          </div>
        ) : null}
      </div>
      <div className="tf-mini-cart-price">
        <button
          type="button"
          className="tf-btn-line-3 type-primary remove cs-pointer border-0 bg-transparent p-0"
          onClick={onRemove}
        >
          <span className="text-caption-01 fw-semibold">Remove</span>
        </button>
        <div className="fw-semibold d-flex flex-column gap-8 align-items-end">
          <div className="wg-quantity justify-content-end">
            <button
              type="button"
              className="btn-quantity minus-quantity"
              onClick={() => onQtyChange(item.quantity - 1)}
              aria-label="Decrease quantity"
            >
              <i className="icon icon-minus" />
            </button>
            <span className="quantity-product d-flex align-items-center justify-content-center border-0">
              {item.quantity}
            </span>
            <button
              type="button"
              className="btn-quantity plus-quantity"
              onClick={() => onQtyChange(item.quantity + 1)}
              aria-label="Increase quantity"
            >
              <i className="icon icon-plus" />
            </button>
          </div>
          <div className="d-flex align-items-center justify-content-end gap-4">
            <span className="number">{item.quantity}</span>
            <span>x</span>
            <span className="price tf-mini-card-price">
              {formatPrice(item.price)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
