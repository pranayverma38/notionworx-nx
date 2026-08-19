import type { DetailedHTMLProps, HTMLAttributes } from "react";

type ModelViewerElementProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement> & {
    src?: string;
    poster?: string;
    alt?: string;
    "camera-controls"?: string;
    "auto-rotate"?: string;
    reveal?: string;
    ar?: string;
    "ar-modes"?: string;
    "ar-scale"?: string;
    "ar-placement"?: string;
    "ar-status"?: string;
    "ios-src"?: string;
    "touch-action"?: string;
    "disable-zoom"?: string;
    "variant-name"?: string;
    toggleable?: string;
    "data-model-id"?: string;
    "data-js-focus-visible"?: string;
    tabindex?: string;
  },
  HTMLElement
>;

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": ModelViewerElementProps;
    }
  }
}

export {};
