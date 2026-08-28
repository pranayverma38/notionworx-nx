"use client";

import { useState } from "react";
import Image from "next/image";

const S = `
  .cd-wrap { min-height: 100vh; background: #f8fafc; padding: 40px 0 80px; }
  .cd-layout { display: grid; grid-template-columns: 360px 1fr; gap: 24px; align-items: start; }
  @media (max-width: 900px) { .cd-layout { grid-template-columns: 1fr !important; } }

  .cd-card { background: #fff; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 28px; }

  .cd-textarea { width: 100%; min-height: 160px; resize: vertical; padding: 14px 16px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 0.9rem; font-family: inherit; outline: none; transition: border-color 0.2s, box-shadow 0.2s; background: #fff; color: #0f172a; box-sizing: border-box; line-height: 1.6; }
  .cd-textarea::placeholder { color: #94a3b8; }
  .cd-textarea:focus { border-color: #111; box-shadow: 0 0 0 3px rgba(0,0,0,0.06); }

  .cd-btn { width: 100%; background: #0f172a; color: #fff; border: none; border-radius: 12px; padding: 15px; font-size: 0.95rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: background 0.2s; text-align: center; }
  .cd-btn:hover:not(:disabled) { background: #1e3a5f; }
  .cd-btn:disabled { opacity: 0.55; cursor: not-allowed; }
  .cd-btn-note { text-align: center; font-size: 0.75rem; color: #94a3b8; margin-top: 10px; display: flex; align-items: center; justify-content: center; gap: 5px; }

  .cd-preview-card { background: #fff; border: 1.5px solid #e2e8f0; border-radius: 16px; overflow: hidden; }
  .cd-preview-header { padding: 20px 24px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
  .cd-preview-body { padding: 24px; min-height: 480px; display: flex; align-items: center; justify-content: center; }
  .cd-action-btn { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border: 1.5px solid #e2e8f0; border-radius: 8px; background: #fff; font-size: 0.82rem; font-weight: 600; color: #374151; cursor: pointer; transition: border-color 0.2s, background 0.2s; }
  .cd-action-btn:hover { border-color: #111; background: #f8fafc; }

  .cd-spinner { width: 40px; height: 40px; border: 3px solid #e2e8f0; border-top-color: #0f172a; border-radius: 50%; animation: cd-spin 0.8s linear infinite; }
  @keyframes cd-spin { to { transform: rotate(360deg); } }
  .cd-generating { display: flex; flex-direction: column; align-items: center; gap: 16px; }

  .cd-tip { background: #eff6ff; border: 1.5px solid #bfdbfe; border-radius: 10px; padding: 12px 14px; font-size: 0.8rem; color: #1e40af; line-height: 1.55; margin-bottom: 20px; }
`;

const MAX_CHARS = 500;

export default function CanopyDesigner() {
  const [description, setDescription] = useState("");
  const [generating, setGenerating] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function generate() {
    if (!description.trim()) { setError("Please describe your canopy design."); return; }
    setError("");
    setGenerating(true);
    setResultUrl(null);

    try {
      const res = await fetch("/api/generate-canopy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: description.trim() }),
      });

      const data = await res.json();
      if (!res.ok || data.error) { setError(data.error ?? "Generation failed. Please try again."); return; }

      if (data.imageUrl) { setResultUrl(data.imageUrl); }
      else if (data.imageB64) { setResultUrl(`data:image/png;base64,${data.imageB64}`); }
      else { setError("No image returned. Please try again."); }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setGenerating(false);
    }
  }

  function downloadImage() {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = "notionworx-canopy-design.png";
    a.click();
  }

  return (
    <div className="cd-wrap">
      <style>{S}</style>
      <div className="container">

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "32px" }}>
          <div style={{ width: "48px", height: "48px", background: "#111", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <h1 style={{ fontWeight: 800, fontSize: "1.35rem", color: "#0f172a", margin: 0, lineHeight: 1.2 }}>Custom Canopy Designer</h1>
            <p style={{ color: "#64748b", fontSize: "0.82rem", margin: "2px 0 0" }}>Design your branded canopy in seconds</p>
          </div>
        </div>

        <div className="cd-layout">

          {/* ── Left: Controls ── */}
          <div>
            <div className="cd-card">
              <h2 style={{ fontWeight: 800, fontSize: "1.05rem", color: "#0f172a", marginBottom: "4px" }}>Create Your Custom Canopy</h2>
              <p style={{ color: "#64748b", fontSize: "0.83rem", lineHeight: 1.6, marginBottom: "20px" }}>
                Describe your brand and design vision. We&apos;ll generate a professional canopy mockup instantly.
              </p>

              <div className="cd-tip">
                💡 <strong>Tip:</strong> Include your brand name, colors, mascot or icon, and any text you want on the canopy for the best results.
              </div>

              <div style={{ marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label style={{ fontWeight: 700, fontSize: "0.88rem", color: "#0f172a" }}>Description</label>
                <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{description.length}/{MAX_CHARS}</span>
              </div>
              <textarea className="cd-textarea" maxLength={MAX_CHARS}
                placeholder="e.g. Brand name: Monarch Dragons. Colors: purple, gold, black. Icon: fierce dragon mascot. Bold sports team canopy with dynamic swoosh patterns. Dragon mascot large on the back wall."
                value={description} onChange={e => setDescription(e.target.value)}
                style={{ marginBottom: "20px" }}
              />

              {error && <p style={{ color: "#ef4444", fontSize: "0.82rem", marginBottom: "12px" }}>{error}</p>}

              <button className="cd-btn" onClick={generate} disabled={generating || !description.trim()}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                {generating ? "Generating…" : "Create Canopy"}
              </button>
              <p className="cd-btn-note">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Your design will be generated instantly.
              </p>
            </div>
          </div>

          {/* ── Right: Preview ── */}
          <div className="cd-preview-card">
            <div className="cd-preview-header">
              <div>
                <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "#0f172a", margin: "0 0 2px" }}>Your Custom Canopy Preview</p>
                <p style={{ color: "#64748b", fontSize: "0.78rem", margin: 0 }}>Here is your designed custom canopy based on your inputs.</p>
              </div>
              {resultUrl && (
                <div style={{ display: "flex", gap: "8px" }}>
                  <button className="cd-action-btn" onClick={downloadImage}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download
                  </button>
                  <button className="cd-action-btn" onClick={async () => {
                    try { await navigator.share({ title: "My Custom Canopy", url: resultUrl }); } catch { /* cancelled */ }
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                    Share
                  </button>
                </div>
              )}
            </div>

            <div className="cd-preview-body">
              {generating ? (
                <div className="cd-generating">
                  <div className="cd-spinner" />
                  <p style={{ color: "#64748b", fontSize: "0.88rem", fontWeight: 500 }}>Designing your canopy…</p>
                  <p style={{ color: "#94a3b8", fontSize: "0.78rem", margin: 0 }}>This usually takes 15–45 seconds</p>
                </div>
              ) : resultUrl ? (
                <Image src={resultUrl} alt="Generated canopy design" width={1024} height={1024}
                  style={{ width: "100%", height: "auto", display: "block", borderRadius: "12px" }}
                  unoptimized />
              ) : (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "72px", marginBottom: "16px", opacity: 0.15 }}>⛺</div>
                  <p style={{ fontWeight: 600, color: "#374151", marginBottom: "8px" }}>Your design will appear here</p>
                  <p style={{ color: "#94a3b8", fontSize: "0.82rem", maxWidth: "260px", lineHeight: 1.6, margin: "0 auto" }}>
                    Describe your vision and click <strong>Create Canopy</strong> to generate.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
