import { ProductCardItem } from "@/types/productCard";

export function ProductTitle({ product }: { product: ProductCardItem }) {
  return (
    <>
      <p className="product-infor-cate text-caption-01 mb-4">Clothing</p>

      <h3 className="product-infor-name mb-12 text-capitalize">
        {product.name}
      </h3>
      <div className="product-infor-meta mb-20">
        <div className="meta_rate">
          <div className="star-wrap normal d-flex align-items-center">
            <i className="icon icon-Star" />
            <i className="icon icon-Star" />
            <i className="icon icon-Star" />
            <i className="icon icon-Star" />
            <i className="icon icon-Star" />
          </div>
          <span className="text-caption-01 cl-text-2">(134 reviews)</span>
        </div>
        <div className="br-line type-vertical" />
        <div className="meta_sold">
          <i className="icon icon-Lightning text-primary" />
          <span className="text-caption-01 cl-text-2">
            18&nbsp;sold in last&nbsp;32&nbsp;hours
          </span>
        </div>
        <div className="br-line type-vertical" />
        <div className="meta_prd_code text-caption-01">
          <span className="cl-text-2">SKU:</span>
          <span>{"53453412"}</span>
        </div>
      </div>
    </>
  );
}
