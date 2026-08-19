import type { Metadata } from "next";

import {
  AMERCE_DEFAULT_DESCRIPTION,
  AMERCE_SITE_TITLE,
} from "@/lib/metadata/shop-product";

/** Default copy for Tops & Shirts–style shop listing routes */
export const SHOP_LISTING_DESCRIPTION =
  "Browse the Tops & Shirts collection with filters, sorting, and grid or list view.";

/**
 * Metadata for routes under `app/(shop)` where the layout uses
 * `title.template` — pass only the page segment (no site name).
 */
export function shopRouteMetadata(
  titleSegment: string,
  description: string = AMERCE_DEFAULT_DESCRIPTION,
): Metadata {
  const desc = description.trim().slice(0, 160);
  const absoluteTitle = `${titleSegment} | ${AMERCE_SITE_TITLE}`;
  return {
    title: titleSegment,
    description: desc,
    openGraph: {
      title: absoluteTitle,
      description: desc,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: absoluteTitle,
      description: desc,
    },
  };
}
