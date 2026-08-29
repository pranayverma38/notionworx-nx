import { ProductDescriptionIntro } from "./product-description/blocks/ProductDescriptionIntro";
import { ProductHowToOrder } from "./product-description/blocks/ProductHowToOrder";
import { ProductSupplementalTab } from "./product-description/blocks/ProductSupplementalTab";
import {
  getProductDetailTabs,
  type ProductDetailTab,
} from "./product-description/productDetailTabs";
import type { ProductCardItem } from "@/types/productCard";

function renderTabContent(tab: ProductDetailTab, product?: ProductCardItem) {
  switch (tab.key) {
    case "description":
      return <ProductDescriptionIntro product={product} />;
    case "dimensions":
      return <ProductSupplementalTab product={product} field="dimensions" />;
    case "warranty":
      return <ProductSupplementalTab product={product} field="warranty" />;
    case "how-to-order":
      return <ProductHowToOrder product={product} />;
    default:
      return null;
  }
}

export default function ProductDescription({
  product,
}: {
  product?: ProductCardItem;
}) {
  const tabs = getProductDetailTabs(product);

  return (
    <section className="section-product-description product-detail-tabs-section flat-spacing flat-animate-tab">
      <div className="container">
        <div className="product-detail-tabs-shell">
          <ul className="tab-btn-wrap-v1 product-detail-tabs-nav" role="tablist">
            {tabs.map((tab, index) => (
              <li key={tab.id} className="nav-tab-item" role="presentation">
                <a
                  href={`#${tab.id}`}
                  data-bs-toggle="tab"
                  className={`tf-btn-tab${index === 0 ? " active" : ""}`}
                  role="tab"
                >
                  <span className="h5 fw-medium">{tab.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="tab-content product-detail-tabs-content">
            {tabs.map((tab, index) => (
              <div
                key={tab.id}
                className={`tab-pane${index === 0 ? " active show" : ""}`}
                id={tab.id}
                role="tabpanel"
              >
                {renderTabContent(tab, product)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
