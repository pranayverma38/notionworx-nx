"use client";

import { useRouter } from "next/navigation";

import { PreventDefaultForm } from "@/components/forms/PreventDefaultForm";
import { PasswordField } from "@/components/forms/PasswordField";

export default function SignIn({
  registerModalElement,
}: {
  registerModalElement?: (el: HTMLElement | null) => void;
}) {
  const router = useRouter();
  return (
    <div
      ref={registerModalElement}
      className="modal modalCentered fade modal-log"
      id="sign"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <span className="icon-close-popup" data-bs-dismiss="modal">
            <i className="icon-X2" />
          </span>
          <div className="modal-heading text-center">
            <h3 className="title-pop mb-8">Sign In</h3>
            <p className="desc-pop cl-text-2">
              Sign in to access your personalized experience.
            </p>
          </div>
          <div className="modal-main">
            <PreventDefaultForm
              className="form-log"
              onSubmit={() => router.push("/account-page")}
            >
              <div className="form-content">
                <fieldset className="tf-field">
                  <label htmlFor="user-name-log" className="tf-lable fw-medium">
                    Username or email address{" "}
                    <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    id="user-name-log"
                    placeholder="Username or email address*"
                    required
                  />
                </fieldset>
                <fieldset className="tf-field password-wrapper">
                  <label htmlFor="password" className="tf-lable fw-medium">
                    Password <span className="text-primary">*</span>
                  </label>
                  <PasswordField
                    id="password"
                    placeholder="Password"
                    required
                  />
                </fieldset>
                <fieldset className="field-bottom">
                  <div className="checkbox-wrap">
                    <input
                      className="tf-check style-2"
                      type="checkbox"
                      id="remember"
                    />
                    <label htmlFor="remember"> Remember me </label>
                  </div>
                  <a
                    href="#modalForgot"
                    data-bs-toggle="modal"
                    className="link text-decoration-underline"
                  >
                    <span className="text-caption-01 fw-semibold">
                      Forgot Your Password?
                    </span>
                  </a>
                </fieldset>
              </div>
              <div className="group-action">
                <button type="submit" className="tf-btn animate-btn w-100">
                  Login
                </button>
                <a
                  href="#register"
                  data-bs-toggle="modal"
                  className="tf-btn btn-stroke"
                >
                  Create Account
                </a>
              </div>
            </PreventDefaultForm>
          </div>
        </div>
      </div>
    </div>
  );
}
