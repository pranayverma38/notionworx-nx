import { PreventDefaultForm } from "@/components/forms/PreventDefaultForm";

function Contact() {
  return (
    <>
      <section className="section-contact flat-spacing">
        <div className="container">
          <div className="row gy-5 flex-wrap-reverse">
            <div className="col-md-6">
              <div className="col-left">
                <div className="heading d-grid gap-8">
                  <h4>Information</h4>
                  <h5 className="d-none">Perfect Heading SEO</h5>
                  <p className="cl-text-2">
                    Have a question? Please contact us using the customer
                    support channels below.
                  </p>
                </div>
                <div className="grid-info tf-grid-layout sm-col-2">
                  <div className="d-grid gap-8">
                    <h6>Phone:</h6>
                    <p>
                      <a href="tel:16662348888" className="cl-text-2 link">
                        +1 666 234 8888
                      </a>
                    </p>
                  </div>
                  <div className="d-grid gap-8">
                    <h6>Email:</h6>
                    <p>
                      <a
                        href="mailto:hi.amere@gmail.com"
                        className="cl-text-2 link"
                      >
                        hi.amere@gmail.com
                      </a>
                    </p>
                  </div>
                  <div className="wd-full d-grid gap-8">
                    <h6>Address:</h6>
                    <p>
                      <a
                        href="https://www.google.com/maps?q=600+N+Michigan+Ave+Chicago,+IL+60611+USA"
                        target="_blank"
                        className="cl-text-2 link"
                      >
                        2163 Phillips Gap Rd, West Jefferson, North Carolina,
                        United States
                      </a>
                    </p>
                  </div>
                  <div className="wd-full d-grid gap-8">
                    <h6>Open Time:</h6>
                    <ul className="open-text">
                      <li className="d-flex gap-4 mb-4">
                        <span className="cl-text-2">Mon - Sat:</span>7:30am -
                        8:00pm PST
                      </li>
                      <li className="d-flex gap-4">
                        <span className="cl-text-2">Sunday:</span>9:00am -
                        5:00pm PST
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <h4 className="mb-8">Get In Touch</h4>
              <p className="mb-24 cl-text-2">
                Use the form below to get in touch with the sales team
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
                      <label
                        htmlFor="your-email"
                        className="tf-lable fw-medium"
                      >
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
                    <label htmlFor="your-email" className="tf-lable fw-medium">
                      Your Message <span className="text-primary">*</span>
                    </label>
                    <textarea
                      placeholder="Your Message*"
                      required
                      defaultValue={""}
                    />
                  </fieldset>
                  <div className="checkbox-wrap">
                    <input
                      className="tf-check flex-shrink-0"
                      type="checkbox"
                      id="agree-term-2"
                    />
                    <label htmlFor="agree-term-2">
                      Save my name, email, and website in this browser for the
                      next time I comment.
                    </label>
                  </div>
                </div>
                <button type="submit" className="tf-btn animate-btn">
                  Send message
                </button>
              </PreventDefaultForm>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;
