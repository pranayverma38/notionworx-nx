import Link from "next/link";

import { PreventDefaultForm } from "@/components/forms/PreventDefaultForm";

function Log() {
  return (
    <>
      <section className="section-log flat-spacing">
        <div className="container">
          <div className="row align-items-center gy-30">
            <div className="col-md-5 ms-auto">
              <div className="col-left">
                <h4 className="title mb-10">Reset your password</h4>
                <p className="cl-text-2 mb-20">
                  We’ll send instructions to reset your password.
                </p>
                <PreventDefaultForm className="form-log">
                  <div className="form-content">
                    <fieldset className="tf-field">
                      <label
                        htmlFor="forgot-user2"
                        className="tf-lable fw-medium"
                      >
                        Username or email address{" "}
                        <span className="text-primary">*</span>
                      </label>
                      <input
                        type="text"
                        id="forgot-user2"
                        placeholder="Username or email address*"
                        required
                      />
                    </fieldset>
                  </div>
                  <button type="submit" className="tf-btn animate-btn">
                    Get Reset Code
                  </button>
                </PreventDefaultForm>
              </div>
            </div>
            <div className="col-md-5 me-auto">
              <div className="col-right">
                <h4 className="mb-8">Already have an account?</h4>
                <p className="cl-text-2 mb-20">
                  Welcome back. Sign in to access your personalized experience,
                  saved preferences, and more. We&apos;re thrilled to have you
                  with us again!
                </p>
                <Link href={`/login`} className="tf-btn animate-btn">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Log;
