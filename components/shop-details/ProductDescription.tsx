import { ProductDescriptionIntro } from "./product-description/blocks/ProductDescriptionIntro";
import { ProductHowToOrder } from "./product-description/blocks/ProductHowToOrder";
import type { ProductCardItem } from "@/types/productCard";

export default function ProductDescription({
  product,
}: {
  product?: ProductCardItem;
}) {
  const hasHowToOrder = Boolean(
    product?.howToOrderHtml?.trim() || product?.howToOrderText?.trim(),
  );

  return (
    <section className="section-product-description flat-spacing flat-animate-tab">
      <div className="container">
        <ul className="tab-btn-wrap-v1" role="tablist">
          <li className="nav-tab-item" role="presentation">
            <a
              href="#description"
              data-bs-toggle="tab"
              className="tf-btn-tab active"
              role="tab"
            >
              <span className="h5 fw-medium">Description</span>
            </a>
          </li>
          {hasHowToOrder ? (
            <li className="nav-tab-item" role="presentation">
              <a href="#how-to-order" data-bs-toggle="tab" className="tf-btn-tab" role="tab">
                <span className="h5 fw-medium">How to Order</span>
              </a>
            </li>
          ) : null}
        </ul>
        <div className="tab-content">
          <div
            className="tab-pane active show"
            id="description"
            role="tabpanel"
          >
            <ProductDescriptionIntro product={product} />
          </div>
          {hasHowToOrder ? (
            <div className="tab-pane" id="how-to-order" role="tabpanel">
              <ProductHowToOrder product={product} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
