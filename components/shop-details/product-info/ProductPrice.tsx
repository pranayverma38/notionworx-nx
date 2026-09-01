import { useProductOptional } from "@/context/ProductContext";
import { resolveConfiguredCompareAtPrice } from "@/lib/product-variants";
import type { ProductCardItem } from "@/types/productCard";
import { formatPrice } from "@/utils/formatPrice";

export function ProductPrice({ product }: { product: ProductCardItem }) {
  const productContext = useProductOptional();
  const configuredPrice =
    typeof productContext?.configuredUnitPrice === "number"
      ? productContext.configuredUnitPrice
      : product.price;
  const addOnSelectionSubtotal = productContext?.addOnSelectionSubtotal ?? 0;
  const compareAtPrice = resolveConfiguredCompareAtPrice(
    product.priceOld,
    product.sizeVariants,
    productContext?.currentSize,
  );
  const effectiveCompareAtPrice =
    typeof compareAtPrice === "number" && compareAtPrice > configuredPrice
      ? compareAtPrice
      : undefined;
  const showCompareAt =
    addOnSelectionSubtotal === 0 && typeof effectiveCompareAtPrice === "number";

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
      {showCompareAt && effectiveCompareAtPrice && (
        <>
          <div className="br-line type-vertical" />
          <p className="cl-text-3 text-decoration-line-through">
            {formatPrice(effectiveCompareAtPrice)}
          </p>
          <span className="badge-sale text-white fw-semibold text-caption-02">
            -
            {Math.round(
              ((effectiveCompareAtPrice - configuredPrice) /
                effectiveCompareAtPrice) *
                100,
            )}
            %
          </span>
        </>
      )}
    </div>
  );
}
