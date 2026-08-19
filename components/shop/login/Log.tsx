"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { PreventDefaultForm } from "@/components/forms/PreventDefaultForm";
import { PasswordField } from "@/components/forms/PasswordField";

function Log() {
  const router = useRouter();

  return (
    <>
      <section className="section-log flat-spacing">
        <div className="container">
          <div className="row align-items-center gy-30">
            <div className="col-md-5 ms-auto">
              <div className="col-left">
                <h4 className="title mb-20">Login</h4>
                <PreventDefaultForm
                  className="form-log"
                  onSubmit={() => router.push("/account-page")}
                >
                  <div className="form-content">
                    <fieldset className="tf-field">
                      <label
                        htmlFor="user-name-log-2"
                        className="tf-lable fw-medium"
                      >
                        Username or email address{" "}
                        <span className="text-primary">*</span>
                      </label>
                      <input
                        type="text"
                        id="user-name-log-2"
                        placeholder="Username or email address*"
                        required
                      />
                    </fieldset>
                    <fieldset className="tf-field password-wrapper">
                      <label
                        htmlFor="pass-log-2"
                        className="tf-lable fw-medium"
                      >
                        Password <span className="text-primary">*</span>
                      </label>
                      <PasswordField
                        id="pass-log-2"
                        placeholder="Password"
                        required
                      />
                    </fieldset>
                    <fieldset className="field-bottom">
                      <div className="checkbox-wrap">
                        <input
                          className="tf-check style-2"
                          type="checkbox"
                          id="remember-2"
                        />
                        <label htmlFor="remember-2"> Remember me </label>
                      </div>
                      <Link
                        href={`/forget-password`}
                        className="link text-decoration-underline"
                      >
                        <span className="text-caption-01 fw-semibold">
                          Forgot Your Password?
                        </span>
                      </Link>
                    </fieldset>
                  </div>
                  <button type="submit" className="tf-btn animate-btn">
                    Login
                  </button>
                </PreventDefaultForm>
              </div>
            </div>
            <div className="col-md-5 me-auto">
              <div className="col-right">
                <h4 className="mb-8">New Customer</h4>
                <p className="cl-text-2 mb-20">
                  Be part of our growing family of new customers! Join us today
                  and unlock a world of exclusive benefits, offers, and
                  personalized experiences.
                </p>
                <Link href={`/register`} className="tf-btn animate-btn">
                  Register
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
