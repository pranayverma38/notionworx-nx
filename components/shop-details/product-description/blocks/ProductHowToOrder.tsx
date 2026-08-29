import type { ProductCardItem } from "@/types/productCard";
import { ProductLongFormContent } from "./ProductLongFormContent";

type ProductHowToOrderProps = {
  product?: ProductCardItem;
  titleTag?: "h5" | "div";
  wrapperClassName?: string;
};

export function ProductHowToOrder({
  product,
  titleTag = "h5",
  wrapperClassName = "tab-content_desc",
}: ProductHowToOrderProps) {
  const title =
    titleTag === "h5" ? (
      <h5 className="desc_title">How to Order</h5>
    ) : (
      <div className="h6 desc_title">How to Order</div>
    );

  return (
    <div className={wrapperClassName}>
      <div className="box-desc">
        {title}
        <div className="desc_info">
          <ProductLongFormContent
            html={product?.howToOrderHtml}
            text={product?.howToOrderText}
            fallbackText="Ordering instructions will be added once the crawl content is available."
          />
        </div>
      </div>
    </div>
  );
}
