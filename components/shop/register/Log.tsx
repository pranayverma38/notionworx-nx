"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { PasswordField } from "@/components/forms/PasswordField";
import { PreventDefaultForm } from "@/components/forms/PreventDefaultForm";

function Log() {
  const router = useRouter();

  return (
    <section className="section-log flat-spacing">
      <div className="container">
        <div className="row align-items-center gy-30">
          <div className="col-md-5 ms-auto">
            <div className="col-left">
              <h4 className="title mb-20">Create Account</h4>
              <PreventDefaultForm
                className="form-log"
                onSubmit={() => router.push("/account-page")}
              >
                <div className="form-content">
                  <fieldset className="tf-field">
                    <label
                      htmlFor="username-register_2"
                      className="tf-lable fw-medium"
                    >
                      Username or email address{" "}
                      <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      id="username-register_2"
                      placeholder="Username or email address*"
                      required
                    />
                  </fieldset>

                  <fieldset className="tf-field password-wrapper">
                    <label
                      htmlFor="password-register_2"
                      className="tf-lable fw-medium"
                    >
                      Password <span className="text-primary">*</span>
                    </label>
                    <PasswordField
                      id="password-register_2"
                      placeholder="Password"
                      required
                    />
                  </fieldset>

                  <fieldset className="tf-field password-wrapper">
                    <label
                      htmlFor="re_password-register_2"
                      className="tf-lable fw-medium"
                    >
                      Confirm Password <span className="text-primary">*</span>
                    </label>
                    <PasswordField
                      id="re_password-register_2"
                      placeholder="Confirm Password"
                      required
                    />
                  </fieldset>
                </div>

                <button
                  type="submit"
                  className="action-create-account tf-btn animate-btn"
                >
                  Create Account
                </button>
              </PreventDefaultForm>
            </div>
          </div>

          <div className="col-md-5 me-auto">
            <div className="col-right">
              <h4 className="mb-8">Already have an account?</h4>
              <p className="cl-text-2 mb-20">
                Welcome back. Sign in to access your personalized experience,
                saved preferences, and more. We are thrilled to have you with us
                again!
              </p>
              <Link href="/login" className="tf-btn animate-btn">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Log;
