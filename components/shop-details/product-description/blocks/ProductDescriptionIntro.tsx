import type { ProductCardItem } from "@/types/productCard";
import { ProductLongFormContent } from "./ProductLongFormContent";

type IntroProps = {
  gridClassName?: string;
  /** `h5` for tab / accordion-v2 layouts; `div` with `.h6` for sidebar accordion. */
  titleTag?: "h5" | "div";
  product?: ProductCardItem;
};

export function ProductDescriptionIntro({
  gridClassName = "tab-content_desc tf-grid-layout md-col-2",
  titleTag = "h5",
  product,
}: IntroProps) {
  const descriptionHtml = product?.descriptionHtml;
  const descriptionText =
    product?.descriptionText ||
    product?.description ||
    "Review the migrated catalog details for this product.";
  const detailItems = [
    product?.category ? { label: "Category", value: product.category } : null,
    product?.sku ? { label: "SKU", value: product.sku } : null,
    {
      label: "Status",
      value: product?.inStock === false ? "Out of stock" : "Available",
    },
  ].filter(Boolean) as { label: string; value: string }[];

  const secondaryTitle =
    titleTag === "h5" ? (
      <h5 className="desc_title">Key Details</h5>
    ) : (
      <div className="h6 desc_title">Key Details</div>
    );

  return (
    <div className={`${gridClassName} product-detail-description-layout`}>
      <div className="box-desc product-detail-description-card product-detail-description-main">
        <div className="desc_info">
          <ProductLongFormContent
            html={descriptionHtml}
            text={descriptionText}
            fallbackText="Review the migrated catalog details for this product."
          />
        </div>
      </div>
      <aside className="box-desc product-detail-description-card product-detail-description-side">
        {secondaryTitle}
        <ul className="product-detail-key-details">
          {detailItems.map((item) => (
            <li key={item.label} className="product-detail-key-detail">
              <span className="product-detail-key-label">{item.label}</span>
              <span className="product-detail-key-value">{item.value}</span>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
