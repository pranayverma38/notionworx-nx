import type { Metadata } from "next";
import SiteShell from "@/components/layouts/SiteShell";

import {
  AMERCE_DEFAULT_DESCRIPTION,
  AMERCE_SITE_TITLE,
} from "@/lib/metadata/shop-product";

export const metadata: Metadata = {
  title: {
    template: `%s | ${AMERCE_SITE_TITLE}`,
    default: `Shop | ${AMERCE_SITE_TITLE}`,
  },
  description: AMERCE_DEFAULT_DESCRIPTION,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
