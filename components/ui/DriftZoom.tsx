"use client";
import Image, { ImageProps } from "next/image";
import { useEffect, useRef } from "react";
import Drift from "drift-zoom";
import { useProduct } from "@/context/ProductContext";

interface DriftZoomProps extends Omit<ImageProps, "alt"> {
  dataZoom: string;
  alt?: string;
}

type DriftInstance = { destroy: () => void };

const DriftZoom: React.FC<DriftZoomProps> = ({
  dataZoom,
  alt = "",
  ...props
}) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const { pane, setIsZooming, zoomType } = useProduct();

  useEffect(() => {
    if (!imgRef.current || !pane) return;

    let drift: DriftInstance | null = null;

    const setupDrift = () => {
      const isLargeScreen = window.matchMedia("(min-width: 1200px)").matches;
      if (isLargeScreen && zoomType !== "none") {
        if (!drift) {
          drift = new Drift(imgRef.current!, {
            paneContainer:
              zoomType === "inner"
                ? imgRef.current?.parentElement
                : (pane as HTMLElement),
            zoomFactor: 2,
            inlinePane: zoomType === "magnifying",
            handleTouch: false,
            hoverBoundingBox: zoomType === "default",
            containInline: true,
          });
        }
      } else {
        if (drift) {
          drift.destroy();
          drift = null;
        }
      }
    };

    setupDrift();
    window.addEventListener("resize", setupDrift);

    return () => {
      window.removeEventListener("resize", setupDrift);
      if (drift) {
        drift.destroy();
      }
    };
  }, [pane, props.src, zoomType]); // Re-initialize if pane, source, or zoomType changes

  const handleMouseEnter = () => {
    if (zoomType !== "none") setIsZooming(true);
  };
  const handleMouseLeave = () => {
    if (zoomType !== "none") setIsZooming(false);
  };

  return (
    <Image
      ref={(el) => {
        imgRef.current = el as HTMLImageElement | null;
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-zoom={dataZoom}
      alt={alt}
      {...props}
    />
  );
};

export default DriftZoom;
