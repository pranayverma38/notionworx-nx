"use client";

import { useState } from "react";

const CONTACT_STYLES = `
  .contact-layout { display: grid; grid-template-columns: 1fr 1.4fr; gap: 56px; align-items: start; }
  @media (max-width: 900px) { .contact-layout { grid-template-columns: 1fr; gap: 40px; } }

  .contact-info-card { background: #fff; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 24px; display: flex; align-items: flex-start; gap: 16px; transition: box-shadow 0.2s, border-color 0.2s; }
  .contact-info-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.09); border-color: #cbd5e1; }
  .contact-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 22px; }

  .contact-input { width: 100%; padding: 14px 16px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 0.93rem; font-family: inherit; outline: none; transition: border-color 0.2s, box-shadow 0.2s; background: #fff; color: #0f172a; }
  .contact-input::placeholder { color: #94a3b8; }
  .contact-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.12); }
  .contact-input.error { border-color: #ef4444; box-shadow: 0 0 0 3px rgba(239,68,68,0.1); }
  .contact-textarea { min-height: 140px; resize: vertical; }

  .contact-submit-btn { width: fit-content; background: transparent; color: #0f172a; border: 1px solid #cbd5e1; border-radius: 999px; padding: 11px 18px; font-size: 0.92rem; font-weight: 600; cursor: pointer; transition: background 0.2s, border-color 0.2s, color 0.2s; letter-spacing: 0; }
  .contact-submit-btn:hover:not(:disabled) { background: #f8fafc; border-color: #94a3b8; color: #020617; }
  .contact-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  .field-label { font-size: 0.85rem; font-weight: 600; color: #374151; margin-bottom: 7px; display: block; }
  .field-error { font-size: 0.75rem; color: #ef4444; margin-top: 5px; display: block; }
`;

type FormData = { name: string; email: string; scope: string; saveDetails: boolean };
type Errors = Partial<Record<keyof FormData, string>>;

function validate(f: FormData): Errors {
  const e: Errors = {};
  if (!f.name.trim()) e.name = "Your name is required.";
  if (!f.email.trim()) e.email = "Email address is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Enter a valid email address.";
  if (!f.scope.trim()) e.scope = "Please describe your project.";
  else if (f.scope.trim().length < 20) e.scope = "Please add a bit more detail (at least 20 characters).";
  return e;
}

