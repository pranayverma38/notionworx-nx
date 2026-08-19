import { PreventDefaultForm } from "@/components/forms/PreventDefaultForm";

export default function ForgotPass({
  registerModalElement,
}: {
  registerModalElement?: (el: HTMLElement | null) => void;
}) {
  return (
    <div
      ref={registerModalElement}
      className="modal modalCentered fade modal-log modal-log_forgot"
      id="modalForgot"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <span className="icon-close-popup" data-bs-dismiss="modal">
            <i className="icon-X2" />
          </span>
          <div className="modal-heading text-center">
            <h3 className="title-pop mb-8">Forgot Password</h3>
            <p className="desc-pop cl-text-2">
              We’ll send instructions to reset your password.
            </p>
          </div>
          <div className="modal-main">
            <PreventDefaultForm className="form-log">
              <div className="form-content">
                <fieldset className="tf-field">
                  <label htmlFor="forgot-user" className="tf-lable fw-medium">
                    Username or email address{" "}
                    <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    id="forgot-user"
                    placeholder="Username or email address*"
                    required
                  />
                </fieldset>
              </div>
              <div className="group-action">
                <button type="submit" className="tf-btn animate-btn w-100">
                  Get Reset Code
                </button>
                <p className="orther-log text-center">
                  Remember your password?{" "}
                  <a
                    href="#sign"
                    data-bs-toggle="modal"
                    className="text-primary text-decoration-underline"
                  >
                    Sign In
                  </a>
                </p>
              </div>
            </PreventDefaultForm>
          </div>
        </div>
      </div>
    </div>
  );
}
