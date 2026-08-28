"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { PasswordField } from "@/components/forms/PasswordField";
import { createClient, withTimeout } from "@/lib/supabase/client";

function Log() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

      router.push("/account-page");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(msg);
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
                <h4 className="title mb-20">Login</h4>
                <form className="form-log" onSubmit={handleSubmit}>
                  <div className="form-content">
                    {error && (
                      <div className="alert alert-danger mb-3" role="alert">
                        {error}
                      </div>
                    )}
                    <fieldset className="tf-field">
                      <label htmlFor="user-email-log" className="tf-lable fw-medium">
                        Email address <span className="text-primary">*</span>
                      </label>
                      <input
                        type="email"
                        id="user-email-log"
                        placeholder="Email address*"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </fieldset>
                    <fieldset className="tf-field password-wrapper">
                      <label htmlFor="pass-log-2" className="tf-lable fw-medium">
                        Password <span className="text-primary">*</span>
                      </label>
                      <PasswordField
                        id="pass-log-2"
                        placeholder="Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </fieldset>
                    <fieldset className="field-bottom">
                      <div className="checkbox-wrap" />
                      <Link href="/forget-password" className="link text-decoration-underline">
                        <span className="text-caption-01 fw-semibold">Forgot Your Password?</span>
                      </Link>
                    </fieldset>
                  </div>
                  <button type="submit" className="tf-btn animate-btn" disabled={loading}>
                    {loading ? "Signing in…" : "Login"}
                  </button>
                </form>
              </div>
            </div>
            <div className="col-md-5 me-auto">
              <div className="col-right">
                <h4 className="mb-8">New Customer</h4>
                <p className="cl-text-2 mb-20">
                  Be part of our growing family of new customers! Join us today and unlock
                  a world of exclusive benefits, offers, and personalized experiences.
                </p>
                <Link href="/register" className="tf-btn animate-btn">
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
