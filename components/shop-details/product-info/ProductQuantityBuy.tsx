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
      <p className="purchase-label">Quantity</p>
      <div className="purchase-actions-row">
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
        <button
          type="button"
          className="btn-action-price tf-btn btn-stroke animate-btn w-100"
          onClick={handleAddToCart}
        >
          <span className="btn-action-price__label">
            {isInCart ? "Update cart" : "Add to cart"}
          </span>
          <span className="btn-action-price__value">
            ${(product.price * quantity).toFixed(2)}
          </span>
        </button>
        <a
          href="/checkout"
          className="tf-btn animate-btn w-100 btn-buy-now"
        >
          Buy it now
        </a>
      </div>
    </div>
  );
}
