import Link from "next/link";
function Faq() {
  return (
    <>
      <section className="themesFlat">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="sect-heading type-3 wow fadeInUp">
                <h1 className="s-title font-red_hat fw-semibold letter-space-0">
                  Have A Question? <br />
                  We Are Here To Help.
                </h1>
                <p className="s-desc text-body-1 cl-text-2">
                  Check out the most common questions our customers asked.{" "}
                  <br />
                  StiII have questions?
                </p>
                <Link href={`/shop-default`} className="tf-btn animate-btn">
                  Shop Now
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="d-grid gap-16" id="faq-accordion">
                <div className="faq-accordion_item">
                  <div
                    className="accordion-action h5 text-capitalize letter-space-05"
                    data-bs-target="#faq-1"
                    data-bs-toggle="collapse"
                    aria-expanded="true"
                    aria-controls="faq-1"
                    role="button"
                  >
                    <span>Q1: What types of insurance do you offer?</span>
                    <span className="icon ic-accordion-custom cl-2" />
                  </div>
                  <div
                    id="faq-1"
                    className="collapse show"
                    data-bs-parent="#faq-accordion"
                  >
                    <p className="faq-content font-plus_jakarta text-body-1 cl-text-2">
                      Simply fill out our online form or contact us directly —
                      we’ll send you a personalized quote within 24 hours.
                    </p>
                  </div>
                </div>
                <div className="faq-accordion_item">
                  <div
                    className="accordion-action h5 text-capitalize letter-space-05 collapsed"
                    data-bs-target="#faq-2"
                    data-bs-toggle="collapse"
                    aria-expanded="true"
                    aria-controls="faq-2"
                    role="button"
                  >
                    <span>Q2: How do I get a quote?</span>
                    <span className="icon ic-accordion-custom cl-2" />
                  </div>
                  <div
                    id="faq-2"
                    className="collapse"
                    data-bs-parent="#faq-accordion"
                  >
                    <p className="faq-content font-plus_jakarta text-body-1 cl-text-2">
                      Simply fill out our online form or contact us directly —
                      we’ll send you a personalized quote within 24 hours.
                    </p>
                  </div>
                </div>
                <div className="faq-accordion_item">
                  <div
                    className="accordion-action h5 text-capitalize letter-space-05 collapsed"
                    data-bs-target="#faq-3"
                    data-bs-toggle="collapse"
                    aria-expanded="true"
                    aria-controls="faq-3"
                    role="button"
                  >
                    <span>
                      Q3: Is there a free consultation before I buy a plan?
                    </span>
                    <span className="icon ic-accordion-custom cl-2" />
                  </div>
                  <div
                    id="faq-3"
                    className="collapse"
                    data-bs-parent="#faq-accordion"
                  >
                    <p className="faq-content font-plus_jakarta text-body-1 cl-text-2">
                      Simply fill out our online form or contact us directly —
                      we’ll send you a personalized quote within 24 hours.
                    </p>
                  </div>
                </div>
                <div className="faq-accordion_item">
                  <div
                    className="accordion-action h5 text-capitalize letter-space-05 collapsed"
                    data-bs-target="#faq-4"
                    data-bs-toggle="collapse"
                    aria-expanded="true"
                    aria-controls="faq-4"
                    role="button"
                  >
                    <span>Q4: Can I customize my insurance plan?</span>
                    <span className="icon ic-accordion-custom cl-2" />
                  </div>
                  <div
                    id="faq-4"
                    className="collapse"
                    data-bs-parent="#faq-accordion"
                  >
                    <p className="faq-content font-plus_jakarta text-body-1 cl-text-2">
                      Simply fill out our online form or contact us directly —
                      we’ll send you a personalized quote within 24 hours.
                    </p>
                  </div>
                </div>
                <div className="faq-accordion_item">
                  <div
                    className="accordion-action h5 text-capitalize letter-space-05 collapsed"
                    data-bs-target="#faq-5"
                    data-bs-toggle="collapse"
                    aria-expanded="true"
                    aria-controls="faq-5"
                    role="button"
                  >
                    <span>Q6: What if I want to cancel my policy?</span>
                    <span className="icon ic-accordion-custom cl-2" />
                  </div>
                  <div
                    id="faq-5"
                    className="collapse"
                    data-bs-parent="#faq-accordion"
                  >
                    <p className="faq-content font-plus_jakarta text-body-1 cl-text-2">
                      Simply fill out our online form or contact us directly —
                      we’ll send you a personalized quote within 24 hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Faq;
