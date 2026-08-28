import type { ReactNode } from "react";

import Footer1 from "@/components/footers/Footer1";
import Header5 from "@/components/headers/Header5";
import AnnouncementBar from "@/components/topBars/AnnouncementBar";

type SiteShellProps = {
  children: ReactNode;
  footerContent?: ReactNode;
};

export default function SiteShell({
  children,
  footerContent,
}: SiteShellProps) {
  return (
    <>
      <AnnouncementBar />
      <Header5 />
      {children}
      {footerContent}
      <Footer1 hideTopRule />
    </>
  );
}
