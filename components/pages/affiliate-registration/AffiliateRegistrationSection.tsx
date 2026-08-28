"use client";

import { useState } from "react";
import Image from "next/image";

/* ── Tokens ─────────────────────────────────────────────── */
const NAVY   = "#0b2d6e";
const NAVY_D = "#071c4a";
const GOLD   = "#f5c200";

/* ── Types ───────────────────────────────────────────────── */
type FormState = {
  firstName: string; lastName: string; email: string;
  password: string; confirmPassword: string;
  phone: string; instagram: string;
};
const INIT: FormState = {
  firstName: "", lastName: "", email: "",
  password: "", confirmPassword: "", phone: "", instagram: "",
};

/* ── Benefits (exact copy from reference) ────────────────── */
const BENEFITS = [
  { label: "Cookie days",       value: "30 days",              bold: false },
  { label: "Commission type",   value: "Flat rate per order",  bold: false },
  { label: "Commission amount", value: "$25.00",               bold: true  },
];
const TERMS =
  "You will earn a $25 commission per order on referral sales whenever a customer " +
  "makes a purchase through your affiliate link or by using your coupon code.";

/* ── Component ───────────────────────────────────────────── */
type AffiliateRegistrationSectionProps = {
  layout?: "default" | "homepage";
};

export default function AffiliateRegistrationSection({
  layout = "default",
}: AffiliateRegistrationSectionProps) {
  const [form, setForm] = useState<FormState>(INIT);
  const [showPw, setShowPw]     = useState(false);
  const [showCpw, setShowCpw]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors]     = useState<Partial<FormState>>({});
  const [sending, setSending]   = useState(false);
  const [submitError, setSubmitError] = useState("");
  const isHomepageLayout = layout === "homepage";

  const change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    setErrors(p => ({ ...p, [name]: "" }));
    setSubmitError("");
  };

  const validate = (): Partial<FormState> => {
    const e: Partial<FormState> = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim())  e.lastName  = "Required";
    if (!form.email.trim())     e.email     = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.password)              e.password        = "Required";
    else if (form.password.length < 8) e.password      = "Min. 8 characters";
    if (!form.confirmPassword)       e.confirmPassword = "Required";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords don't match";
    return e;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSending(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/form-submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formType: isHomepageLayout ? "home_affiliate" : "affiliate_registration",
          sourcePath: isHomepageLayout ? "/" : "/affiliate-registration",
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          instagram: form.instagram,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Your application could not be submitted. Please try again in a moment.",
        );
      }

      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Your application could not be submitted. Please try again in a moment.",
      );
    } finally {
      setSending(false);
    }
  };

  /* ── shared input styles (dynamic) ── */
  const inp = (err?: string): React.CSSProperties => ({
    width: "100%", boxSizing: "border-box",
    border: `1.5px solid ${err ? "#f87171" : "#dde3ee"}`,
    borderRadius: "10px", padding: "11px 14px",
    fontSize: "0.875rem", color: "#0f172a",
    background: "#fff", outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
    fontFamily: "inherit",
  });

  const benefitsCard = (
    <div
      style={{
        border: `1px solid #dde3ee`,
        borderRadius: "14px",
        overflow: "hidden",
        marginBottom: isHomepageLayout ? "0" : "28px",
        boxShadow: "0 1px 4px rgba(11,45,110,0.06)",
        background: "#fff",
      }}
    >
      <div
        style={{
          padding: "10px 18px",
          background: `linear-gradient(90deg,${NAVY} 0%,#1a4aa0 100%)`,
        }}
      >
        <span
          style={{
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.68rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          Benefits
        </span>
      </div>

      {BENEFITS.map(({ label, value, bold }, i) => (
        <div
          key={label}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 18px",
            gap: "12px",
            borderBottom: "1px solid #f0f4fb",
            background: i % 2 === 0 ? "#fff" : "#fafcff",
          }}
        >
          <span
            style={{
              color: NAVY,
              fontWeight: 600,
              fontSize: "0.82rem",
              width: "148px",
              flexShrink: 0,
            }}
          >
            {label}
          </span>
          <span
            style={{
              color: bold ? NAVY : "#334155",
              fontWeight: bold ? 800 : 400,
              fontSize: "0.82rem",
            }}
          >
            {value}
          </span>
        </div>
      ))}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          padding: "10px 18px",
          gap: "12px",
          background: "#fafcff",
        }}
      >
        <span
          style={{
            color: NAVY,
            fontWeight: 600,
            fontSize: "0.82rem",
            width: "148px",
            flexShrink: 0,
          }}
        >
          Additional terms
        </span>
        <span
          style={{
            color: "#475569",
            fontSize: "0.82rem",
            lineHeight: 1.65,
          }}
        >
          {TERMS}
        </span>
      </div>
    </div>
  );

  const content = (
    <div
      className="afp-wrap"
      style={{ minHeight: isHomepageLayout ? "auto" : "100vh" }}
    >

      {/* ══ LEFT PANEL ════════════════════════════════════ */}
      <div className="afp-side">
        {isHomepageLayout ? (
          <div className="afp-benefits-panel">
            <div style={{ width: "min(520px, 100%)", margin: "0 auto" }}>
              {benefitsCard}
            </div>
          </div>
        ) : (
          <div className="afp-hero" style={{ minHeight: "100%" }}>
            <Image
              src="/assets/images/notionworx/hero/trade-show-banner.jpg"
              alt="Become a Notion Worx Partner"
              fill
              priority
              style={{ objectFit:"cover", objectPosition:"center" }}
            />
            <div style={{
              position:"absolute", inset:0,
              background:`linear-gradient(160deg,
                rgba(7,28,74,0.82) 0%,
                rgba(11,45,110,0.70) 40%,
                rgba(7,28,74,0.92) 100%)`,
            }}/>
            <div style={{
              position:"absolute", inset:0,
              display:"flex", flexDirection:"column",
              justifyContent:"center", alignItems:"center",
              textAlign:"center", padding:"40px 32px",
            }}>
              <div style={{
                width:48, height:2,
                background:GOLD, marginBottom:"24px",
              }}/>
              <h2 style={{
                color:"#fff", fontWeight:900,
                fontSize:"clamp(1.8rem,4vw,3rem)",
                lineHeight:1.1, letterSpacing:"-0.01em",
                textTransform:"uppercase", marginBottom:"12px",
              }}>
                Become Our<br/>Partner
              </h2>
              <p style={{
                color:GOLD, fontWeight:600,
                fontSize:"clamp(0.85rem,1.5vw,1rem)",
                letterSpacing:"0.14em", textTransform:"uppercase",
              }}>
                Start Earning Now!
              </p>
              <div style={{
                width:48, height:2,
                background:GOLD, marginTop:"24px",
              }}/>
            </div>
          </div>
        )}
      </div>

      {/* ══ RIGHT : Form Panel ════════════════════════════ */}
      <div className="afp-form">
        {/* Top accent */}
        <div style={{
          position:"absolute", top:0, right:0,
          width:"58%", height:"3px",
          background:`linear-gradient(90deg,transparent,${NAVY})`,
          pointerEvents:"none",
        }}/>

        <div style={{ width:"100%", maxWidth:"500px" }}>

          {/* Logo */}
          <div style={{ display:"flex", justifyContent:"center", marginBottom:"20px" }}>
            <Image
              src="/assets/images/logo/Notion_Worx_LOGO_3D_no_lights.webp"
              alt="Notion Worx" width={500} height={212}
              style={{ width:"auto", height:"90px", objectFit:"contain" }}
            />
          </div>

          {/* Heading */}
          <h1 style={{
            textAlign:"center", color:NAVY, fontWeight:900,
            fontSize:"clamp(1.1rem,2.5vw,1.4rem)",
            letterSpacing:"0.08em", textTransform:"uppercase",
            marginBottom:"24px",
          }}>
            Join Our Affiliate Program
          </h1>

          {!isHomepageLayout && benefitsCard}

          {/* ── Form or Success ── */}
          {submitted ? (
            <div style={{ textAlign:"center", padding:"32px 0" }}>
              <div style={{
                width:60, height:60, borderRadius:"50%",
                background:"#dcfce7", display:"flex",
                alignItems:"center", justifyContent:"center",
                margin:"0 auto 16px",
              }}>
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24"
                  stroke="#16a34a" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <h2 style={{ fontSize:"1.1rem", fontWeight:700, color:"#0f172a", marginBottom:8 }}>
                Application Submitted!
              </h2>
              <p style={{ color:"#64748b", fontSize:"0.875rem", lineHeight:1.6 }}>
                Thank you! We&apos;ll review your application and be in touch soon.
              </p>
            </div>
          ) : (

            <form onSubmit={submit} noValidate style={{ display:"flex", flexDirection:"column", gap:"14px" }}>

              {/* First + Last Name */}
              <div className="afp-grid2">
                <FW label="First Name" req err={errors.firstName}>
                  <IN id="firstName" name="firstName" type="text"
                    value={form.firstName} onChange={change}
                    placeholder="Jane" style={inp(errors.firstName)} />
                </FW>
                <FW label="Last Name" req err={errors.lastName}>
                  <IN id="lastName" name="lastName" type="text"
                    value={form.lastName} onChange={change}
                    placeholder="Doe" style={inp(errors.lastName)} />
                </FW>
              </div>

              {/* Email */}
              <FW label="Email" req err={errors.email}>
                <IN id="email" name="email" type="email"
                  value={form.email} onChange={change}
                  placeholder="jane@example.com" style={inp(errors.email)} />
              </FW>

              {/* Password + Confirm */}
              <div className="afp-grid2">
                <FW label="Password" req err={errors.password}>
                  <PW id="password" name="password" value={form.password}
                    onChange={change} show={showPw}
                    onToggle={() => setShowPw(v=>!v)}
                    placeholder="Min. 8 characters" err={errors.password} />
                </FW>
                <FW label="Confirm Password" req err={errors.confirmPassword}>
                  <PW id="confirmPassword" name="confirmPassword"
                    value={form.confirmPassword} onChange={change}
                    show={showCpw} onToggle={() => setShowCpw(v=>!v)}
                    placeholder="Repeat password" err={errors.confirmPassword} />
                </FW>
              </div>

              {/* Phone + Instagram */}
              <div className="afp-grid2">
                <FW label="Phone">
                  <IN id="phone" name="phone" type="tel"
                    value={form.phone} onChange={change}
                    placeholder="+1 (800) 973-9383" style={inp()} />
                </FW>
                <FW label="Instagram">
                  <div style={{ position:"relative" }}>
                    <span style={{
                      position:"absolute", left:14, top:"50%",
                      transform:"translateY(-50%)", color:"#94a3b8",
                      fontSize:"0.875rem", fontWeight:600, userSelect:"none",
                    }}>@</span>
                    <IN id="instagram" name="instagram" type="text"
                      value={form.instagram} onChange={change}
                      placeholder="yourhandle"
                      style={{ ...inp(), paddingLeft:"28px" }} />
                  </div>
                </FW>
              </div>

              {submitError && (
                <div
                  role="alert"
                  style={{
                    border:"1px solid #fecaca",
                    borderRadius:"10px",
                    background:"#fef2f2",
                    color:"#b91c1c",
                    padding:"12px 14px",
                    fontSize:"0.82rem",
                    lineHeight:1.5,
                  }}
                >
                  {submitError}
                </div>
              )}

              {/* Submit */}
              <div style={{ display:"flex", justifyContent:"center", marginTop:"4px" }}>
              <button type="submit"
                disabled={sending}
                onMouseEnter={e=>(e.currentTarget.style.background=`linear-gradient(135deg,${NAVY_D} 0%,#1040a8 100%)`)}
                onMouseLeave={e=>(e.currentTarget.style.background=`linear-gradient(135deg,${NAVY} 0%,#1a4aa0 100%)`)}
                style={{
                  background:`linear-gradient(135deg,${NAVY} 0%,#1a4aa0 100%)`,
                  color:"#fff", border:"none", borderRadius:"10px",
                  padding:"13px 48px", cursor:"pointer",
                  fontWeight:700, fontSize:"0.78rem",
                  letterSpacing:"0.12em", textTransform:"uppercase",
                  transition:"background 0.2s",
                  boxShadow:`0 4px 14px rgba(11,45,110,0.28)`,
                  fontFamily:"inherit", whiteSpace:"nowrap",
                  opacity: sending ? 0.8 : 1,
                }}>
                {sending ? "Submitting..." : "JOIN"}
              </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Responsive style injection */}
      <style>{`
        .afp-wrap  { display:flex; flex-wrap:wrap; }
        .afp-side  { width:100%; flex-shrink:0; display:flex; }
        .afp-hero  { position:relative; min-height:300px; overflow:hidden; width:100%; }
        .afp-benefits-panel {
          display:flex; flex-direction:column; justify-content:center;
          background:#fff; padding:48px 24px; min-height:300px;
          align-items:center; width:100%;
        }
        .afp-form  { flex:1; display:flex; flex-direction:column;
                     justify-content:center; align-items:center;
                     background:#fff; padding:48px 24px; min-width:300px; }
        .afp-grid2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        @media(min-width:1024px){
          .afp-side { width:42%; }
        }
        @media(max-width:600px){
          .afp-grid2 { grid-template-columns:1fr; }
        }
      `}</style>
      {isHomepageLayout ? (
        <section className="flat-spacing">
          <div className="container">{content}</div>
        </section>
      ) : (
        content
      )}
    </>
  );
}

