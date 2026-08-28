"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

import { PasswordField } from "@/components/forms/PasswordField";
import { createClient, withTimeout } from "@/lib/supabase/client";

const COUNTRY_CODES = [
  { code: "+1", label: "🇺🇸 +1" }, { code: "+44", label: "🇬🇧 +44" },
  { code: "+91", label: "🇮🇳 +91" }, { code: "+61", label: "🇦🇺 +61" },
  { code: "+81", label: "🇯🇵 +81" }, { code: "+49", label: "🇩🇪 +49" },
  { code: "+33", label: "🇫🇷 +33" }, { code: "+86", label: "🇨🇳 +86" },
  { code: "+971", label: "🇦🇪 +971" }, { code: "+65", label: "🇸🇬 +65" },
];

export default function Register({ registerModalElement }: { registerModalElement?: (el: HTMLElement | null) => void }) {
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
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const closeRef = useRef<HTMLSpanElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSuccess("");
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
      if (signInError) {
        setSuccess("Account created! Please log in.");
        setTimeout(() => { closeRef.current?.click(); router.push("/login"); }, 2000);
        return;
      }

      closeRef.current?.click();
      router.push("/account-page");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div ref={registerModalElement} className="modal modalCentered fade modal-log" id="register">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <span ref={closeRef} className="icon-close-popup" data-bs-dismiss="modal"><i className="icon-X2" /></span>
          <div className="modal-heading text-center">
            <h3 className="title-pop mb-8">Create Account</h3>
            <p className="desc-pop cl-text-2">Be part of our growing family of new customers!</p>
          </div>
          <div className="modal-main">
            <form className="form-log" onSubmit={handleSubmit}>
              <div className="form-content">
                {error && <div className="alert alert-danger mb-3 py-2 px-3" style={{ fontSize: "0.85rem" }}>{error}</div>}
                {success && <div className="alert alert-success mb-3 py-2 px-3" style={{ fontSize: "0.85rem" }}>{success}</div>}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <fieldset className="tf-field">
                    <label htmlFor="modal-first-name" className="tf-lable fw-medium">First Name <span className="text-primary">*</span></label>
                    <input type="text" id="modal-first-name" placeholder="First Name" required value={firstName} onChange={e => setFirstName(e.target.value)} />
                  </fieldset>
                  <fieldset className="tf-field">
                    <label htmlFor="modal-last-name" className="tf-lable fw-medium">Last Name <span className="text-primary">*</span></label>
                    <input type="text" id="modal-last-name" placeholder="Last Name" required value={lastName} onChange={e => setLastName(e.target.value)} />
                  </fieldset>
                </div>
                <fieldset className="tf-field">
                  <label htmlFor="modal-reg-email" className="tf-lable fw-medium">Email <span className="text-primary">*</span></label>
                  <input type="email" id="modal-reg-email" placeholder="Email address" required value={email} onChange={e => setEmail(e.target.value)} />
                </fieldset>
                <fieldset className="tf-field">
                  <label className="tf-lable fw-medium">Phone <span className="text-primary">*</span></label>
                  <div className="d-flex gap-2">
                    <select value={phoneCode} onChange={e => setPhoneCode(e.target.value)} style={{ width: "110px", flexShrink: 0 }}>
                      {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                    </select>
                    <input type="tel" placeholder="Phone number" required value={phone} onChange={e => setPhone(e.target.value)} style={{ flex: 1 }} />
                  </div>
                </fieldset>
                <fieldset className="tf-field password-wrapper">
                  <label htmlFor="modal-reg-password" className="tf-lable fw-medium">Password <span className="text-primary">*</span></label>
                  <PasswordField id="modal-reg-password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} />
                </fieldset>
                <fieldset className="tf-field password-wrapper">
                  <label htmlFor="modal-reg-confirm" className="tf-lable fw-medium">Confirm Password <span className="text-primary">*</span></label>
                  <PasswordField id="modal-reg-confirm" placeholder="Confirm Password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                </fieldset>
              </div>
              <div className="group-action">
                <button type="submit" className="action-create-account tf-btn animate-btn w-100" disabled={loading}>
                  {loading ? "Creating Account…" : "Create Account"}
                </button>
                <a href="#sign" data-bs-toggle="modal" className="tf-btn btn-stroke">Login</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
