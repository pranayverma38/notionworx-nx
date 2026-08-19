import { ProductCustomerReviews } from "./product-description/blocks/ProductCustomerReviews";
import { ProductDescriptionIntro } from "./product-description/blocks/ProductDescriptionIntro";
import { ProductReturnPolicies } from "./product-description/blocks/ProductReturnPolicies";
import { ProductShippingReturns } from "./product-description/blocks/ProductShippingReturns";

export default function ProductAccordions() {
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
            />
          </div>
        </div>
      </div>
      <div className="prd-desc-accordion">
        <div
          className="accordion-action h5 collapsed"
          data-bs-target="#review"
          data-bs-toggle="collapse"
          aria-expanded="false"
          aria-controls="review"
          role="button"
        >
          <span>Customer Reviews</span>
          <span className="icon icon-CaretDown ic-ar fs-28" />
        </div>
        <div id="review" className="collapse" data-bs-parent="#prd-accordion">
          <div className="accordion-content tab-review">
            <ProductCustomerReviews
              sectionClassName="product-desc_review"
              ratingBoxClassName="mb-0"
              actions={{ variant: "link" }}
              authorNameElement="div"
              commentsRootClassName="box-comment"
              form={{
                fieldIds: {
                  review: "review-rating",
                  email: "email-rating",
                  name: "name-rating",
                  message: "message-rating",
                  save: "save",
                },
                formGridClassName: "tf-grid-layout xl-col-2",
                onSubmit: (e) => e.preventDefault(),
                writeBoxClassName: "box-write-comment",
              }}
            />
          </div>
        </div>
      </div>
      <div className="prd-desc-accordion">
        <div
          className="accordion-action h5 collapsed"
          data-bs-target="#shipping"
          data-bs-toggle="collapse"
          aria-expanded="false"
          aria-controls="shipping"
          role="button"
        >
          <span>Shipping &amp; Returns</span>
          <span className="icon icon-CaretDown ic-ar fs-28" />
        </div>
        <div id="shipping" className="collapse" data-bs-parent="#prd-accordion">
          <div className="accordion-content tab-shipping">
            <ProductShippingReturns
              gridClassName="tab-content_desc desc-2 tf-grid-layout gap-20"
              titleTag="div"
            />
          </div>
        </div>
      </div>
      <div className="prd-desc-accordion">
        <div
          className="accordion-action h5 collapsed"
          data-bs-target="#return"
          data-bs-toggle="collapse"
          aria-expanded="false"
          aria-controls="return"
          role="button"
        >
          <span>Return Policies</span>
          <span className="icon icon-CaretDown ic-ar fs-28" />
        </div>
        <div id="return" className="collapse" data-bs-parent="#prd-accordion">
          <div className="accordion-content tab-return">
            <ProductReturnPolicies
              wrapperClassName="tab-content_desc tf-grid-layout gap-20"
              titleTag="div"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
