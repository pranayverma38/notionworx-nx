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
  const compareAtPrice =
    typeof product.priceOld === "number" && product.priceOld > configuredPrice
      ? product.priceOld
      : undefined;
  const showCompareAt = addOnSelectionSubtotal === 0 && typeof compareAtPrice === "number";

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
      {showCompareAt && compareAtPrice && (
        <>
          <div className="br-line type-vertical" />
          <p className="cl-text-3 text-decoration-line-through">
            {formatPrice(compareAtPrice)}
          </p>
          <span className="badge-sale text-white fw-semibold text-caption-02">
            -
            {Math.round(
              ((compareAtPrice - configuredPrice) / compareAtPrice) * 100,
            )}
            %
          </span>
        </>
      )}
    </div>
  );
}
