import type { BrowseByCategoryItem } from "@/types/browseByCategory";

const categoryHref = (category: string) =>
  `/shop-default?category=${encodeURIComponent(category)}`;

export const browseByCategoryItems: BrowseByCategoryItem[] = [
  {
    label: "PREMIUM CANOPIES",
    href: categoryHref("Custom Canopy Tents – Personalized Pop Up Tents for Events"),
    subSections: [
      {
        title: "Canopy Kits",
        links: [
          {
            label: "All Canopies",
            href: categoryHref(
              "Custom Canopy Tents – Personalized Pop Up Tents for Events",
            ),
          },
          {
            label: "5' x 5' Canopy Kit",
            href: categoryHref("5x5 Custom Canopies"),
          },
          {
            label: "10' x 10' Canopy Kit",
            href: categoryHref("10x10 Custom Canopies"),
          },
          {
            label: "10' x 15' Canopy Kit",
            href: categoryHref("10x15 Custom Canopies"),
          },
          {
            label: "10' x 20' Canopy Kit",
            href: categoryHref("10x20 Custom Canopies"),
          },
          {
            label: "Trade Show Essentials",
            href: categoryHref(
              "Trade Show Essentials – 10x10, 10x15 & 10x20 Custom Canopy Tents for Events & Exhibits",
            ),
          },
          {
            label: "Food Booth",
            href: categoryHref(
              "Custom Food Booths – 5x5, 10x10, 10x15 & 10x20 Canopy Tents",
            ),
          },
        ],
      },
    ],
  },
  {
    label: "PREMIUM FLAGS",
    href: categoryHref("FLAGS"),
  },
  {
    label: "TABLE COVERS",
    href: categoryHref("TABLE COVER"),
  },
  {
    label: "ACCESSORIES",
    href: categoryHref("Accessories"),
  },
  {
    label: "BANNERS & DISPLAYS",
    href: categoryHref("BANNERS & DISPLAYS"),
    subSections: [
      {
        title: "Displays",
        links: [
          {
            label: "BANNERS & DISPLAYS",
            href: categoryHref("BANNERS & DISPLAYS"),
          },
          { label: "SEG PRODUCTS", href: categoryHref("SEG PRODUCTS") },
        ],
      },
    ],
  },
  {
    label: "APPAREL",
    href: categoryHref("APPAREL"),
  },
];
