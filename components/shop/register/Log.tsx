"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { PasswordField } from "@/components/forms/PasswordField";
import { createClient, withTimeout } from "@/lib/supabase/client";

const COUNTRY_CODES = [
  { code: "+1", label: "🇺🇸 +1" }, { code: "+44", label: "🇬🇧 +44" },
  { code: "+91", label: "🇮🇳 +91" }, { code: "+61", label: "🇦🇺 +61" },
  { code: "+81", label: "🇯🇵 +81" }, { code: "+49", label: "🇩🇪 +49" },
  { code: "+33", label: "🇫🇷 +33" }, { code: "+86", label: "🇨🇳 +86" },
  { code: "+971", label: "🇦🇪 +971" }, { code: "+65", label: "🇸🇬 +65" },
];

function Log() {
  const router = useRouter();
  const supabase = createClient();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneCode, setPhoneCode] = useState("+1");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setLoading(true);
    try {
      const { error: signUpError } = await withTimeout(
        supabase.auth.signUp({
          email, password,
          options: { data: { first_name: firstName, last_name: lastName, phone_country_code: phoneCode, phone_number: phone } },
        })
      );
      if (signUpError) { setError(signUpError.message); return; }

      const { error: signInError } = await withTimeout(supabase.auth.signInWithPassword({ email, password }));
      if (signInError) { setError("Account created! Please log in."); setTimeout(() => router.push("/login"), 2000); return; }

      router.push("/account-page");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section-log flat-spacing">
      <div className="container">
        <div className="row align-items-center gy-30">
          <div className="col-md-6 ms-auto">
            <div className="col-left">
              <h4 className="title mb-20">Create Account</h4>
              <form className="form-log" onSubmit={handleSubmit}>
                <div className="form-content">
                  {error && <div className="alert alert-danger mb-3">{error}</div>}
                  <div className="tf-grid-layout sm-col-2">
                    <fieldset className="tf-field">
                      <label htmlFor="reg-first-name" className="tf-lable fw-medium">First Name <span className="text-primary">*</span></label>
                      <input type="text" id="reg-first-name" placeholder="First Name" required value={firstName} onChange={e => setFirstName(e.target.value)} />
                    </fieldset>
                    <fieldset className="tf-field">
                      <label htmlFor="reg-last-name" className="tf-lable fw-medium">Last Name <span className="text-primary">*</span></label>
                      <input type="text" id="reg-last-name" placeholder="Last Name" required value={lastName} onChange={e => setLastName(e.target.value)} />
                    </fieldset>
                  </div>
                  <fieldset className="tf-field">
                    <label htmlFor="reg-email" className="tf-lable fw-medium">Email Address <span className="text-primary">*</span></label>
                    <input type="email" id="reg-email" placeholder="Email address" required value={email} onChange={e => setEmail(e.target.value)} />
                  </fieldset>
                  <fieldset className="tf-field">
                    <label className="tf-lable fw-medium">Phone Number <span className="text-primary">*</span></label>
                    <div className="d-flex gap-2">
                      <select value={phoneCode} onChange={e => setPhoneCode(e.target.value)} style={{ width: "130px", flexShrink: 0 }}>
                        {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                      </select>
                      <input type="tel" placeholder="Phone number" required value={phone} onChange={e => setPhone(e.target.value)} style={{ flex: 1 }} />
                    </div>
                  </fieldset>
                  <fieldset className="tf-field password-wrapper">
                    <label htmlFor="reg-password" className="tf-lable fw-medium">Password <span className="text-primary">*</span></label>
                    <PasswordField id="reg-password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} />
                  </fieldset>
                  <fieldset className="tf-field password-wrapper">
                    <label htmlFor="reg-confirm-password" className="tf-lable fw-medium">Confirm Password <span className="text-primary">*</span></label>
                    <PasswordField id="reg-confirm-password" placeholder="Confirm Password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                  </fieldset>
                </div>
                <button type="submit" className="action-create-account tf-btn animate-btn" disabled={loading}>
                  {loading ? "Creating Account…" : "Create Account"}
                </button>
              </form>
            </div>
          </div>
          <div className="col-md-5 me-auto">
            <div className="col-right">
              <h4 className="mb-8">Already have an account?</h4>
              <p className="cl-text-2 mb-20">Welcome back. Sign in to access your personalized experience, saved preferences, and more.</p>
              <Link href="/login" className="tf-btn animate-btn">Login</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Log;
