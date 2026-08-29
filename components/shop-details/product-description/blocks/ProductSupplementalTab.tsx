import type { ProductCardItem } from "@/types/productCard";
import { ProductLongFormContent } from "./ProductLongFormContent";

type ProductSupplementalTabProps = {
  product?: ProductCardItem;
  field: "dimensions" | "warranty";
  titleTag?: "h5" | "div";
  wrapperClassName?: string;
};

const TAB_COPY = {
  dimensions: {
    label: "Dimensions",
    fallbackText: "Dimension details will be added once the product specs are available.",
  },
  warranty: {
    label: "Warranty",
    fallbackText: "Warranty details will be added once the product coverage information is available.",
  },
} as const;

export function ProductSupplementalTab({
  product,
  field,
  titleTag = "h5",
  wrapperClassName = "tab-content_desc",
}: ProductSupplementalTabProps) {
  const config = TAB_COPY[field];
  const html = field === "dimensions" ? product?.dimensionsHtml : product?.warrantyHtml;
  const text = field === "dimensions" ? product?.dimensionsText : product?.warrantyText;
  const title =
    titleTag === "h5" ? (
      <h5 className="desc_title">{config.label}</h5>
    ) : (
      <div className="h6 desc_title">{config.label}</div>
    );

  return (
    <div className={`${wrapperClassName} product-detail-single-layout`}>
      <div className="box-desc product-detail-description-card product-detail-description-main">
        {title}
        <div className="desc_info">
          <ProductLongFormContent
            html={html}
            text={text}
            fallbackText={config.fallbackText}
          />
        </div>
      </div>
    </div>
  );
}
