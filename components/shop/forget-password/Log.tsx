"use client";

import Link from "next/link";
import { useState } from "react";

import { PreventDefaultForm } from "@/components/forms/PreventDefaultForm";

function Log() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
          "If that email exists, password reset instructions will be handled by Medusa.",
      );
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
                <PreventDefaultForm className="form-log" onSubmit={handleSubmit}>
                  <div className="form-content">
                    {error && <div className="alert alert-danger mb-3">{error}</div>}
                    {message && <div className="alert alert-success mb-3">{message}</div>}
                    <fieldset className="tf-field">
                      <label
                        htmlFor="forgot-user2"
                        className="tf-lable fw-medium"
                      >
                        Email address{" "}
                        <span className="text-primary">*</span>
                      </label>
                      <input
                        type="email"
                        id="forgot-user2"
                        placeholder="Email address*"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                      />
                    </fieldset>
                  </div>
                  <button type="submit" className="tf-btn animate-btn" disabled={loading}>
                    {loading ? "Submitting..." : "Send Reset Instructions"}
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
