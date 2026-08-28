import { useEffect, useRef, useState } from "react";

const DEFAULT_THRESHOLD = 250;
const SCROLL_DIRECTION_DEADZONE = 6;

/**
 * Adds `header-sticky` behavior: true when scrollY > threshold and user scrolls up.
 * Small scroll deltas are ignored to avoid sticky-state flicker on trackpads.
 */
export function useHeaderSticky(threshold: number = DEFAULT_THRESHOLD) {
  const [isSticky, setIsSticky] = useState(false);
  const lastScrollY = useRef(0);
  const stickyRef = useRef(false);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    stickyRef.current = false;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY.current;
      const scrollingUp = delta < 0;

      if (Math.abs(delta) < SCROLL_DIRECTION_DEADZONE) {
        return;
      }

      lastScrollY.current = y;

      if (y <= threshold) {
        if (stickyRef.current) {
          stickyRef.current = false;
          setIsSticky(false);
        }
        return;
      }

      if (scrollingUp && !stickyRef.current) {
        stickyRef.current = true;
        setIsSticky(true);
        return;
      }

      if (!scrollingUp && stickyRef.current) {
        stickyRef.current = false;
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return isSticky;
}
