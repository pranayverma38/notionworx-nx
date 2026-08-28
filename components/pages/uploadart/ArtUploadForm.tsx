"use client";

import Link from "next/link";
import { useState, useRef } from "react";

const S = `
  .au-section { background: #f8fafc; min-height: 100vh; padding: 56px 0 96px; }
  .au-layout { display: grid; grid-template-columns: 380px 1fr; gap: 40px; align-items: start; }
  @media (max-width: 900px) { .au-layout { grid-template-columns: 1fr !important; } }

  .au-input { width: 100%; padding: 13px 16px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 0.92rem; font-family: inherit; outline: none; transition: border-color 0.2s, box-shadow 0.2s; background: #fff; color: #0f172a; box-sizing: border-box; }
  .au-input::placeholder { color: #94a3b8; }
  .au-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
  .au-input.err { border-color: #ef4444; }
  .au-textarea { min-height: 120px; resize: vertical; }
  .au-label { font-size: 0.84rem; font-weight: 600; color: #374151; margin-bottom: 6px; display: block; }
  .au-err { font-size: 0.74rem; color: #ef4444; margin-top: 4px; }
  .au-req { color: #ef4444; margin-left: 2px; }

  .au-checklist { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
  .au-checklist li { display: flex; align-items: flex-start; gap: 10px; font-size: 0.88rem; color: #475569; line-height: 1.5; }
  .au-checklist li::before { content: "✓"; color: #3b82f6; font-weight: 700; flex-shrink: 0; margin-top: 1px; }

  .au-radio-group { display: flex; gap: 12px; }
  .au-radio-label { display: flex; align-items: center; gap: 8px; padding: 10px 18px; border: 1.5px solid #e2e8f0; border-radius: 10px; cursor: pointer; font-size: 0.88rem; font-weight: 600; color: #374151; transition: border-color 0.2s, background 0.2s; background: #fff; }
  .au-radio-label:has(input:checked) { border-color: #3b82f6; background: #eff6ff; color: #1d4ed8; }

  .au-upload-zone { border: 2px dashed #cbd5e1; border-radius: 12px; padding: 28px 20px; text-align: center; background: #f8fafc; cursor: pointer; transition: border-color 0.2s, background 0.2s; }
  .au-upload-zone:hover, .au-upload-zone.drag { border-color: #3b82f6; background: #eff6ff; }

  .au-submit { width: 100%; background: #0f172a; color: #fff; border: none; border-radius: 12px; padding: 16px; font-size: 1rem; font-weight: 700; cursor: pointer; transition: background 0.2s; letter-spacing: 0.01em; text-align: center; display: block; }
  .au-submit:hover:not(:disabled) { background: #1e3a5f; }
  .au-submit:disabled { opacity: 0.65; cursor: not-allowed; }

  .au-social-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  @media (max-width: 560px) { .au-social-grid { grid-template-columns: 1fr !important; } }
`;

const DESIGN_CHECKLIST = [
  "Preferred layout (logo placement, text, etc.)",
  "Social media handles and/or website",
  "Desired colors or background style",
  "Patterns, textures, or overall theme",
  "Font preferences (if any)",
  "Any design examples you like",
  "Confirm if you'd like to use the mockup we created and upload it, or request a new concept",
];

const ARTWORK_NOTE = "Upload vector artwork for your logo (AI, EPS, or PDF) — this is strongly preferred for best print quality, but if you don't have it, we can help clean and recreate your logo into vector format";

type Form = {
  fullName: string; businessName: string; invoiceNumber: string;
  mockupOnly: string; instagram: string; facebook: string; tiktok: string;
  linktree: string; website: string; dateNeeded: string; email: string;
  phone: string; designInstructions: string;
};
type Errs = Partial<Record<keyof Form, string>>;

const EMPTY: Form = {
  fullName: "", businessName: "", invoiceNumber: "", mockupOnly: "",
  instagram: "", facebook: "", tiktok: "", linktree: "", website: "",
  dateNeeded: "", email: "", phone: "", designInstructions: "",
};

function validate(f: Form): Errs {
  const e: Errs = {};
  if (!f.fullName.trim()) e.fullName = "Full name is required.";
  if (!f.businessName.trim()) e.businessName = "Business / Club name is required.";
  if (!f.email.trim()) e.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Enter a valid email.";
  if (!f.phone.trim()) e.phone = "Phone is required.";
  if (!f.dateNeeded) e.dateNeeded = "Date needed is required.";
  if (!f.designInstructions.trim()) e.designInstructions = "Please provide design instructions.";
  return e;
}

