import Link from "next/link";

const ABOUT_STYLES = `
  .about-hero { background: #fff; padding: 96px 0 80px; position: relative; overflow: hidden; border-bottom: 1px solid #e2e8f0; }
  .about-hero-grid { position: absolute; inset: 0; opacity: 0.4; background-image: linear-gradient(rgba(59,130,246,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.06) 1px, transparent 1px); background-size: 40px 40px; }
  .about-hero-glow { position: absolute; top: -100px; right: 5%; width: 500px; height: 500px; background: radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%); border-radius: 50%; }
  .about-hero-glow2 { position: absolute; bottom: -60px; left: 10%; width: 300px; height: 300px; background: radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%); border-radius: 50%; }

  .about-stat-card { background: #fff; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 28px 24px; text-align: center; transition: box-shadow 0.2s, transform 0.2s; }
  .about-stat-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.1); transform: translateY(-3px); }

  .about-value-card { background: #fff; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 28px 24px; transition: box-shadow 0.2s, border-color 0.2s; }
  .about-value-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.08); border-color: #bfdbfe; }

  .about-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .about-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
  .about-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }

  @media (max-width: 900px) {
    .about-grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
    .about-2col { grid-template-columns: 1fr !important; gap: 36px !important; }
  }
  @media (max-width: 600px) {
    .about-grid-3 { grid-template-columns: 1fr !important; }
    .about-grid-4 { grid-template-columns: 1fr 1fr !important; }
    .about-hero { padding: 64px 0 56px !important; }
  }
`;

const STATS = [
  { number: "800K+", label: "Products to Choose From" },
  { number: "15+", label: "Years of Experience" },
  { number: "10K+", label: "Happy Customers" },
  { number: "100%", label: "Satisfaction Guarantee" },
];

const VALUES = [
  {
    icon: "🎨",
    title: "Creative Excellence",
    desc: "Our team blends creativity with precision to deliver designs that make your brand stand out from the crowd.",
    bg: "#eff6ff",
  },
  {
    icon: "⚡",
    title: "Fast Turnaround",
    desc: "We understand deadlines. Our streamlined process ensures your branded products arrive when you need them.",
    bg: "#fefce8",
  },
  {
    icon: "💰",
    title: "Competitive Pricing",
    desc: "Top-quality doesn't have to mean top-dollar. We offer the best value so every brand can shine.",
    bg: "#f0fdf4",
  },
  {
    icon: "🤝",
    title: "Your Success is Our Goal",
    desc: "Service and design are our strength. We're here to help you look your best, every time.",
    bg: "#fdf4ff",
  },
  {
    icon: "🛡️",
    title: "Quality First",
    desc: "Every product goes through rigorous quality checks. You receive exactly what you expect — and more.",
    bg: "#fff7ed",
  },
  {
    icon: "🌎",
    title: "Full-Service Partner",
    desc: "From logo design to promotional products, we're a one-stop shop for everything your brand needs.",
    bg: "#f0f9ff",
  },
];

const SPECIALTIES = [
  { icon: "⛺", label: "Custom Canopy Tents" },
  { icon: "🚩", label: "Premium Flags & Banners" },
  { icon: "👕", label: "Branded Apparel" },
  { icon: "🏷️", label: "Promotional Products" },
  { icon: "🎨", label: "Logo Design" },
  { icon: "📦", label: "800K+ Products" },
];

