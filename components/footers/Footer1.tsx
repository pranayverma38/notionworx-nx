"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, type ReactElement } from "react";
import { officeAddressLines, officeHours, socialLinks } from "@/data/contactInfo";

const categoryHref = (cat: string) => `/shop-default?category=${encodeURIComponent(cat)}`;

const SHOP_LINKS = [
  { label: "Premium Canopies", href: categoryHref("Custom Canopy Tents – Personalized Pop Up Tents for Events") },
  { label: "Premium Flags", href: categoryHref("FLAGS") },
  { label: "Table Covers", href: categoryHref("TABLE COVER") },
  { label: "Banners & Displays", href: categoryHref("BANNERS & DISPLAYS") },
  { label: "Apparel", href: categoryHref("APPAREL") },
  { label: "SEG Products", href: categoryHref("SEG PRODUCTS") },
  { label: "Promo Products", href: "/collection" },
  { label: "Gallery", href: categoryHref("Mockups") },
];

const SERVICE_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Refund & Return Policy", href: "/return-and-refund" },
  { label: "Shipping Policy", href: "/shipping" },
  { label: "New Customer", href: "/register" },
  { label: "FAQ's", href: "/faq" },
  { label: "Track Your Order", href: "/track-order" },
];

const SOCIAL_ICONS: Record<string, ReactElement> = {
  facebook: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
  instagram: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
  tiktok: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.19a8.27 8.27 0 0 0 4.83 1.55V6.28a4.85 4.85 0 0 1-1.06-.59z"/></svg>,
  whatsapp: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M19.11 4.89A9.9 9.9 0 0 0 12.06 2a9.94 9.94 0 0 0-8.62 14.9L2 22l5.27-1.38A9.93 9.93 0 0 0 12.05 22H12a10 10 0 0 0 7.11-17.11ZM12 20.29h-.04a8.21 8.21 0 0 1-4.18-1.14l-.3-.18-3.13.82.84-3.05-.2-.31a8.23 8.23 0 1 1 7.01 3.86Zm4.52-6.16c-.25-.12-1.48-.73-1.71-.81-.23-.09-.39-.12-.56.12-.16.24-.64.81-.78.97-.14.16-.28.18-.52.06-.25-.12-1.04-.38-1.98-1.2-.73-.65-1.23-1.45-1.37-1.69-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.41-.56-.42h-.48c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.33.98 2.49c.12.16 1.7 2.59 4.12 3.63.57.25 1.02.4 1.37.51.57.18 1.09.15 1.5.09.46-.07 1.48-.6 1.69-1.18.21-.58.21-1.08.15-1.18-.06-.1-.22-.16-.47-.28Z"/></svg>,
};

type Footer1Props = { hideTopRule?: boolean };