export default function ArtUploadForm() {
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Errs>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Form, boolean>>>({});
  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (touched[name as keyof Form]) setErrors(validate({ ...form, [name]: value }));
  }
  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setTouched(t => ({ ...t, [e.target.name]: true }));
    setErrors(validate(form));
  }
  function handleFile(f: File | null) { setFile(f); }
  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const allTouched = Object.fromEntries(Object.keys(EMPTY).map(k => [k, true])) as Record<keyof Form, boolean>;
    setTouched(allTouched);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 1400));
    setSending(false);
    setSubmitted(true);
  }

  const cls = (f: keyof Form) => `au-input${errors[f] && touched[f] ? " err" : ""}`;

  if (submitted) return (
    <section className="au-section">
      <style>{S}</style>
      <div className="container" style={{ maxWidth: "520px", textAlign: "center", paddingTop: "40px" }}>
        <div style={{ fontSize: "72px", marginBottom: "20px" }}>🎨</div>
        <h2 style={{ fontWeight: 800, fontSize: "1.8rem", color: "#0f172a", marginBottom: "12px" }}>Art Upload Received!</h2>
        <p style={{ color: "#64748b", lineHeight: 1.7, marginBottom: "28px" }}>
          Thanks! Our design team will review your submission and be in touch soon.
        </p>
        <button onClick={() => { setSubmitted(false); setForm(EMPTY); setFile(null); setTouched({}); }}
          style={{ background: "#0f172a", color: "#fff", border: "none", borderRadius: "10px", padding: "13px 28px", fontWeight: 700, cursor: "pointer", fontSize: "0.95rem" }}>
          Submit Another
        </button>
      </div>
    </section>
  );

  return (
    <section className="au-section">
      <style>{S}</style>
      <div className="container">

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "32px" }}>
          <Link href="/" style={{ color: "#94a3b8", fontSize: "0.82rem", textDecoration: "none" }}>Home</Link>
          <span style={{ color: "#cbd5e1" }}>›</span>
          <span style={{ color: "#64748b", fontSize: "0.82rem" }}>Art Upload</span>
        </div>

        <div className="au-layout">

          {/* ── Left: Instructions panel ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: "16px", padding: "28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <span style={{ fontSize: "22px" }}>📋</span>
                <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "#0f172a", margin: 0 }}>Design Details</h3>
              </div>
              <p style={{ color: "#64748b", fontSize: "0.85rem", lineHeight: 1.6, marginBottom: "16px" }}>
                To make sure your design reflects your vision and prints at the highest quality, we&apos;d love a few details:
              </p>
              <ul className="au-checklist">
                {DESIGN_CHECKLIST.map(item => <li key={item}>{item}</li>)}
              </ul>
            </div>

            <div style={{ background: "#eff6ff", border: "1.5px solid #bfdbfe", borderRadius: "16px", padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <span style={{ fontSize: "22px", flexShrink: 0 }}>🖼️</span>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: "0.92rem", color: "#1d4ed8", marginBottom: "8px" }}>Artwork File</h4>
                  <p style={{ color: "#1e40af", fontSize: "0.85rem", lineHeight: 1.6, margin: 0 }}>{ARTWORK_NOTE}</p>
                </div>
              </div>
            </div>

            <div style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: "16px", padding: "20px", fontSize: "0.85rem", color: "#166534", lineHeight: 1.6 }}>
              💡 This helps us design within your vision from the start and avoid unnecessary redesigns or added costs.
            </div>
          </div>

          {/* ── Right: Form ── */}
          <div>
            <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: "20px", padding: "36px", boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}>
              <h2 style={{ fontWeight: 800, fontSize: "1.4rem", color: "#0f172a", marginBottom: "6px" }}>Art Upload Form</h2>
              <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "28px" }}>Fields marked <span style={{ color: "#ef4444" }}>*</span> are required.</p>

              <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                {/* Name + Business */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }} className="au-social-grid">
                  <div>
                    <label className="au-label" htmlFor="au-fullName">Full Name<span className="au-req">*</span></label>
                    <input className={cls("fullName")} id="au-fullName" name="fullName" type="text" placeholder="Jane Smith" value={form.fullName} onChange={handleChange} onBlur={handleBlur} />
                    {errors.fullName && touched.fullName && <span className="au-err">{errors.fullName}</span>}
                  </div>
                  <div>
                    <label className="au-label" htmlFor="au-businessName">Business / Club Name<span className="au-req">*</span></label>
                    <input className={cls("businessName")} id="au-businessName" name="businessName" type="text" placeholder="Acme Co." value={form.businessName} onChange={handleChange} onBlur={handleBlur} />
                    {errors.businessName && touched.businessName && <span className="au-err">{errors.businessName}</span>}
                  </div>
                </div>

                {/* Invoice */}
                <div>
                  <label className="au-label" htmlFor="au-invoiceNumber">Invoice # / Order #</label>
                  <input className="au-input" id="au-invoiceNumber" name="invoiceNumber" type="text" placeholder="e.g. INV-00123" value={form.invoiceNumber} onChange={handleChange} />
                </div>

                {/* Mockup only */}
                <div>
                  <label className="au-label">Mockup request only? <span style={{ fontWeight: 400, color: "#94a3b8", fontSize: "0.78rem" }}>(Please disregard if you have already placed an order)</span></label>
                  <div className="au-radio-group">
                    {["Yes", "No"].map(opt => (
                      <label key={opt} className="au-radio-label">
                        <input type="radio" name="mockupOnly" value={opt} checked={form.mockupOnly === opt} onChange={handleChange} style={{ accentColor: "#3b82f6" }} />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Social media */}
                <div>
                  <label className="au-label">Social Media</label>
                  <div className="au-social-grid">
                    {[["instagram", "Instagram", "@yourhandle"], ["facebook", "Facebook", "facebook.com/page"], ["tiktok", "TikTok", "@yourhandle"], ["linktree", "LinkTree", "linktr.ee/page"]].map(([name, label, ph]) => (
                      <div key={name} style={{ position: "relative" }}>
                        <input className="au-input" name={name} type="text" placeholder={ph} value={form[name as keyof Form]} onChange={handleChange}
                          style={{ paddingLeft: "14px" }} />
                        <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "0.72rem", color: "#94a3b8", fontWeight: 600 }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Website */}
                <div>
                  <label className="au-label" htmlFor="au-website">Website</label>
                  <input className="au-input" id="au-website" name="website" type="url" placeholder="https://yourwebsite.com" value={form.website} onChange={handleChange} />
                </div>

                {/* Date + Email + Phone */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }} className="date-email-phone">
                  <style>{`@media(max-width:640px){.date-email-phone{grid-template-columns:1fr!important;}}`}</style>
                  <div>
                    <label className="au-label" htmlFor="au-dateNeeded">Date Needed By<span className="au-req">*</span></label>
                    <input className={cls("dateNeeded")} id="au-dateNeeded" name="dateNeeded" type="date" value={form.dateNeeded} onChange={handleChange} onBlur={handleBlur} />
                    {errors.dateNeeded && touched.dateNeeded && <span className="au-err">{errors.dateNeeded}</span>}
                  </div>
                  <div>
                    <label className="au-label" htmlFor="au-email">Email<span className="au-req">*</span></label>
                    <input className={cls("email")} id="au-email" name="email" type="email" placeholder="you@email.com" value={form.email} onChange={handleChange} onBlur={handleBlur} />
                    {errors.email && touched.email && <span className="au-err">{errors.email}</span>}
                  </div>
                  <div>
                    <label className="au-label" htmlFor="au-phone">Phone<span className="au-req">*</span></label>
                    <input className={cls("phone")} id="au-phone" name="phone" type="tel" placeholder="+1 555 000 0000" value={form.phone} onChange={handleChange} onBlur={handleBlur} />
                    {errors.phone && touched.phone && <span className="au-err">{errors.phone}</span>}
                  </div>
                </div>

                {/* Design Instructions */}
                <div>
                  <label className="au-label" htmlFor="au-designInstructions">Design Instructions / Suggestions<span className="au-req">*</span></label>
                  <textarea className={`au-input au-textarea ${errors.designInstructions && touched.designInstructions ? "err" : ""}`}
                    id="au-designInstructions" name="designInstructions"
                    placeholder="Describe your preferred layout, colors, font style, design examples you like, or any other vision details…"
                    value={form.designInstructions} onChange={handleChange} onBlur={handleBlur} />
                  {errors.designInstructions && touched.designInstructions && <span className="au-err">{errors.designInstructions}</span>}
                </div>

                {/* File Upload */}
                <div>
                  <label className="au-label">Logo / Artwork</label>
                  <div className={`au-upload-zone${drag ? " drag" : ""}`}
                    onClick={() => fileRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDrag(true); }}
                    onDragLeave={() => setDrag(false)}
                    onDrop={handleDrop}>
                    <input ref={fileRef} type="file" accept=".ai,.eps,.pdf,.png,.jpg,.jpeg,.svg,.webp" hidden
                      onChange={e => handleFile(e.target.files?.[0] ?? null)} />
                    {file ? (
                      <div>
                        <p style={{ fontWeight: 600, color: "#0f172a", marginBottom: "4px" }}>📎 {file.name}</p>
                        <p style={{ color: "#64748b", fontSize: "0.8rem", margin: 0 }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    ) : (
                      <div>
                        <p style={{ fontSize: "32px", marginBottom: "8px" }}>☁️</p>
                        <p style={{ fontWeight: 600, color: "#374151", marginBottom: "4px", fontSize: "0.9rem" }}>Choose file or drag here</p>
                        <p style={{ color: "#94a3b8", fontSize: "0.78rem", margin: 0 }}>AI, EPS, PDF, PNG, JPG — vector preferred for best quality</p>
                      </div>
                    )}
                  </div>
                  {file && (
                    <button type="button" onClick={() => setFile(null)}
                      style={{ marginTop: "8px", background: "none", border: "none", color: "#ef4444", fontSize: "0.8rem", cursor: "pointer", padding: 0 }}>
                      Remove file
                    </button>
                  )}
                </div>

                <button type="submit" className="au-submit" disabled={sending}>
                  {sending ? "Submitting…" : "Submit"}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
