"use client";

import { useRef, useState } from "react";

import { PreventDefaultForm } from "@/components/forms/PreventDefaultForm";

export default function ForgotPass({
  registerModalElement,
}: {
  registerModalElement?: (el: HTMLElement | null) => void;
}) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const closeRef = useRef<HTMLSpanElement>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const payload = (await response.json()) as {
        error?: string;
        message?: string;
      };

      if (!response.ok) {
        setError(payload.error ?? "Unable to request a password reset.");
        return;
      }

      setMessage(
        payload.message ??
          "If that email exists, password reset instructions will be sent by Medusa.",
      );
      setTimeout(() => {
        closeRef.current?.click();
      }, 1500);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to request a password reset.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      ref={registerModalElement}
      className="modal modalCentered fade modal-log modal-log_forgot"
      id="modalForgot"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <span
            ref={closeRef}
            className="icon-close-popup"
            data-bs-dismiss="modal"
          >
            <i className="icon-X2" />
          </span>
          <div className="modal-heading text-center">
            <h3 className="title-pop mb-8">Forgot Password</h3>
            <p className="desc-pop cl-text-2">
              We’ll send instructions to reset your password.
            </p>
          </div>
          <div className="modal-main">
            <PreventDefaultForm className="form-log" onSubmit={handleSubmit}>
              <div className="form-content">
                {error && <div className="alert alert-danger mb-3">{error}</div>}
                {message && <div className="alert alert-success mb-3">{message}</div>}
                <fieldset className="tf-field">
                  <label htmlFor="forgot-user" className="tf-lable fw-medium">
                    Email address{" "}
                    <span className="text-primary">*</span>
                  </label>
                  <input
                    type="email"
                    id="forgot-user"
                    placeholder="Email address*"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </fieldset>
              </div>
              <div className="group-action">
                <button type="submit" className="tf-btn animate-btn w-100" disabled={loading}>
                  {loading ? "Submitting..." : "Send Reset Instructions"}
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