export default function Footer1({ hideTopRule = false }: Footer1Props) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) { setSubscribed(true); setEmail(""); }
  }

  function toggleSection(id: string) {
    setOpenSection(prev => prev === id ? null : id);
  }

  return (
    <footer style={{ background: "#f8fafc", color: "#1e293b", fontFamily: "inherit", borderTop: "1px solid #e2e8f0" }}>
      <style>{`
        .footer-nl-input { background: #fff; border: 1.5px solid #e2e8f0; color: #1e293b; border-radius: 10px 0 0 10px; padding: 13px 18px; font-size: 0.9rem; outline: none; width: 100%; transition: border-color 0.2s; }
        .footer-nl-input::placeholder { color: #94a3b8; }
        .footer-nl-input:focus { border-color: #94a3b8; }
        .footer-nl-btn { background: #111; color: #fff; border: none; border-radius: 0 10px 10px 0; padding: 13px 22px; font-weight: 700; font-size: 0.88rem; cursor: pointer; white-space: nowrap; transition: background 0.2s; }
        .footer-nl-btn:hover { background: #333; }
        .footer-link { color: #64748b; text-decoration: none; font-size: 0.88rem; transition: color 0.2s; display: block; padding: 4px 0; }
        .footer-link:hover { color: #111; }
        .footer-social-btn { width: 38px; height: 38px; border-radius: 50%; background: #fff; border: 1.5px solid #e2e8f0; display: flex; align-items: center; justify-content: center; color: #64748b; transition: background 0.2s, color 0.2s, transform 0.2s, border-color 0.2s; cursor: pointer; text-decoration: none; }
        .footer-social-btn:hover { background: #111; color: #fff; border-color: #111; transform: translateY(-2px); }
        .footer-grid { display: grid; grid-template-columns: 1.6fr 1fr 1fr; gap: 48px; }
        .footer-col-heading { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #111; margin-bottom: 18px; }
        .footer-accordion-btn { width: 100%; background: none; border: none; color: #111; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid #e2e8f0; }
        .footer-accordion-content { overflow: hidden; transition: max-height 0.3s ease, opacity 0.3s ease; }
        .footer-badge { display: inline-flex; align-items: center; gap: 6px; background: #fff; border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 8px 14px; font-size: 0.78rem; color: #64748b; }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 0 !important; }
          .footer-col-heading { display: none; }
          .footer-accordion-btn { display: flex !important; }
          .footer-links-desktop { display: none; }
        }
        @media (min-width: 769px) {
          .footer-accordion-btn { display: none; }
          .footer-links-desktop { display: block; }
          .footer-accordion-content { max-height: none !important; opacity: 1 !important; }
        }
      `}</style>

      {/* ── Newsletter bar ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "28px 0" }}>
        <div className="container">
          <form onSubmit={handleSubscribe} style={{ display: "flex", maxWidth: "480px", margin: "0 auto" }}>
            {subscribed ? (
              <div style={{ width: "100%", padding: "13px 20px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", color: "#16a34a", fontSize: "0.9rem", fontWeight: 600, textAlign: "center" }}>
                ✓ You&apos;re subscribed!
              </div>
            ) : (
              <>
                <input className="footer-nl-input" type="email" placeholder="Subscribe for deals & new arrivals" value={email} onChange={e => setEmail(e.target.value)} required />
                <button className="footer-nl-btn" type="submit">Subscribe</button>
              </>
            )}
          </form>
        </div>
      </div>

      {/* ── Main body ── */}
      <div className="container" style={{ padding: "56px 0 40px" }}>
        <div className="footer-grid">

          {/* Brand */}
          <div>
            <Link href="/" style={{ display: "inline-block", marginBottom: "20px", width: "min(200px, 100%)" }}>
              <Image priority width={500} height={212} src="/assets/images/logo/Notion_Worx_LOGO_3D_no_lights.webp" alt="Notion Worx" style={{ width: "100%", height: "auto" }} />
            </Link>
            <p style={{ color: "#64748b", fontSize: "0.88rem", lineHeight: 1.7, marginBottom: "20px", maxWidth: "300px" }}>
              Custom canopies, displays, flags, apparel, and event essentials. Brand it yours — built to impress.
            </p>
            <div style={{ marginBottom: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <span style={{ color: "#94a3b8", fontSize: "14px", marginTop: "1px" }}>📍</span>
                <span style={{ color: "#64748b", fontSize: "0.85rem", lineHeight: 1.5 }}>{officeAddressLines[0]}<br />{officeAddressLines[1]}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ color: "#94a3b8", fontSize: "14px" }}>🕐</span>
                <span style={{ color: "#64748b", fontSize: "0.85rem" }}>{officeHours}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ color: "#94a3b8", fontSize: "14px" }}>📞</span>
                <a href="tel:+13035397288" style={{ color: "#64748b", fontSize: "0.85rem", textDecoration: "none" }} className="footer-link">+1 (303) 539-7288</a>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {socialLinks.map(link => (
                <a key={link.href} href={link.href} target="_blank" rel="noreferrer" aria-label={link.label} className="footer-social-btn">
                  {SOCIAL_ICONS[link.icon]}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <p className="footer-col-heading">Shop</p>
            <div className="footer-links-desktop">
              {SHOP_LINKS.map(l => <Link key={l.href + l.label} href={l.href} className="footer-link">{l.label}</Link>)}
            </div>
            <button className="footer-accordion-btn" onClick={() => toggleSection("shop")}>
              <span>Shop</span>
              <span style={{ fontSize: "18px", transition: "transform 0.3s", transform: openSection === "shop" ? "rotate(45deg)" : "none" }}>+</span>
            </button>
            <div className="footer-accordion-content" style={{ maxHeight: openSection === "shop" ? "400px" : "0", opacity: openSection === "shop" ? 1 : 0 }}>
              <div style={{ paddingTop: "8px", paddingBottom: "8px" }}>
                {SHOP_LINKS.map(l => <Link key={l.href + l.label} href={l.href} className="footer-link">{l.label}</Link>)}
              </div>
            </div>
          </div>

          {/* Service */}
          <div>
            <p className="footer-col-heading">Customer Service</p>
            <div className="footer-links-desktop">
              {SERVICE_LINKS.map(l => <Link key={l.href + l.label} href={l.href} className="footer-link">{l.label}</Link>)}
            </div>
            <button className="footer-accordion-btn" onClick={() => toggleSection("service")}>
              <span>Customer Service</span>
              <span style={{ fontSize: "18px", transition: "transform 0.3s", transform: openSection === "service" ? "rotate(45deg)" : "none" }}>+</span>
            </button>
            <div className="footer-accordion-content" style={{ maxHeight: openSection === "service" ? "400px" : "0", opacity: openSection === "service" ? 1 : 0 }}>
              <div style={{ paddingTop: "8px", paddingBottom: "8px" }}>
                {SERVICE_LINKS.map(l => <Link key={l.href + l.label} href={l.href} className="footer-link">{l.label}</Link>)}
              </div>
            </div>
          </div>

        </div>

        {/* Trust badges */}
        <div style={{ marginTop: "48px", paddingTop: "32px", borderTop: "1px solid #e2e8f0", display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          {[["🚚", "Free Shipping $250+"], ["🎨", "Custom Branding"], ["⚡", "Fast Turnaround"], ["🔒", "Secure Checkout"], ["⭐", "5-Star Rated"]].map(([icon, label]) => (
            <div key={label as string} className="footer-badge">
              <span>{icon}</span><span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ borderTop: "1px solid #e2e8f0", background: "#fff", padding: "18px 0" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <p style={{ color: "#94a3b8", fontSize: "0.82rem", margin: 0 }}>
            © {new Date().getFullYear()} Notion Worx. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {[["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"], ["Sitemap", "/sitemap"]].map(([label, href]) => (
              <Link key={href} href={href} style={{ color: "#94a3b8", fontSize: "0.82rem", textDecoration: "none" }} className="footer-link">{label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
