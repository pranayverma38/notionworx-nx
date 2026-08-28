"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

import { PasswordField } from "@/components/forms/PasswordField";
import { createClient, withTimeout } from "@/lib/supabase/client";

export default function SignIn({
  registerModalElement,
}: {
  registerModalElement?: (el: HTMLElement | null) => void;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const closeRef = useRef<HTMLSpanElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error } = await withTimeout(supabase.auth.signInWithPassword({ email, password }));

      if (error) {
        setError(error.message);
        return;
      }

      // Close modal via Bootstrap dismiss
      closeRef.current?.click();
      setEmail("");
      setPassword("");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      ref={registerModalElement}
      className="modal modalCentered fade modal-log"
      id="sign"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <span ref={closeRef} className="icon-close-popup" data-bs-dismiss="modal">
            <i className="icon-X2" />
          </span>
          <div className="modal-heading text-center">
            <h3 className="title-pop mb-8">Sign In</h3>
            <p className="desc-pop cl-text-2">Sign in to access your personalized experience.</p>
          </div>
          <div className="modal-main">
            <form className="form-log" onSubmit={handleSubmit}>
              <div className="form-content">
                {error && (
                  <div className="alert alert-danger mb-3 py-2 px-3" style={{ fontSize: "0.85rem" }}>
                    {error}
                  </div>
                )}
                <fieldset className="tf-field">
                  <label htmlFor="user-email-modal" className="tf-lable fw-medium">
                    Email address <span className="text-primary">*</span>
                  </label>
                  <input
                    type="email"
                    id="user-email-modal"
                    placeholder="Email address*"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </fieldset>
                <fieldset className="tf-field password-wrapper">
                  <label htmlFor="password-modal" className="tf-lable fw-medium">
                    Password <span className="text-primary">*</span>
                  </label>
                  <PasswordField
                    id="password-modal"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </fieldset>
                <fieldset className="field-bottom">
                  <div className="checkbox-wrap" />
                  <a href="#modalForgot" data-bs-toggle="modal" className="link text-decoration-underline">
                    <span className="text-caption-01 fw-semibold">Forgot Your Password?</span>
                  </a>
                </fieldset>
              </div>
              <div className="group-action">
                <button type="submit" className="tf-btn animate-btn w-100" disabled={loading}>
                  {loading ? "Signing in…" : "Login"}
                </button>
                <a href="#register" data-bs-toggle="modal" className="tf-btn btn-stroke">
                  Create Account
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
