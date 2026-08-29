import { useEffect, useRef, useState } from "react";

const DEFAULT_THRESHOLD = 250;
const SCROLL_DIRECTION_DEADZONE = 6;
const SHOW_STICKY_AFTER_SCROLL_UP = 36;
const HIDE_STICKY_AFTER_SCROLL_DOWN = 24;

/**
 * Adds `header-sticky` behavior: true when scrollY > threshold and user scrolls up.
 * Small scroll deltas are ignored, and direction changes must accumulate a bit
 * before the state flips so the header doesn't chatter on trackpads/smooth scroll.
 */
export function useHeaderSticky(threshold: number = DEFAULT_THRESHOLD) {
  const [isSticky, setIsSticky] = useState(false);
  const lastScrollY = useRef(0);
  const stickyRef = useRef(false);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    stickyRef.current = false;
    let upwardDistance = 0;
    let downwardDistance = 0;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY.current;

      if (Math.abs(delta) < SCROLL_DIRECTION_DEADZONE) {
        return;
      }

      lastScrollY.current = y;

      if (y <= threshold) {
        upwardDistance = 0;
        downwardDistance = 0;
        if (stickyRef.current) {
          stickyRef.current = false;
          setIsSticky(false);
        }
        return;
      }

      if (delta < 0) {
        downwardDistance = 0;
        upwardDistance += Math.abs(delta);

        if (
          !stickyRef.current &&
          upwardDistance >= SHOW_STICKY_AFTER_SCROLL_UP
        ) {
          stickyRef.current = true;
          upwardDistance = 0;
          setIsSticky(true);
        }
        return;
      }

      upwardDistance = 0;
      downwardDistance += delta;

      if (
        stickyRef.current &&
        downwardDistance >= HIDE_STICKY_AFTER_SCROLL_DOWN
      ) {
        stickyRef.current = false;
        downwardDistance = 0;
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return isSticky;
}
