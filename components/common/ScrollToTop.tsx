"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

const SHOW_AFTER_PX = 500;

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [progressAngle, setProgressAngle] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const maxScroll = Math.max(docHeight - viewportHeight, 1);
      const progress = Math.min(Math.max(scrollTop / maxScroll, 0), 1);

      setIsVisible(scrollTop > SHOW_AFTER_PX);
      setProgressAngle(progress * 360);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <button
      id="goTop"
      type="button"
      className={isVisible ? "show" : ""}
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <span
        className="border-progress"
        style={{ "--progress-angle": `${progressAngle}deg` } as CSSProperties}
      />
      <span className="ic-wrap">
        <span className="icon icon-CaretTopThin" />
      </span>
    </button>
  );
}
