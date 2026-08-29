"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  buildProductConfigurationKey,
  getProductConfigurationIdentity,
} from "@/lib/product-addons";
import { products, stickyBarProduct } from "@/data/products/products";
import { useContextElement } from "@/context/Context";

export default function StickyProduct() {
  const params = useParams();
  const idParam = params?.id;
  const rawId = Array.isArray(idParam) ? idParam[0] : idParam;
  const product = useMemo(() => {
    const parsed = Number(rawId);
    if (!Number.isFinite(parsed)) {
      return stickyBarProduct;
    }

    return products.find((item) => item.id === parsed) ?? stickyBarProduct;
  }, [rawId]);
  const [isVisible, setIsVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] ?? "");
  const stickyBarRef = useRef<HTMLDivElement | null>(null);
  const resolvedSelectedSize =
    product.sizes?.includes(selectedSize) && selectedSize
      ? selectedSize
      : (product.sizes?.[0] ?? "");
  const variantLabel = product.variantLabel?.trim() || "Size";
  const hasAddOnGroups = Boolean(product.addOnGroups?.length);

  const { addProductToCart, cartProducts, updateQuantity } =
    useContextElement();
  const configurationKey = buildProductConfigurationKey({
    productId: getProductConfigurationIdentity(product),
    selectedSize: resolvedSelectedSize || undefined,
  });
  const isInCart = cartProducts.some(
    (item) => item.configurationKey === configurationKey,
  );

  useEffect(() => {
    const handleScroll = () => {
      const nextVisible = window.scrollY > window.innerHeight;
      setIsVisible((current) =>
        current === nextVisible ? current : nextVisible,
      );
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const element = stickyBarRef.current;

    const updateWorxieOffset = () => {
      if (!isVisible || !element) {
        root.style.setProperty("--worxie-sticky-offset", "0px");
        return;
      }

      root.style.setProperty(
        "--worxie-sticky-offset",
        `${element.offsetHeight + 16}px`,
      );
    };

    updateWorxieOffset();

    if (!isVisible || !element) {
      return () => {
        root.style.setProperty("--worxie-sticky-offset", "0px");
      };
    }

    const resizeObserver = new ResizeObserver(updateWorxieOffset);
    resizeObserver.observe(element);
    window.addEventListener("resize", updateWorxieOffset);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateWorxieOffset);
      root.style.setProperty("--worxie-sticky-offset", "0px");
    };
  }, [isVisible]);

  const handleAddToCart = () => {
    if (hasAddOnGroups) {
      const addOnSection = document.getElementById("product-addons-form");
      const header = document.querySelector("header.tf-header");

      if (!addOnSection) {
        return;
      }

      const headerHeight =
        header instanceof HTMLElement ? header.getBoundingClientRect().height : 0;
      const targetTop =
        window.scrollY +
        addOnSection.getBoundingClientRect().top -
        headerHeight -
        20;

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: "auto",
      });
      return;
    }

    if (isInCart) {
      updateQuantity(configurationKey, quantity);
    } else {
      addProductToCart(product, quantity, {
        selectedSize: resolvedSelectedSize || undefined,
      });
    }
  };

  return (
    <div
      ref={stickyBarRef}
      className={`tf-sticky-btn-atc${isVisible ? " show" : ""}`}
    >
      <div className="container">
        <div className="tf-height-observer w-100 d-flex align-items-center">
          <div className="tf-sticky-atc-product d-flex align-items-center">
            <div className="atc-product-side">
              <div className="prd_img">
                <Image
                  loading="lazy"
                  width={60}
                  height={80}
                  src={product.img}
                  alt={product.name}
                />
              </div>
              <div className="prd_info d-none d-lg-grid">
                <p className="name__prd fw-medium lh-24">{product.name}</p>
                <p className="distribute__prd text-caption-01 cl-text-3">
                  {product.category || "General"}
                </p>
                <p className="price__prd fw-semibold">${product.price.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="tf-sticky-atc-infos">
            <form className="" onSubmit={(e) => e.preventDefault()}>
              {hasAddOnGroups ? (
                <div
                  style={{
                    display: "grid",
                    gap: 6,
                    marginBottom: 12,
                  }}
                >
                  <p className="title" style={{ margin: 0 }}>
                    This product has accessories and upgrades.
                  </p>
                  <p
                    style={{
                      margin: 0,
                      color: "#6b7280",
                      fontSize: "0.8rem",
                      lineHeight: 1.45,
                    }}
                  >
                    Scroll back to customize add-ons and quantities before
                    adding it to the cart.
                  </p>
                </div>
              ) : product.sizes?.length ? (
                <div className="tf-sticky-atc-variant-price">
                  <p className="title">{variantLabel}:</p>
                  <div className="tf-select style-2">
                    <select
                      value={resolvedSelectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                    >
                      {product.sizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : null}
              {hasAddOnGroups ? null : (
                <div className="tf-product-info-quantity">
                  <p className="title">Quantity:</p>
                  <div className="wg-quantity style-2">
                    <button
                      className="btn-quantity minus-btn"
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    >
                      <i className="icon icon-minus" />
                    </button>
                    <input
                      className="quantity-product"
                      type="text"
                      name="number"
                      value={quantity}
                      readOnly
                    />
                    <button
                      className="btn-quantity plus-btn"
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                    >
                      <i className="icon icon-plus" />
                    </button>
                  </div>
                </div>
              )}
              <button
                type="button"
                className="tf-btn animate-btn btn-add-to-cart"
                onClick={handleAddToCart}
              >
                <span className="btn-add-to-cart__label">
                  {hasAddOnGroups
                    ? "Customize options"
                    : isInCart
                      ? "Update cart"
                      : "Add to cart"}
                </span>
                <span className="btn-add-to-cart__price">
                  $
                  {(
                    product.price * (hasAddOnGroups ? 1 : quantity)
                  ).toFixed(2)}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
