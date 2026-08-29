import { useProductOptional } from "@/context/ProductContext";
import type { ProductCardItem } from "@/types/productCard";
import { formatPrice } from "@/utils/formatPrice";

export function ProductPrice({ product }: { product: ProductCardItem }) {
  const productContext = useProductOptional();
  const configuredPrice =
    typeof productContext?.configuredUnitPrice === "number"
      ? productContext.configuredUnitPrice
      : product.price;
  const addOnSelectionSubtotal = productContext?.addOnSelectionSubtotal ?? 0;
  const showCompareAt = addOnSelectionSubtotal === 0 && Boolean(product.priceOld);

  return (
    <div className="product-infor-price mb-12" style={{ flexWrap: "wrap" }}>
      <div style={{ display: "grid", gap: 4 }}>
        <h4 className="price-on-sale mb-0">{formatPrice(configuredPrice)}</h4>
        {addOnSelectionSubtotal > 0 ? (
          <span style={{ color: "#6b7280", fontSize: "0.8rem" }}>
            Includes {formatPrice(addOnSelectionSubtotal)} in selected add-ons
          </span>
        ) : null}
      </div>
      {showCompareAt && product.priceOld && (
        <>
          <div className="br-line type-vertical" />
          <p className="cl-text-3 text-decoration-line-through">
            {formatPrice(product.priceOld)}
          </p>
          <span className="badge-sale text-white fw-semibold text-caption-02">
            -
            {Math.round(
              ((product.priceOld - product.price) / product.priceOld) * 100,
            )}
            %
          </span>
        </>
      )}
    </div>
  );
}
