"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

const imgNoDragStyle: CSSProperties = {
  userSelect: "none",
  WebkitUserSelect: "none",
  ...({ WebkitUserDrag: "none" } as CSSProperties),
};

export type BannerImageCompareSliderProps = {
  beforeSrc: string;
  afterSrc: string;
  /** Defaults to `image-compare` */
  id?: string;
};

export default function BannerImageCompareSlider({
  beforeSrc,
  afterSrc,
  id = "image-compare",
}: BannerImageCompareSliderProps) {
  const [pos, setPos] = useState(50);
  const wrapRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.width <= 0) return;
    const p = ((clientX - r.left) / r.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      e.preventDefault();
      setFromClientX(e.clientX);
    };
    const onUp = (e: PointerEvent) => {
      dragging.current = false;
      const el = wrapRef.current;
      if (el?.releasePointerCapture) {
        try {
          el.releasePointerCapture(e.pointerId);
        } catch {
          /* not capturing this pointer */
        }
      }
    };
    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [setFromClientX]);

  return (
    <div
      ref={wrapRef}
      id={id}
      className="icv icv__icv--horizontal img-viewer-compare-wrap image-compare w-100 overflow-hidden"
      style={{
        cursor: "col-resize",
        touchAction: "none",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
      onPointerDown={(e) => {
        e.preventDefault();
        dragging.current = true;
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
        setFromClientX(e.clientX);
      }}
      onDragStart={(e) => e.preventDefault()}
    >
      <div
        className="position-relative w-100"
        style={{
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
      >
        <Image
          className="icv__img icv__img-a img-comp d-block w-100"
          src={afterSrc}
          alt=""
          width={1920}
          height={720}
          sizes="100vw"
          priority={false}
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          style={{
            height: "auto",
            verticalAlign: "top",
            objectFit: "cover",
            ...imgNoDragStyle,
          }}
        />
        <div
          className="position-absolute top-0 start-0 overflow-hidden"
          style={{
            zIndex: 2,
            width: "100%",
            height: "100%",
            clipPath: `inset(0 ${100 - pos}% 0 0)`,
            pointerEvents: "none",
          }}
        >
          <Image
            src={beforeSrc}
            alt=""
            width={1920}
            height={720}
            sizes="100vw"
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center center",
              ...imgNoDragStyle,
            }}
          />
        </div>
        <span className="icv__label icv__label-before">Before</span>
        <span className="icv__label icv__label-after">After</span>
        <div
          className="icv__control"
          style={{
            left: `${pos}%`,
            transform: "translateX(-50%)",
            pointerEvents: "none",
          }}
        >
          <div className="icv__control-line" aria-hidden />
          <div className="icv__circle" aria-hidden>
            <span className="banner-image-compare__grip-mid" />
          </div>
          <div className="icv__control-line" aria-hidden />
        </div>
      </div>
    </div>
  );
}
