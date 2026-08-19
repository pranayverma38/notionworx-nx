import { ProductCustomerReviews } from "./product-description/blocks/ProductCustomerReviews";
import { ProductDescriptionIntro } from "./product-description/blocks/ProductDescriptionIntro";
import { ProductReturnPolicies } from "./product-description/blocks/ProductReturnPolicies";
import { ProductShippingReturns } from "./product-description/blocks/ProductShippingReturns";

export default function ProductDescription2() {
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
              <span>Introduction</span>
              <span className="icon ic-accordion-custom cl-2" />
            </div>
            <div id="faq-1" className="collapse show" data-bs-parent="#prdDes">
              <ProductDescriptionIntro gridClassName="accordion-content tab-content_desc tf-grid-layout md-col-2" />
            </div>
          </div>
          <div className="accordion-item_v2 style-2">
            <div
              className="accordion-action h5 fw-medium collapsed"
              data-bs-target="#faq-2"
              data-bs-toggle="collapse"
              aria-expanded="true"
              aria-controls="faq-2"
              role="button"
            >
              <span>Customer Reviews</span>
              <span className="icon ic-accordion-custom cl-2" />
            </div>
            <div id="faq-2" className="collapse" data-bs-parent="#prdDes">
              <ProductCustomerReviews
                sectionClassName="accordion-content product-desc_review write-cancel-review-wrap"
                actions={{ variant: "buttons" }}
                authorNameElement="h6"
                form={{
                  formGridClassName: "tf-grid-layout md-col-2",
                }}
              />
            </div>
          </div>
          <div className="accordion-item_v2 style-2">
            <div
              className="accordion-action h5 fw-medium collapsed"
              data-bs-target="#faq-3"
              data-bs-toggle="collapse"
              aria-expanded="true"
              aria-controls="faq-3"
              role="button"
            >
              <span>Shipping &amp; Returns</span>
              <span className="icon ic-accordion-custom cl-2" />
            </div>
            <div id="faq-3" className="collapse" data-bs-parent="#prdDes">
              <ProductShippingReturns gridClassName="accordion-content tab-content_desc desc-2 tf-grid-layout sm-col-2 xl-col-4" />
            </div>
          </div>
          <div className="accordion-item_v2 style-2">
            <div
              className="accordion-action h5 fw-medium collapsed"
              data-bs-target="#faq-4"
              data-bs-toggle="collapse"
              aria-expanded="true"
              aria-controls="faq-4"
              role="button"
            >
              <span>Return Policies</span>
              <span className="icon ic-accordion-custom cl-2" />
            </div>
            <div id="faq-4" className="collapse" data-bs-parent="#prdDes">
              <ProductReturnPolicies wrapperClassName="accordion-content tab-content_desc desc-3 d-grid" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
