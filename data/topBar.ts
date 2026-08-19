export interface TopBarSlide {
  text: string;
  /** Optional icon class (e.g. "icon-SealPercent") for first slide variant */
  icon?: string;
}

export const topBarSlides: TopBarSlide[] = [
  {
    text: "Notion Worx storefront now runs on local inventory and mirrored product images.",
    icon: "icon-SealPercent",
  },
  {
    text: "Request custom quotes for canopies, displays, flags, apparel, and event branding.",
  },
];
