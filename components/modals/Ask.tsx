import { PreventDefaultForm } from "@/components/forms/PreventDefaultForm";

export default function Ask({
  registerModalElement,
}: {
  registerModalElement?: (el: HTMLElement | null) => void;
}) {
  return (
    <div
      ref={registerModalElement}
      className="modal modalCentered fade modal-log modal-ask"
      id="ask"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <span className="icon-close-popup" data-bs-dismiss="modal">
            <i className="icon-X2" />
          </span>
          <div className="modal-heading text-center">
            <h3 className="title-pop mb-8">Ask A Question</h3>
            <p className="desc-pop cl-text-2">Have a question? Ask us today!</p>
          </div>
          <div className="modal-main">
            <PreventDefaultForm className="form-log mb-20">
              <div className="form-content">
                <fieldset className="tf-field">
                  <label htmlFor="name-ask" className="tf-lable fw-medium">
                    Your Name <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    id="name-ask"
                    placeholder="Your Name*"
                    required
                  />
                </fieldset>
                <fieldset className="tf-field">
                  <label htmlFor="email-ask" className="tf-lable fw-medium">
                    Your Email <span className="text-primary">*</span>
                  </label>
                  <input
                    type="email"
                    id="email-ask"
                    placeholder="Your Email*"
                    required
                  />
                </fieldset>
                <fieldset className="tf-field">
                  <label htmlFor="phone-ask" className="tf-lable fw-medium">
                    Your phone
                  </label>
                  <input
                    type="number"
                    id="phone-ask"
                    placeholder="Your phone"
                    required
                  />
                </fieldset>
                <fieldset className="tf-field">
                  <label htmlFor="message-ask" className="tf-lable fw-medium">
                    Your Message <span className="text-primary">*</span>
                  </label>
                  <textarea
                    id="message-ask"
                    placeholder="Your Message*"
                    required
                    defaultValue={""}
                  />
                </fieldset>
              </div>
              <div className="group-action">
                <button type="submit" className="tf-btn animate-btn w-100">
                  Subcribe
                </button>
              </div>
            </PreventDefaultForm>
            <ul className="tf-social-icon-2 hv-dark justify-content-center">
              <li>
                <a href="https://www.facebook.com/">
                  <i className="icon icon-FacebookLogo" />
                </a>
              </li>
              <li>
                <a href="https://x.com/">
                  <i className="icon icon-XLogo" />
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/">
                  <i className="icon icon-InstagramLogo" />
                </a>
              </li>
              <li>
                <a href="https://www.tiktok.com/">
                  <i className="icon icon-TiktokLogo" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
