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
          gridClassName="accordion-content tab-content_desc tf-grid-layout md-col-2"
          product={product}
        />
      );
    case "dimensions":
      return (
        <ProductSupplementalTab
          product={product}
          field="dimensions"
          titleTag="div"
          wrapperClassName="accordion-content tab-content_desc"
        />
      );
    case "warranty":
      return (
        <ProductSupplementalTab
          product={product}
          field="warranty"
          titleTag="div"
          wrapperClassName="accordion-content tab-content_desc"
        />
      );
    case "how-to-order":
      return (
        <ProductHowToOrder
          product={product}
          titleTag="div"
          wrapperClassName="accordion-content tab-content_desc"
        />
      );
    default:
      return null;
  }
}

export default function ProductDescription2({
  product,
}: {
  product?: ProductCardItem;
}) {
  const tabs = getProductDetailTabs(product);

  return (
    <section className="section-product-description flat-spacing">
      <div className="container">
        <div className="faq-descriptions" id="prdDes">
          {tabs.map((tab, index) => {
            const panelId = `faq-${tab.id}`;
            const isExpanded = index === 0;

            return (
              <div key={tab.id} className="accordion-item_v2 style-2">
                <div
                  className={`accordion-action h5 fw-medium${isExpanded ? "" : " collapsed"}`}
                  data-bs-target={`#${panelId}`}
                  data-bs-toggle="collapse"
                  aria-expanded={isExpanded}
                  aria-controls={panelId}
                  role="button"
                >
                  <span>{tab.label}</span>
                  <span className="icon ic-accordion-custom cl-2" />
                </div>
                <div
                  id={panelId}
                  className={`collapse${isExpanded ? " show" : ""}`}
                  data-bs-parent="#prdDes"
                >
                  {renderAccordionContent(tab, product)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
