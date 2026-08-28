import type { Metadata } from "next";
import SiteShell from "@/components/layouts/SiteShell";
import {
  AMERCE_DEFAULT_DESCRIPTION,
  AMERCE_SITE_TITLE,
} from "@/lib/metadata/shop-product";
import StickyProduct from "@/components/shop-details/StickyProduct";

export const metadata: Metadata = {
  title: `Shop product | ${AMERCE_SITE_TITLE}`,
  description: AMERCE_DEFAULT_DESCRIPTION,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SiteShell footerContent={<StickyProduct />}>
      {children}
    </SiteShell>
  );
}

