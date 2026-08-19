import type { ReactNode } from "react";

import CloseNavDropdownsOnRoute from "@/components/headers/CloseNavDropdownsOnRoute";

export default function HomesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <CloseNavDropdownsOnRoute />
      {children}
    </>
  );
}
