import { browseByCategoryItems } from "@/data/browseByCategory";

export interface SiteNavItem {
  label: string;
  href?: string;
  children?: SiteNavItem[];
}

const categoryHref = (category: string) =>
  `/shop-default?category=${encodeURIComponent(category)}`;

export const notionWorxMainMenuItems: SiteNavItem[] = [
  {
    label: "PROMO PRODUCTS",
    href: "/collection",
  },
  {
    label: "UPLOAD ART",
    href: "/contact",
  },
  {
    label: "NEWS",
    href: "/blog",
  },
  {
    label: "GALLERY",
    children: [
      { label: "Mockups", href: categoryHref("Mockups") },
      { label: "Car Club", href: categoryHref("Car Club") },
      { label: "Food Booth", href: categoryHref("Food Booth") },
      { label: "Cuisine", href: categoryHref("Food") },
      { label: "Kennels", href: categoryHref("Kennels") },
      { label: "Corporate", href: categoryHref("Corporate") },
      { label: "Retail Store", href: categoryHref("Retail Store") },
      { label: "Clothing Brand", href: categoryHref("Clothing Brand") },
      { label: "Dispensary", href: categoryHref("Dispensary") },
      { label: "Athletic", href: categoryHref("Athletic") },
      { label: "Detail Shop", href: categoryHref("Detail Shop") },
      { label: "Non profit", href: categoryHref("Non profit") },
    ],
  },
  {
    label: "CONTACT",
    href: "/contact",
  },
  {
    label: "ABOUT US",
    href: "/about",
  },
];

export const notionWorxMobileMenuItems: SiteNavItem[] = [
  ...browseByCategoryItems.map((item) => ({
    label: item.label,
    href: item.href,
    children: item.subSections?.flatMap((section) =>
      section.links.map((link) => ({
        label: link.label,
        href: link.href,
      })),
    ),
  })),
  ...notionWorxMainMenuItems,
];
