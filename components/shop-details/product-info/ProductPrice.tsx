import { ProductCardItem } from "@/types/productCard";

export function ProductPrice({ product }: { product: ProductCardItem }) {
  return (
    <div className="product-infor-price mb-12">
      <h4 className="price-on-sale">${product.price}</h4>
      {product.priceOld && (
        <>
          <div className="br-line type-vertical" />
          <p className="cl-text-3 text-decoration-line-through">
            ${product.priceOld}
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
