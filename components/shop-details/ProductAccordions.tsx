import { ProductDescriptionIntro } from "./product-description/blocks/ProductDescriptionIntro";
import { ProductHowToOrder } from "./product-description/blocks/ProductHowToOrder";
import { ProductSupplementalTab } from "./product-description/blocks/ProductSupplementalTab";
import {
  getProductDetailTabs,
  type ProductDetailTab,
} from "./product-description/productDetailTabs";
import type { ProductCardItem } from "@/types/productCard";

function renderAccordionContent(tab: ProductDetailTab, product?: ProductCardItem) {
  switch (tab.key) {
    case "description":
      return (
        <ProductDescriptionIntro
          gridClassName="tab-content_desc tf-grid-layout gap-20"
          titleTag="div"
          product={product}
        />
      );
    case "dimensions":
      return (
        <ProductSupplementalTab
          product={product}
          field="dimensions"
          titleTag="div"
          wrapperClassName="tab-content_desc"
        />
      );
    case "warranty":
      return (
        <ProductSupplementalTab
          product={product}
          field="warranty"
          titleTag="div"
          wrapperClassName="tab-content_desc"
        />
      );
    case "how-to-order":
      return (
        <ProductHowToOrder
          product={product}
          titleTag="div"
          wrapperClassName="tab-content_desc"
        />
      );
    default:
      return null;
  }
}

export default function ProductAccordions({
  product,
}: {
  product?: ProductCardItem;
}) {
  const tabs = getProductDetailTabs(product);

  return (
    <div className="tf-product-desc-accrodion" id="prd-accordion">
      {tabs.map((tab, index) => {
        const panelId = `prd-accordion-${tab.id}`;
        const isExpanded = index === 0;

        return (
          <div key={tab.id} className="prd-desc-accordion">
            <div
              className={`accordion-action h5${isExpanded ? "" : " collapsed"}`}
              data-bs-target={`#${panelId}`}
              data-bs-toggle="collapse"
              aria-expanded={isExpanded}
              aria-controls={panelId}
              role="button"
            >
              <span>{tab.label}</span>
              <span className="icon icon-CaretDown ic-ar fs-28" />
            </div>
            <div
              id={panelId}
              className={`collapse${isExpanded ? " show" : ""}`}
              data-bs-parent="#prd-accordion"
            >
              <div className="accordion-content tab-descriptions">
                {renderAccordionContent(tab, product)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
