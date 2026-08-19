"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const BODY_CLASS = "nav-dropdown-reset";

export default function CloseNavDropdownsOnRoute() {
  const pathname = usePathname();
  const isFirstPath = useRef(true);

  useEffect(() => {
    if (isFirstPath.current) {
      isFirstPath.current = false;
      return;
    }

    document.body.classList.add(BODY_CLASS);

    let timeoutId: number | undefined;
    const endSuppress = () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
        timeoutId = undefined;
      }
      document.body.classList.remove(BODY_CLASS);
    };

    document.addEventListener("mousemove", endSuppress, { once: true });
    document.addEventListener("touchstart", endSuppress, {
      once: true,
      passive: true,
    });
    timeoutId = window.setTimeout(endSuppress, 2500);

    return () => {
      document.removeEventListener("mousemove", endSuppress);
      document.removeEventListener("touchstart", endSuppress);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      document.body.classList.remove(BODY_CLASS);
    };
  }, [pathname]);

  return null;
}
