"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
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
  const resolvedSelectedSize =
    product.sizes?.includes(selectedSize) && selectedSize
      ? selectedSize
      : (product.sizes?.[0] ?? "");

  const { addProductToCart, isAddedToCartProducts, updateQuantity } =
    useContextElement();

  const isInCart = isAddedToCartProducts(product.id);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > window.innerHeight);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddToCart = () => {
    if (isInCart) {
      updateQuantity(product.id, quantity);
    } else {
      addProductToCart(product, quantity);
    }
  };

  return (
    <div className={`tf-sticky-btn-atc${isVisible ? " show" : ""}`}>
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
              {product.sizes?.length ? (
                <div className="tf-sticky-atc-variant-price">
                  <p className="title">Size:</p>
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
              <a
                href="#shoppingCart"
                data-bs-toggle="offcanvas"
                className="tf-btn animate-btn btn-add-to-cart"
                suppressHydrationWarning
                onClick={handleAddToCart}
              >
                {isInCart ? "Update Cart" : "Add To Cart"} - $
                {(product.price * quantity).toFixed(2)}
              </a>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
