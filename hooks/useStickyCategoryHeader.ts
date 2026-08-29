import { useCallback } from "react";

const HEADER_TOP_TRANSITION = "top 0.3s ease-in-out";

export type UseStickyCategoryHeaderOptions = {
  scrollThreshold?: number;
  hiddenTop?: string;
  closeGraceMs?: number;
};

export function useStickyCategoryHeader(
  _options: UseStickyCategoryHeaderOptions = {},
) {
  const toggleBottomNav = useCallback(() => {
    // The header no longer collapses or reappears on scroll.
  }, []);

  const headerStyle = {
    top: "0px",
    transition: HEADER_TOP_TRANSITION,
  } as const;

  return {
    headerSticky: false,
    isBottomNavOpen: false,
    toggleBottomNav,
    showHeaderBottom: true,
    headerStyle,
    stickyHeaderClassName: "",
  };
}
