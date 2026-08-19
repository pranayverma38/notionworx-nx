"use client";

// WOW.js disabled: also comment out `<WowInit />` in `app/layout.tsx` (done there).
// Uncomment below and restore the layout import when re-enabling.

// import { useEffect } from "react";
// import { usePathname } from "next/navigation";

export default function WowInit() {
  // const pathname = usePathname();
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     import("wowjs").then((module) => {
  //       const wow = new module.WOW({
  //         offset: 0,
  //         mobile: true,
  //         live: false,
  //       });
  //       wow.init();
  //     });
  //   }
  // }, [pathname]);

  return null;
}
