import type { ReactNode } from "react";

import SiteShell from "@/components/layouts/SiteShell";

export default function AffiliateRegistrationLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <SiteShell>{children}</SiteShell>;
}
