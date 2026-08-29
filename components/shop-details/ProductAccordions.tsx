import { ProductDescriptionIntro } from "./product-description/blocks/ProductDescriptionIntro";
import { ProductHowToOrder } from "./product-description/blocks/ProductHowToOrder";
import type { ProductCardItem } from "@/types/productCard";

export default function ProductAccordions({
  product,
}: {
  product?: ProductCardItem;
}) {
  const hasHowToOrder = Boolean(
    product?.howToOrderHtml?.trim() || product?.howToOrderText?.trim(),
  );

  return (
    <div className="tf-product-desc-accrodion" id="prd-accordion">
      <div className="prd-desc-accordion">
        <div
          className="accordion-action h5"
          data-bs-target="#Description"
          data-bs-toggle="collapse"
          aria-expanded="true"
          aria-controls="Description"
          role="button"
        >
          <span>Description</span>
          <span className="icon icon-CaretDown ic-ar fs-28" />
        </div>
        <div
          id="Description"
          className="collapse show"
          data-bs-parent="#prd-accordion"
        >
          <div className="accordion-content tab-descriptions">
            <ProductDescriptionIntro
              gridClassName="tab-content_desc tf-grid-layout gap-20"
              titleTag="div"
              product={product}
            />
          </div>
        </div>
      </div>
      {hasHowToOrder ? (
        <div className="prd-desc-accordion">
          <div
            className="accordion-action h5 collapsed"
            data-bs-target="#how-to-order"
            data-bs-toggle="collapse"
            aria-expanded="false"
            aria-controls="how-to-order"
            role="button"
          >
            <span>How to Order</span>
            <span className="icon icon-CaretDown ic-ar fs-28" />
          </div>
          <div
            id="how-to-order"
            className="collapse"
            data-bs-parent="#prd-accordion"
          >
            <div className="accordion-content tab-descriptions">
              <ProductHowToOrder
                product={product}
                titleTag="div"
                wrapperClassName="tab-content_desc"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
