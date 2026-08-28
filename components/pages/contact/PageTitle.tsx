import Link from "next/link";

export default function PageTitle() {
  return (
    <section style={{
      background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0f172a 100%)",
      padding: "80px 0 72px", position: "relative", overflow: "hidden",
    }}>
      {/* Decorative grid pattern */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.06,
        backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />
      {/* Glow orb */}
      <div style={{
        position: "absolute", top: "-80px", right: "10%", width: "400px", height: "400px",
        background: "radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)",
        borderRadius: "50%",
      }} />

      <div className="container" style={{ position: "relative" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "28px" }}>
          <Link href="/" style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", textDecoration: "none", transition: "color 0.2s" }}>Home</Link>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>›</span>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.82rem" }}>Contact Us</span>
        </div>

        <div style={{ maxWidth: "680px" }}>
          <p style={{
            fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.18em",
            textTransform: "uppercase", color: "#60a5fa", marginBottom: "16px"
          }}>Get In Touch</p>
          <h1 style={{
            fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 800, color: "#fff",
            lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: "20px"
          }}>
            Let&apos;s Build Something <span style={{ color: "#60a5fa" }}>Together</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "1.05rem", lineHeight: 1.7, maxWidth: "540px", margin: 0 }}>
            Tell us what you are building and we will point you toward the right canopy, display, flag, apparel, or accessory setup.
          </p>
        </div>
      </div>
    </section>
  );
}
