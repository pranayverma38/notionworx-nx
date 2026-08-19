export interface HeroSlide {
  img: string;
  alt?: string;
  /** Optional overlay/floating image (e.g. garden hero: shown on md+ in sld-image-abs) */
  overlayImg?: string;
  /** Optional; when omitted, only title (as h1) and desc are shown (e.g. mental hero slide 1). */
  subtitle?: string;
  title: string;
  /** Optional description paragraph */
  desc?: string;
  ctaText: string;
  /** When "p", title is rendered as <p className="title_sld h1 fw-medium">; default is "h1" */
  titleTag?: "h1" | "p";
  /** Optional class for content (e.g. "text-white") */
  contentClassName?: string;
}
