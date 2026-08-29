import { ProductDescriptionIntro } from "./product-description/blocks/ProductDescriptionIntro";
import { ProductHowToOrder } from "./product-description/blocks/ProductHowToOrder";
import type { ProductCardItem } from "@/types/productCard";

export default function ProductDescription2({
  product,
}: {
  product?: ProductCardItem;
}) {
  const hasHowToOrder = Boolean(
    product?.howToOrderHtml?.trim() || product?.howToOrderText?.trim(),
  );

  return (
    <section className="section-product-description flat-spacing">
      <div className="container">
        <div className="faq-descriptions" id="prdDes">
          <div className="accordion-item_v2 style-2">
            <div
              className="accordion-action h5 fw-medium"
              data-bs-target="#faq-1"
              data-bs-toggle="collapse"
              aria-expanded="true"
              aria-controls="faq-1"
              role="button"
            >
              <span>Description</span>
              <span className="icon ic-accordion-custom cl-2" />
            </div>
            <div id="faq-1" className="collapse show" data-bs-parent="#prdDes">
              <ProductDescriptionIntro
                gridClassName="accordion-content tab-content_desc tf-grid-layout md-col-2"
                product={product}
              />
            </div>
          </div>
          {hasHowToOrder ? (
            <div className="accordion-item_v2 style-2">
              <div
                className="accordion-action h5 fw-medium collapsed"
                data-bs-target="#faq-how-to-order"
                data-bs-toggle="collapse"
                aria-expanded="true"
                aria-controls="faq-how-to-order"
                role="button"
              >
                <span>How to Order</span>
                <span className="icon ic-accordion-custom cl-2" />
              </div>
              <div
                id="faq-how-to-order"
                className="collapse"
                data-bs-parent="#prdDes"
              >
                <ProductHowToOrder
                  product={product}
                  titleTag="div"
                  wrapperClassName="accordion-content tab-content_desc"
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