export default function AboutUs() {
  return (
    <>
      <style>{ABOUT_STYLES}</style>

      {/* ── Hero ── */}
      <section className="about-hero">
        <div className="about-hero-grid" />
        <div className="about-hero-glow" />
        <div className="about-hero-glow2" />
        <div className="container" style={{ position: "relative" }}>
          <div style={{ maxWidth: "720px", margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#3b82f6", marginBottom: "18px" }}>
              About Notion Worx
            </p>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", fontWeight: 900, color: "#0f172a", lineHeight: 1.12, letterSpacing: "-0.025em", marginBottom: "24px" }}>
              We Make Your Brand{" "}
              <span style={{ color: "#3b82f6" }}>Impossible to Miss</span>
            </h1>
            <p style={{ color: "#64748b", fontSize: "1.1rem", lineHeight: 1.75, maxWidth: "580px", margin: "0 auto 36px" }}>
              At Notion Worx, we make your brand impossible to miss — from custom canopies to branded apparel and everything in between.
            </p>
            <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/shop-default" style={{
                background: "#0f172a", color: "#fff", padding: "14px 32px", borderRadius: "10px",
                fontWeight: 700, textDecoration: "none", fontSize: "0.95rem"
              }}>Shop Now</Link>
              <Link href="/contact" style={{
                background: "#fff", color: "#0f172a", padding: "14px 32px", borderRadius: "10px",
                fontWeight: 700, textDecoration: "none", fontSize: "0.95rem", border: "1.5px solid #e2e8f0"
              }}>Get In Touch</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ background: "#f8fafc", padding: "64px 0" }}>
        <div className="container">
          <div className="about-grid-4">
            {STATS.map(s => (
              <div key={s.label} className="about-stat-card">
                <p style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.03em", margin: "0 0 6px" }}>{s.number}</p>
                <p style={{ color: "#64748b", fontSize: "0.88rem", fontWeight: 500, margin: 0 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section style={{ background: "#fff", padding: "80px 0" }}>
        <div className="container">
          <div className="about-2col">
            <div>
              <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#3b82f6", marginBottom: "14px" }}>Our Story</p>
              <h2 style={{ fontSize: "clamp(1.7rem, 3.5vw, 2.4rem)", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: "24px" }}>
                Full-Service Design &amp; Branding
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <p style={{ color: "#475569", lineHeight: 1.8, fontSize: "1rem", margin: 0 }}>
                  We&apos;re a full-service design and branding company specializing in custom canopies, promotional products, apparel, and logo design. With over <strong style={{ color: "#0f172a" }}>800,000 products</strong> to choose from, we give you everything you need to showcase your brand in style — from vibrant tents and flags to branded shirts, mugs, pens, and more.
                </p>
                <p style={{ color: "#475569", lineHeight: 1.8, fontSize: "1rem", margin: 0 }}>
                  Our team blends creativity with precision, delivering top-quality designs, fast turnaround, and competitive pricing. Whether you&apos;re promoting your business, attending an event, or launching a new brand, we&apos;re here to help you look your best.
                </p>
                <p style={{ color: "#0f172a", lineHeight: 1.8, fontSize: "1rem", fontWeight: 600, margin: 0, borderLeft: "3px solid #3b82f6", paddingLeft: "16px" }}>
                  At Notion Worx, service and design are our strength — and your success is our goal.
                </p>
              </div>
            </div>

            {/* Specialty grid */}
            <div>
              <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#3b82f6", marginBottom: "20px" }}>What We Offer</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                {SPECIALTIES.map(s => (
                  <div key={s.label} style={{
                    background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "12px",
                    padding: "18px 16px", display: "flex", alignItems: "center", gap: "12px"
                  }}>
                    <span style={{ fontSize: "24px", flexShrink: 0 }}>{s.icon}</span>
                    <span style={{ fontWeight: 600, fontSize: "0.88rem", color: "#0f172a", lineHeight: 1.3 }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section style={{ background: "#f8fafc", padding: "80px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "520px", margin: "0 auto 48px" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#3b82f6", marginBottom: "12px" }}>Why Choose Us</p>
            <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", margin: 0 }}>
              What Sets Us Apart
            </h2>
          </div>
          <div className="about-grid-3">
            {VALUES.map(v => (
              <div key={v.title} className="about-value-card">
                <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: v.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", marginBottom: "16px" }}>
                  {v.icon}
                </div>
                <h4 style={{ fontWeight: 700, fontSize: "1rem", color: "#0f172a", marginBottom: "8px" }}>{v.title}</h4>
                <p style={{ color: "#64748b", fontSize: "0.88rem", lineHeight: 1.65, margin: 0 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


    </>
  );
}
