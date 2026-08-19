import { useEffect, useRef, useState } from "react";

const DEFAULT_THRESHOLD = 250;

/**
 * Adds `header-sticky` behavior: true when scrollY > threshold and user scrolls up.
 */
export function useHeaderSticky(threshold: number = DEFAULT_THRESHOLD) {
  const [isSticky, setIsSticky] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const scrollingUp = y < lastScrollY.current;
      lastScrollY.current = y;

      if (y > threshold && scrollingUp) {
        setIsSticky(true);
      } else if (y <= threshold || !scrollingUp) {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return isSticky;
}
