
import {
  storefrontCategories,
  storefrontProducts,
} from "@/data/inventory/notionworx/storefront.generated";

export interface AboutStat {
  prefix?: string;
  suffix?: string;
  number: number;
  title: string;
  sub: string;
}

export const aboutStats: AboutStat[] = [
  {
    number: storefrontProducts.length,
    title: "Products Mirrored",
    sub: "Imported into local inventory with local product images for the storefront experience.",
  },
  {
    number: storefrontCategories.length,
    title: "Collections Live",
    sub: "Searchable categories now powering navigation, collection pages, and shop filters.",
  },
  {
    number: 100,
    suffix: "%",
    title: "Local Image Coverage",
    sub: "Primary customer-facing flows now use mirrored assets instead of remote legacy imagery.",
  },
  {
    number: 4,
    title: "Core Journeys Unified",
    sub: "Homepage, collections, shop, and product detail now share one consistent catalog source.",
  },
];
