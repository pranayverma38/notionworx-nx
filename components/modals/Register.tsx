"use client";

import { useRouter } from "next/navigation";

import { PreventDefaultForm } from "@/components/forms/PreventDefaultForm";
import { PasswordField } from "@/components/forms/PasswordField";

export default function Register({
  registerModalElement,
}: {
  registerModalElement?: (el: HTMLElement | null) => void;
}) {
  const router = useRouter();
  return (
    <div
      ref={registerModalElement}
      className="modal modalCentered fade modal-log"
      id="register"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <span className="icon-close-popup" data-bs-dismiss="modal">
            <i className="icon-X2" />
          </span>
          <div className="modal-heading text-center">
            <h3 className="title-pop mb-8">Create Account</h3>
            <p className="desc-pop cl-text-2">
              Be part of our growing family of new customers!
            </p>
          </div>
          <div className="modal-main">
            <PreventDefaultForm
              className="form-log"
              onSubmit={() => router.push("/account-page")}
            >
              <div className="form-content">
                <fieldset className="tf-field">
                  <label htmlFor="user-name" className="tf-lable fw-medium">
                    Username or email address{" "}
                    <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    id="user-name"
                    placeholder="Username or email address*"
                    required
                  />
                </fieldset>
                <fieldset className="tf-field password-wrapper">
                  <label
                    htmlFor="register-password"
                    className="tf-lable fw-medium"
                  >
                    Password <span className="text-primary">*</span>
                  </label>
                  <PasswordField
                    id="register-password"
                    placeholder="Password"
                    required
                  />
                </fieldset>
                <fieldset className="tf-field password-wrapper">
                  <label
                    htmlFor="register-password-confirm"
                    className="tf-lable fw-medium"
                  >
                    Confirm Password <span className="text-primary">*</span>
                  </label>
                  <PasswordField
                    id="register-password-confirm"
                    placeholder="Confirm Password"
                    required
                  />
                </fieldset>
              </div>
              <div className="group-action">
                <button
                  type="submit"
                  className="action-create-account tf-btn animate-btn w-100"
                >
                  Create Account
                </button>
                <a
                  href="#sign"
                  data-bs-toggle="modal"
                  className="tf-btn btn-stroke"
                >
                  Login
                </a>
              </div>
            </PreventDefaultForm>
          </div>
        </div>
      </div>
    </div>
  );
}