export default function Contact() {
  const [form, setForm] = useState<FormData>({ name: "", email: "", scope: "", saveDetails: false });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setForm(f => ({ ...f, [name]: val }));
    if (touched[name as keyof FormData]) {
      setErrors(validate({ ...form, [name]: val }));
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setTouched(t => ({ ...t, [e.target.name]: true }));
    setErrors(validate(form));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ name: true, email: true, scope: true });
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSending(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/form-submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formType: "contact",
          sourcePath: "/contact",
          name: form.name,
          email: form.email,
          projectScope: form.scope,
          saveDetails: form.saveDetails,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Your request could not be sent. Please try again in a moment.",
        );
      }

      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Your request could not be sent. Please try again in a moment.",
      );
    } finally {
      setSending(false);
    }
  }

  const cls = (field: keyof FormData) =>
    `contact-input${errors[field] && touched[field] ? " error" : ""}`;

  return (
    <section style={{ padding: "64px 0 96px", background: "#f8fafc" }}>
      <style>{CONTACT_STYLES}</style>
      <div className="container">
        {/* ── Centered header ── */}
        <div style={{ textAlign: "center", maxWidth: "560px", margin: "0 auto 48px" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#3b82f6", marginBottom: "10px" }}>Contact Information</p>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", marginBottom: "12px" }}>
            We&apos;d love to hear from you
          </h2>
          <p style={{ color: "#64748b", lineHeight: 1.7, fontSize: "0.95rem", margin: 0 }}>
            Include the product type, approximate quantity, desired sizes, and any artwork notes so your request is easier to follow.
          </p>
        </div>

        <div className="contact-layout">

          {/* ── Left: Info cards ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Info cards */}
            <div className="contact-info-card">
              <div className="contact-icon" style={{ background: "#eff6ff" }}>📍</div>
              <div>
                <p style={{ fontWeight: 700, fontSize: "0.88rem", color: "#0f172a", marginBottom: "4px" }}>Our Location</p>
                <p style={{ color: "#64748b", fontSize: "0.88rem", lineHeight: 1.6, margin: 0 }}>
                  3700 Tennyson St #12559<br />Denver, CO 80212
                </p>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon" style={{ background: "#f0fdf4" }}>📞</div>
              <div>
                <p style={{ fontWeight: 700, fontSize: "0.88rem", color: "#0f172a", marginBottom: "4px" }}>Phone</p>
                <a href="tel:8009739383" style={{ color: "#3b82f6", fontSize: "0.95rem", fontWeight: 600, textDecoration: "none" }}>800.973.9383</a>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon" style={{ background: "#fff7ed" }}>✉️</div>
              <div>
                <p style={{ fontWeight: 700, fontSize: "0.88rem", color: "#0f172a", marginBottom: "4px" }}>Email</p>
                <a href="mailto:orders@notionworx.com" style={{ color: "#3b82f6", fontSize: "0.88rem", fontWeight: 600, textDecoration: "none", wordBreak: "break-all" }}>orders@notionworx.com</a>
              </div>
            </div>

            {/* Hours */}
            <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: "16px", padding: "24px" }}>
              <p style={{ fontWeight: 700, fontSize: "0.88rem", color: "#0f172a", marginBottom: "12px" }}>Business Hours</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {[["Monday – Friday", "8:00 AM – 5:00 PM MT"], ["Saturday – Sunday", "Closed"]].map(([day, hrs]) => (
                  <div key={day} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                    <span style={{ color: "#64748b" }}>{day}</span>
                    <span style={{ fontWeight: 600, color: "#0f172a" }}>{hrs}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Form ── */}
          <div>
            {submitted ? (
              <div style={{
                background: "#fff", border: "1.5px solid #bbf7d0", borderRadius: "20px",
                padding: "56px 40px", textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.06)"
              }}>
                <div style={{ fontSize: "64px", marginBottom: "20px" }}>🎉</div>
                <h3 style={{ fontWeight: 800, fontSize: "1.5rem", color: "#0f172a", marginBottom: "12px" }}>Request Sent!</h3>
                <p style={{ color: "#64748b", lineHeight: 1.7, maxWidth: "340px", margin: "0 auto" }}>
                  Thanks for reaching out. Our team will review your project details and get back to you within 1 business day.
                </p>
                <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", scope: "", saveDetails: false }); setTouched({}); }}
                  style={{ marginTop: "28px", background: "#0f172a", color: "#fff", border: "none", borderRadius: "10px", padding: "12px 28px", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}>
                  Send Another Request
                </button>
              </div>
            ) : (
              <div style={{ background: "#fff", borderRadius: "20px", padding: "40px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", border: "1.5px solid #e2e8f0" }}>
                <h3 style={{ fontWeight: 800, fontSize: "1.3rem", color: "#0f172a", marginBottom: "6px" }}>Send a Request</h3>
                <p style={{ color: "#94a3b8", fontSize: "0.88rem", marginBottom: "28px" }}>We typically respond within 1 business day.</p>

                <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }} className="form-name-email-row">
                    <style>{`@media(max-width:560px){.form-name-email-row{grid-template-columns:1fr!important;}}`}</style>
                    <div>
                      <label className="field-label" htmlFor="c-name">Your Name <span style={{ color: "#ef4444" }}>*</span></label>
                      <input className={cls("name")} id="c-name" name="name" type="text" placeholder="Jane Smith" value={form.name} onChange={handleChange} onBlur={handleBlur} />
                      {errors.name && touched.name && <span className="field-error">{errors.name}</span>}
                    </div>
                    <div>
                      <label className="field-label" htmlFor="c-email">Your Email <span style={{ color: "#ef4444" }}>*</span></label>
                      <input className={cls("email")} id="c-email" name="email" type="email" placeholder="jane@company.com" value={form.email} onChange={handleChange} onBlur={handleBlur} />
                      {errors.email && touched.email && <span className="field-error">{errors.email}</span>}
                    </div>
                  </div>

                  <div>
                    <label className="field-label" htmlFor="c-scope">Project Scope <span style={{ color: "#ef4444" }}>*</span></label>
                    <textarea className={`${cls("scope")} contact-textarea`} id="c-scope" name="scope"
                      placeholder="Tell us what you need — product type, quantity, sizes, deadline, artwork details…"
                      value={form.scope} onChange={handleChange} onBlur={handleBlur} />
                    {errors.scope && touched.scope && <span className="field-error">{errors.scope}</span>}
                    <span style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "5px", display: "block" }}>{form.scope.length} / 20 min characters</span>
                  </div>

                  <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer" }}>
                    <input type="checkbox" name="saveDetails" checked={form.saveDetails}
                      onChange={handleChange}
                      style={{ width: "16px", height: "16px", marginTop: "2px", accentColor: "#0f172a", flexShrink: 0 }} />
                    <span style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.5 }}>
                      Save my details in this browser for the next project request.
                    </span>
                  </label>

                  {submitError && (
                    <div
                      role="alert"
                      style={{
                        borderRadius: "10px",
                        border: "1px solid #fecaca",
                        background: "#fef2f2",
                        color: "#b91c1c",
                        fontSize: "0.85rem",
                        padding: "12px 14px",
                      }}
                    >
                      {submitError}
                    </div>
                  )}

                  <button type="submit" className="contact-submit-btn" disabled={sending}>
                    {sending ? "Sending..." : "Send Request"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
