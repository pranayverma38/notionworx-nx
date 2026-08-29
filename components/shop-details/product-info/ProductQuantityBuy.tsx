"use client";

import {
  buildProductConfigurationKey,
  getProductConfigurationIdentity,
  normalizeProductAddOnSelections,
} from "@/lib/product-addons";
import { useProduct } from "@/context/ProductContext";
import { useContextElement } from "@/context/Context";
import type { ProductCardItem } from "@/types/productCard";
import { formatPrice } from "@/utils/formatPrice";

import { ProductAddOnPicker } from "./ProductAddOnPicker";

export function ProductQuantityBuy({ product }: { product: ProductCardItem }) {
  const {
    quantity,
    setQuantity,
    currentColor,
    currentSize,
    addOnSelections,
    configuredUnitPrice,
  } = useProduct();
  const { addProductToCart, cartProducts, updateQuantity } = useContextElement();
  const normalizedAddOnSelections = normalizeProductAddOnSelections(addOnSelections);
  const configurationKey = buildProductConfigurationKey({
    productId: getProductConfigurationIdentity(product),
    selectedColor: currentColor || undefined,
    selectedSize: currentSize || undefined,
    addOnSelections: normalizedAddOnSelections,
  });
  const existingCartItem = cartProducts.find(
    (item) => item.configurationKey === configurationKey,
  );
  const isInCart = Boolean(existingCartItem);
  const unitPrice = configuredUnitPrice ?? product.price;

  const handleAddToCart = () => {
    if (isInCart) {
      updateQuantity(configurationKey, quantity);
      return;
    }

    addProductToCart(product, quantity, {
      selectedColor: currentColor || undefined,
      selectedSize: currentSize || undefined,
      addOnSelections: normalizedAddOnSelections,
    });
  };

  return (
    <div className="tf-product-total-quantity" style={{ display: "grid", gap: 20 }}>
      <ProductAddOnPicker />
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
            {formatPrice(unitPrice * quantity)}
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
