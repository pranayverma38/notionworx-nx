import { ProductCardItem } from "@/types/productCard";

export function ProductTitle({ product }: { product: ProductCardItem }) {
  return (
    <>
      <p className="product-infor-cate text-caption-01 mb-4">
        {product.category ?? "Catalog Product"}
      </p>

      <h3 className="product-infor-name mb-12 text-capitalize">
        {product.name}
      </h3>
      <div className="product-infor-meta mb-20">
        {product.sku ? (
          <>
            <div className="meta_prd_code text-caption-01">
              <span className="cl-text-2">SKU:</span>
              <span>{product.sku}</span>
            </div>
            <div className="br-line type-vertical" />
          </>
        ) : null}
        <div className="meta_prd_code text-caption-01">
          <span className="cl-text-2">Status:</span>
          <span>{product.inStock === false ? "Out of stock" : "Available"}</span>
        </div>
      </div>
    </>
  );
}
