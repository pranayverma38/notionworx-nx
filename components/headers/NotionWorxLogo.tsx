"use client";

import Image from "next/image";

/**
 * NotionWorx logo with a slow, looping glare/sheen that sweeps diagonally.
 * The glare is a pure-CSS overlay — no JS, no extra dependencies.
 */
export default function NotionWorxLogo({ width = 240 }: { width?: number }) {
  return (
    <>
      <style>{`
        .nwx-logo-wrap {
          position: relative;
          display: block;
          overflow: hidden;
          border-radius: 4px;
          width: clamp(170px, 20vw, ${width}px);
        }
        .nwx-logo-wrap img {
          width: 100%;
          height: auto;
          display: block;
          max-width: none;
        }
        .nwx-logo-wrap::after {
          content: "";
          position: absolute;
          top: -60%;
          left: -80%;
          width: 55%;
          height: 220%;
          background: linear-gradient(
            105deg,
            transparent 20%,
            rgba(255, 255, 255, 0.08) 35%,
            rgba(255, 255, 255, 0.55) 50%,
            rgba(255, 255, 255, 0.08) 65%,
            transparent 80%
          );
          transform: skewX(-15deg);
          animation: nwx-glare 4.5s ease-in-out infinite;
          pointer-events: none;
          z-index: 2;
        }
        @keyframes nwx-glare {
          0%   { left: -80%; opacity: 0; }
          8%   { opacity: 1; }
          55%  { left: 130%; opacity: 1; }
          65%  { opacity: 0; }
          100% { left: 130%; opacity: 0; }
        }
      `}</style>
      <span className="nwx-logo-wrap">
        <Image
          priority
          width={500}
          height={212}
          src="/assets/images/logo/Notion_Worx_LOGO_3D_no_lights.webp"
          alt="Notion Worx"
        />
      </span>
    </>
  );
}