/* ── Sub-components ──────────────────────────────────────── */

/** Field wrapper with label + error */
function FW({ label, req, err, children }: {
  label:string; req?:boolean; err?:string; children:React.ReactNode;
}) {
  return (
    <div>
      <label style={{
        display:"block", fontSize:"0.68rem", fontWeight:700,
        color:"#0b2d6e", textTransform:"uppercase",
        letterSpacing:"0.12em", marginBottom:"6px",
      }}>
        {label}{req && <span style={{ color:"#ef4444" }}> *</span>}
      </label>
      {children}
      {err && <p style={{ color:"#ef4444", fontSize:"0.7rem", marginTop:"4px" }}>{err}</p>}
    </div>
  );
}

/** Plain text input – receives pre-computed style */
function IN(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input {...props}
      onFocus={e => {
        e.currentTarget.style.borderColor = "#0b2d6e";
        e.currentTarget.style.boxShadow   = "0 0 0 3px rgba(11,45,110,0.10)";
      }}
      onBlur={e => {
        e.currentTarget.style.borderColor = "#dde3ee";
        e.currentTarget.style.boxShadow   = "none";
      }}
    />
  );
}

/** Password input with show/hide toggle */
function PW({ id,name,value,onChange,show,onToggle,placeholder,err }: {
  id:string; name:string; value:string;
  onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void;
  show:boolean; onToggle:()=>void;
  placeholder:string; err?:string;
}) {
  const border = err ? "#f87171" : "#dde3ee";
  return (
    <div style={{ position:"relative" }}>
      <input id={id} name={name} value={value} onChange={onChange}
        type={show ? "text" : "password"} placeholder={placeholder}
        style={{
          width:"100%", boxSizing:"border-box",
          border:`1.5px solid ${border}`, borderRadius:"10px",
          padding:"11px 40px 11px 14px",
          fontSize:"0.875rem", color:"#0f172a",
          background:"#fff", outline:"none",
          transition:"border-color 0.15s, box-shadow 0.15s",
          fontFamily:"inherit",
        }}
        onFocus={e => {
          e.currentTarget.style.borderColor = "#0b2d6e";
          e.currentTarget.style.boxShadow   = "0 0 0 3px rgba(11,45,110,0.10)";
        }}
        onBlur={e => {
          e.currentTarget.style.borderColor = border;
          e.currentTarget.style.boxShadow   = "none";
        }}
      />
      <button type="button" onClick={onToggle}
        aria-label={show ? "Hide password" : "Show password"}
        style={{
          position:"absolute", right:12, top:"50%",
          transform:"translateY(-50%)",
          background:"none", border:"none", cursor:"pointer",
          color:"#94a3b8", padding:0, display:"flex",
        }}>
        <span className={show ? "icon-Eye fs-16" : "icon-EyeSlash fs-16"}/>
      </button>
    </div>
  );
}
