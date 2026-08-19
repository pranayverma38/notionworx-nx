import { ProductCustomerReviews } from "./product-description/blocks/ProductCustomerReviews";
import { ProductDescriptionIntro } from "./product-description/blocks/ProductDescriptionIntro";
import { ProductReturnPolicies } from "./product-description/blocks/ProductReturnPolicies";
import { ProductShippingReturns } from "./product-description/blocks/ProductShippingReturns";

export default function ProductDescription() {
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
          <li className="nav-tab-item" role="presentation">
            <a
              href="#customer-reviews"
              data-bs-toggle="tab"
              className="tf-btn-tab"
              role="tab"
            >
              <span className="h5 fw-medium">Customer Reviews</span>
            </a>
          </li>
          <li className="nav-tab-item" role="presentation">
            <a
              href="#shipping-returns"
              data-bs-toggle="tab"
              className="tf-btn-tab"
              role="tab"
            >
              <span className="h5 fw-medium">Shipping &amp; Returns</span>
            </a>
          </li>
          <li className="nav-tab-item" role="presentation">
            <a
              href="#return-policies"
              data-bs-toggle="tab"
              className="tf-btn-tab"
              role="tab"
            >
              <span className="h5 fw-medium">Return Policies</span>
            </a>
          </li>
        </ul>
        <div className="tab-content">
          <div
            className="tab-pane active show"
            id="description"
            role="tabpanel"
          >
            <ProductDescriptionIntro />
          </div>
          <div className="tab-pane" id="customer-reviews" role="tabpanel">
            <ProductCustomerReviews
              sectionClassName="product-desc_review write-cancel-review-wrap"
              ratingBoxClassName="mb-0"
              actions={{ variant: "buttons" }}
              authorNameElement="p"
              form={{
                formGridClassName: "tf-grid-layout md-col-2",
              }}
            />
          </div>
          <div className="tab-pane" id="shipping-returns" role="tabpanel">
            <ProductShippingReturns />
          </div>
          <div className="tab-pane" id="return-policies" role="tabpanel">
            <ProductReturnPolicies />
          </div>
        </div>
      </div>
    </section>
  );
}
