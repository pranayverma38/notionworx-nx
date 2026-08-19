export interface TopBarSlide {
  text: string;
  /** Optional icon class (e.g. "icon-SealPercent") for first slide variant */
  icon?: string;
}

export const topBarSlides: TopBarSlide[] = [
  {
    text: "Midseason Sale: 20% Off - Auto Applied at Checkout - Limited Time Only",
    icon: "icon-SealPercent",
  },
  {
    text: "20% Off - Auto Applied at Checkout - Limited Time Only",
  },
];
