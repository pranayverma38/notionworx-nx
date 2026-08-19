import { PreventDefaultForm } from "@/components/forms/PreventDefaultForm";

const supportTopics = [
  {
    title: "Catalog Guidance",
    body: "Need help choosing between canopies, displays, flags, apparel, or accessories? Share your use case and we will point you to the right collection.",
  },
  {
    title: "Artwork Planning",
    body: "Tell us if you need help preparing logos, print areas, or display graphics before you narrow in on a product.",
  },
  {
    title: "Order Readiness",
    body: "Include quantities, size requirements, and any important deadlines so the project request starts with the right context.",
  },
  {
    title: "Local-First Storefront",
    body: "The primary shopping experience now runs on mirrored inventory and local product imagery, which keeps product discovery more consistent.",
  },
] as const;

export default function Contact() {
  return (
    <section className="section-contact flat-spacing">
      <div className="container">
        <div className="row gy-5 flex-wrap-reverse">
          <div className="col-md-6">
            <div className="col-left">
              <div className="heading d-grid gap-8">
                <h4>How We Can Help</h4>
                <p className="cl-text-2">
                  Use the notes below as a guide for what to include in your
                  project request.
                </p>
              </div>
              <div className="grid-info tf-grid-layout sm-col-2">
                {supportTopics.map((topic) => (
                  <div key={topic.title} className="d-grid gap-8">
                    <h6>{topic.title}</h6>
                    <p className="cl-text-2">{topic.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <h4 className="mb-8">Start Your Request</h4>
            <p className="mb-24 cl-text-2">
              Include the product type, approximate quantity, desired sizes, and
              any artwork notes so the request is easier to follow.
            </p>
            <PreventDefaultForm className="form-get">
              <div className="form-content">
                <div className="tf-grid-layout sm-col-2">
                  <fieldset className="tf-field">
                    <label htmlFor="your-name" className="tf-lable fw-medium">
                      Your Name <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      id="your-name"
                      placeholder="Your Name*"
                      required
                    />
                  </fieldset>
                  <fieldset className="tf-field">
                    <label htmlFor="your-email" className="tf-lable fw-medium">
                      Your Email <span className="text-primary">*</span>
                    </label>
                    <input
                      type="email"
                      id="your-email"
                      placeholder="Your Email*"
                      required
                    />
                  </fieldset>
                </div>
                <fieldset className="tf-field">
                  <label htmlFor="project-scope" className="tf-lable fw-medium">
                    Project Scope <span className="text-primary">*</span>
                  </label>
                  <textarea
                    id="project-scope"
                    placeholder="Tell us what you need, which products you are considering, and any deadline or artwork details."
                    required
                    defaultValue=""
                  />
                </fieldset>
                <div className="checkbox-wrap">
                  <input
                    className="tf-check flex-shrink-0"
                    type="checkbox"
                    id="agree-term-2"
                  />
                  <label htmlFor="agree-term-2">
                    Save my details in this browser for the next project request.
                  </label>
                </div>
              </div>
              <button type="submit" className="tf-btn animate-btn">
                Send request
              </button>
            </PreventDefaultForm>
          </div>
        </div>
      </div>
    </section>
  );
}
