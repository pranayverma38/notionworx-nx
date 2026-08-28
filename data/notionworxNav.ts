import { browseByCategoryItems } from "@/data/browseByCategory";
import { galleryCollections, getGalleryHref } from "@/data/galleryCollections";

export interface SiteNavItem {
  label: string;
  href?: string;
  newTab?: boolean;
  children?: SiteNavItem[];
}

const promoProductsHref = "https://www.notionworx.com/";

export const notionWorxMainMenuItems: SiteNavItem[] = [
  {
    label: "PROMO PRODUCTS",
    href: promoProductsHref,
    newTab: true,
  },
  {
    label: "UPLOAD ART",
    href: "/uploadart",
  },
  {
    label: "DESIGNER TOOL",
    href: "/designer",
  },
  {
    label: "GALLERY",
    children: galleryCollections.map((collection) => ({
      label: collection.label,
      href: getGalleryHref(collection.slug),
    })),
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
