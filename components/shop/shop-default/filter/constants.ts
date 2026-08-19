import type { SortingOption } from "@/types/shopFilter";

/** Map color label → theme swatch (see static shop markup). */
export const COLOR_SWATCH: Record<string, string> = {
  Pink: "bg-peach-blush",
  Red: "bg-crimson-red",
  Beige: "bg-cream",
  Orange: "bg-flame-orange",
  Gray: "bg-sage-gray",
  Purple: "bg-rosewood",
  Brown: "bg-muted-brown",
  Blue: "bg-dark-blue-gray",
  White: "bg-white",
  Black: "bg-dark",
  Green: "bg-olive-brown",
  Various: "bg-sage-gray",
};

export const SIZE_ITEMS: {
  id: string;
  value: string;
  label: string;
  overSize?: boolean;
}[] = [
  { id: "size-xs", value: "XS", label: "XS" },
  { id: "size-s", value: "S", label: "S" },
  { id: "size-m", value: "M", label: "M" },
  { id: "size-l", value: "L", label: "L" },
  { id: "size-xl", value: "XL", label: "XL" },
  { id: "size-2xl", value: "2XL", label: "2XL" },
  { id: "size-3xl", value: "3XL", label: "3XL" },
  { id: "over-size", value: "Free Size", label: "Free Size", overSize: true },
];

export const SORT_OPTIONS: { value: SortingOption; label: string }[] = [
  { value: "Sort by (Default)", label: "Best Selling" },
  { value: "Title Ascending", label: "Alphabetically, A–Z" },
  { value: "Title Descending", label: "Alphabetically, Z–A" },
  { value: "Price Ascending", label: "Price, low to high" },
  { value: "Price Descending", label: "Price, high to low" },
];
