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
  const detailLines = [
    product?.category ? `Category: ${product.category}` : null,
    product?.sku ? `SKU: ${product.sku}` : null,
    product?.inStock === false ? "Status: Out of stock" : "Status: Available",
  ].filter(Boolean) as string[];

  const secondaryTitle =
    titleTag === "h5" ? (
      <h5 className="desc_title">Key Details</h5>
    ) : (
      <div className="h6 desc_title">Key Details</div>
    );

  return (
    <div className={gridClassName}>
      <div className="box-desc">
        <div className="desc_info">
          <ProductLongFormContent
            html={descriptionHtml}
            text={descriptionText}
            fallbackText="Review the migrated catalog details for this product."
          />
        </div>
      </div>
      <div className="box-desc">
        {secondaryTitle}
        <ul className="list">
          {detailLines.map((line) => (
            <li key={line} className="cl-text-2">
              - {line}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
