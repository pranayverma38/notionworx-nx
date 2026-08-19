import { useCallback, useEffect, useRef, useState } from "react";

import { useHeaderSticky } from "@/hooks/useHeaderSticky";

const DEFAULT_CLOSE_GRACE_MS = 350;
const DEFAULT_HIDDEN_TOP = "-160px";
const HEADER_TOP_TRANSITION = "top 0.3s ease-in-out";

export type UseStickyCategoryHeaderOptions = {
  scrollThreshold?: number;
  hiddenTop?: string;
  closeGraceMs?: number;
};

export function useStickyCategoryHeader(
  options: UseStickyCategoryHeaderOptions = {},
) {
  const {
    scrollThreshold,
    hiddenTop = DEFAULT_HIDDEN_TOP,
    closeGraceMs = DEFAULT_CLOSE_GRACE_MS,
  } = options;

  const stickyFromScroll = useHeaderSticky(scrollThreshold);
  const [isBottomNavOpen, setIsBottomNavOpen] = useState(false);
  const [stickyCloseGrace, setStickyCloseGrace] = useState(false);
  const menuOpenRef = useRef(false);
  const graceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (graceTimerRef.current) clearTimeout(graceTimerRef.current);
    };
  }, []);

  const toggleBottomNav = useCallback(() => {
    const wasOpen = menuOpenRef.current;
    const nextOpen = !wasOpen;
    menuOpenRef.current = nextOpen;
    setIsBottomNavOpen(nextOpen);

    if (wasOpen) {
      if (graceTimerRef.current) clearTimeout(graceTimerRef.current);
      setStickyCloseGrace(true);
      graceTimerRef.current = setTimeout(() => {
        setStickyCloseGrace(false);
        graceTimerRef.current = null;
      }, closeGraceMs);
    } else {
      if (graceTimerRef.current) {
        clearTimeout(graceTimerRef.current);
        graceTimerRef.current = null;
      }
      setStickyCloseGrace(false);
    }
  }, [closeGraceMs]);

  const headerSticky =
    stickyFromScroll || isBottomNavOpen || stickyCloseGrace;

  const showHeaderBottom = !headerSticky || isBottomNavOpen;

  const headerStyle = {
    top: headerSticky ? "0px" : hiddenTop,
    transition: HEADER_TOP_TRANSITION,
  } as const;

  return {
    headerSticky,
    isBottomNavOpen,
    toggleBottomNav,
    showHeaderBottom,
    headerStyle,
    stickyHeaderClassName: headerSticky ? " header-sticky" : "",
  };
}
