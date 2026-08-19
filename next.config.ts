import type { NextConfig } from "next";

const demoHomeRoutes = [
  "home-1",
  "home-auto",
  "home-baby",
  "home-bag-accessories",
  "home-construction",
  "home-cosmetic",
  "home-decor",
  "home-electronics",
  "home-fashion",
  "home-fashion-2",
  "home-furniture",
  "home-garden",
  "home-headphone",
  "home-jewelry",
  "home-mental",
  "home-office-equipment",
  "home-organic",
  "home-pet-care",
  "home-pod",
  "home-sneaker",
  "home-sport",
] as const;

const demoShopRoutes = [
  "shop-left-sidebar",
  "shop-right-sidebar",
  "shop-full-width",
  "shop-infinity-scroll",
  "shop-load-more-button",
  "shop-filter-sidebar",
  "shop-filter-hidden",
  "shop-filter-dropdown",
  "shop-filter-drawer",
  "shop-hover-01",
  "shop-hover-02",
  "shop-hover-03",
  "shop-hover-04",
  "shop-hover-05",
  "shop-hover-06",
] as const;

const demoProductRoutes = [
  "product-right-thumbnail",
  "product-bottom-thumbnail",
  "product-grid",
  "product-grid-2",
  "product-stacked",
  "product-description-accordion",
  "product-inner-zoom",
  "product-inner-circle-zoom",
  "product-no-zoom",
  "product-external-zoom",
  "product-open-lightbox",
  "product-video",
  "product-3d",
  "product-group",
  "product-affiliate",
  "product-out-of-stock",
  "product-together",
  "product-countdown-timer",
  "product-volume-discount-thumbnail",
  "product-available",
  "product-pre-order",
  "product-deals",
  "product-customer-note",
  "product-buyx-gety",
  "product-swatch-color",
  "product-swatch-image",
  "product-swatch-rounded",
  "product-swatch-rounded-color",
  "product-swatch-rounded-image",
  "product-swatch-dropdown",
  "product-swatch-dropdown-color",
] as const;

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      ...demoHomeRoutes.map((source) => ({
        source: `/${source}`,
        destination: "/",
        permanent: false,
      })),
      ...demoShopRoutes.map((source) => ({
        source: `/${source}`,
        destination: "/shop-default",
        permanent: false,
      })),
      {
        source: "/shop-sub-collection",
        destination: "/collection",
        permanent: false,
      },
      ...demoProductRoutes.map((source) => ({
        source: `/${source}/:id`,
        destination: "/product-detail/:id",
        permanent: false,
      })),
      {
        source: "/blog",
        destination: "/about",
        permanent: false,
      },
      {
        source: "/blog-single",
        destination: "/about",
        permanent: false,
      },
      {
        source: "/blog-single/:id",
        destination: "/about",
        permanent: false,
      },
      {
        source: "/compare",
        destination: "/shop-default",
        permanent: false,
      },
      {
        source: "/invoice",
        destination: "/account-page",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
