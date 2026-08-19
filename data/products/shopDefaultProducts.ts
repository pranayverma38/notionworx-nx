/** Optional: brands that cannot be selected (theme applies `list-item.disabled`, low opacity). */
export const shopFilterDisabledBrands: ReadonlySet<string> = new Set();

export const shopFilterTags: { label: string; tag: string }[] = [
  { label: "Featured", tag: "featured" },
  { label: "Best Sellers", tag: "best-seller" },
  { label: "Top Rated", tag: "top-rated" },
  { label: "New", tag: "new" },
  { label: "Popular", tag: "popular" },
];
