"use client";

import { useEffect } from "react";

export default function ModelViewer({ src }: { src: string }) {

  useEffect(() => {
    // Dynamically import the model-viewer package to register the custom element
    import("@google/model-viewer").then(() => {

    });
  }, []);



  return (
    <div className="tf-model-viewer active swiper-no-swiping" style={{ height: "100%", aspectRatio: "3 / 4" }}>
     
      <model-viewer
        reveal="auto"
        toggleable="true"
        data-model-id="36168614805808"
        src={src}
        camera-controls="true"
        alt="3D product model"
        poster={src}
        className="tf-model-viewer-ui"
        tabindex="1"
        data-js-focus-visible=""
        ar-status="not-presenting"
        touch-action="none"
      ></model-viewer>
     
    </div>
  );
}
