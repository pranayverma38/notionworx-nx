import type { NextConfig } from "next";

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
    remotePatterns: [
      {
        protocol: "https",
        hostname: "review-images.judgeme.com",
      },
      {
        protocol: "https",
        hostname: "notionworxcanopy.com",
      },
      {
        protocol: "https",
        hostname: "s3.amazonaws.com",
      },
    ],
  },
  async redirects() {
    return [
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
