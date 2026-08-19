import { useLayoutEffect, useState } from "react";

export const LOOKBOOK_DROPDOWN_MOBILE_MAX_PX = 991;

export type LookbookDropdownDesktopPlacement = "dropend" | "dropstart";

export function useMatchesMaxWidth(
  maxWidthPx: number = LOOKBOOK_DROPDOWN_MOBILE_MAX_PX,
): boolean {
  const [matches, setMatches] = useState(false);

  useLayoutEffect(() => {
    const query = `(max-width: ${maxWidthPx}px)`;
    const mq = window.matchMedia(query);
    const sync = () => setMatches(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [maxWidthPx]);

  return matches;
}

export function useIsNarrowLookbookDropdownViewport(): boolean {
  return useMatchesMaxWidth();
}

export function lookbookDropdownPlacementClass(
  desktop: LookbookDropdownDesktopPlacement,
  narrow: boolean,
): LookbookDropdownDesktopPlacement | "dropup" {
  return narrow ? "dropup" : desktop;
}
