"use client";

import { useProduct } from "@/context/ProductContext";
import { useContextElement } from "@/context/Context";
import { ProductCardItem } from "@/types/productCard";

export function ProductQuantityBuy({ product }: { product: ProductCardItem }) {
  const { quantity, setQuantity, currentColor, currentSize } = useProduct();
  const { addProductToCart, isAddedToCartProducts, updateQuantity } =
    useContextElement();
  const isInCart = isAddedToCartProducts(product.id);

  const handleAddToCart = () => {
    if (isInCart) {
      updateQuantity(product.id, quantity);
      return;
    }
    const productWithSelection = {
      ...product,
      selectedColor: currentColor || undefined,
      selectedSize: currentSize || undefined,
    };
    addProductToCart(productWithSelection, quantity);
  };

  return (
    <div className="tf-product-total-quantity">
      <p className="">Quantity:</p>
      <div className="group-action">
        <div className="wg-quantity">
          <button
            type="button"
            className="btn-quantity btn-decrease"
            disabled={quantity <= 1}
            onClick={(e) => {
              e.preventDefault();
              setQuantity(Math.max(1, quantity - 1));
            }}
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
            type="button"
            className="btn-quantity btn-increase"
            onClick={(e) => {
              e.preventDefault();
              setQuantity(quantity + 1);
            }}
          >
            <i className="icon icon-plus" />
          </button>
        </div>
        <a
          href="#shoppingCart"
          data-bs-toggle="offcanvas"
          suppressHydrationWarning
          className="btn-action-price tf-btn type-xl animate-btn w-100"
          onClick={handleAddToCart}
        >
          {isInCart ? "Update Cart" : "Add To Cart"}
          <span className="d-none d-sm-block d-md-none d-lg-block">
            &nbsp;-&nbsp;
          </span>
          <span className="price-add d-none d-sm-block d-md-none d-lg-block">
            ${(product.price * quantity).toFixed(2)}
          </span>
        </a>
      </div>
      <a
        href="/checkout"
        className="tf-btn type-xl btn-primary animate-btn w-100"
      >
        Buy It Now
      </a>
    </div>
  );
}
