"use client";

import { useEffect, useRef, useCallback } from "react";

// Frame config
const FIRST_FRAME = 19;
const LAST_FRAME = 159;
const TOTAL_FRAMES = LAST_FRAME - FIRST_FRAME + 1; // 141
const FRAME_W = 1920;
const FRAME_H = 1080;
const SCROLL_HEIGHT = "350vh"; // how much scroll distance the animation gets

function frameUrl(index: number): string {
  const num = String(FIRST_FRAME + index).padStart(3, "0");
  return `/frames/frame_${num}.webp`;
}

export default function TentAssemblyAnimation() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const framesRef = useRef<Array<HTMLImageElement | null>>(
    Array(TOTAL_FRAMES).fill(null),
  );
  const loadedCountRef = useRef(0);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number>(0);
  const lastDrawnRef = useRef(-1);

  // ── Sizing ──────────────────────────────────────────────────────────────
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement!;
    const w = container.clientWidth;
    const h = Math.min(window.innerHeight, Math.round(w * (FRAME_H / FRAME_W)));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctxRef.current = canvas.getContext("2d");
    if (ctxRef.current) ctxRef.current.scale(dpr, dpr);
    lastDrawnRef.current = -1; // force redraw after resize
  }, []);

  // ── Draw frame ───────────────────────────────────────────────────────────
  const drawFrame = useCallback((index: number) => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    const cw = canvas.width / Math.min(window.devicePixelRatio || 1, 2);
    const ch = canvas.height / Math.min(window.devicePixelRatio || 1, 2);

    // Find nearest loaded frame
    let img = framesRef.current[index];
    if (!img) {
      // search outward for nearest loaded frame
      for (let d = 1; d < TOTAL_FRAMES; d++) {
        const lo = index - d;
        const hi = index + d;
        if (lo >= 0 && framesRef.current[lo]) { img = framesRef.current[lo]; break; }
        if (hi < TOTAL_FRAMES && framesRef.current[hi]) { img = framesRef.current[hi]; break; }
      }
    }
    if (!img) return;

    // Letter-box / contain the frame inside the canvas
    const scale = Math.min(cw / FRAME_W, ch / FRAME_H);
    const dw = FRAME_W * scale;
    const dh = FRAME_H * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  }, []);

  // ── Render loop ──────────────────────────────────────────────────────────
  const renderLoop = useCallback(() => {
    const idx = currentFrameRef.current;
    if (idx !== lastDrawnRef.current) {
      drawFrame(idx);
      lastDrawnRef.current = idx;
    }
    rafRef.current = requestAnimationFrame(renderLoop);
  }, [drawFrame]);

  // ── Scroll handler ───────────────────────────────────────────────────────
  const onScroll = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const scrollable = section.offsetHeight - window.innerHeight;
    const scrolled = Math.max(0, -rect.top);
    const progress = scrollable > 0 ? Math.min(1, scrolled / scrollable) : 0;
    currentFrameRef.current = Math.round(progress * (TOTAL_FRAMES - 1));
  }, []);

  // ── Progressive frame loader ─────────────────────────────────────────────
  const loadFrames = useCallback(() => {
    // Priority order: first, last, middle, then fill outward
    const priorityOrder: number[] = [];
    priorityOrder.push(0, TOTAL_FRAMES - 1, Math.floor(TOTAL_FRAMES / 2));
    for (let step = 4; step < TOTAL_FRAMES; step *= 2) {
      for (let i = 0; i < TOTAL_FRAMES; i += step) {
        if (!priorityOrder.includes(i)) priorityOrder.push(i);
      }
    }
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      if (!priorityOrder.includes(i)) priorityOrder.push(i);
    }

    let loadIndex = 0;
    function loadNext() {
      if (loadIndex >= priorityOrder.length) return;
      const fi = priorityOrder[loadIndex++];
      const img = new window.Image();
      img.decoding = "async";
      img.onload = () => {
        framesRef.current[fi] = img;
        loadedCountRef.current++;
        // Draw first frame as soon as it's ready
        if (fi === 0 && lastDrawnRef.current === -1) drawFrame(0);
        loadNext();
      };
      img.onerror = loadNext;
      img.src = frameUrl(fi);
    }
    // Kick off 4 parallel loaders
    loadNext(); loadNext(); loadNext(); loadNext();
  }, [drawFrame]);

  // ── Init ────────────────────────────────────────────────────────────────
  useEffect(() => {
    resizeCanvas();
    loadFrames();
    rafRef.current = requestAnimationFrame(renderLoop);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resizeCanvas, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [resizeCanvas, loadFrames, renderLoop, onScroll]);

  return (
    <section
      ref={sectionRef}
      style={{ height: SCROLL_HEIGHT, position: "relative", background: "#EBEBEB" }}
    >
      {/* Sticky viewport */}
      <div style={{
        position: "sticky", top: 0, height: "100vh", overflow: "hidden",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        background: "#EBEBEB",
      }}>
        {/* Canvas */}
        <div style={{ width: "100%", maxWidth: "1200px", padding: "0 16px" }}>
          <canvas
            ref={canvasRef}
            style={{ display: "block", width: "100%", borderRadius: "16px" }}
            aria-label="Tent assembly animation"
          />
        </div>

      </div>
    </section>
  );
}
