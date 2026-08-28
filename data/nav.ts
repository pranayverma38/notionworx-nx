export interface NavHomeLink {
  href: string;
  text: string;
  /** Optional label: "Hot" | "New" | "Trend" */
  label?: "hot" | "new" | "trend";
}

export interface NavMenuGroup {
  title: string;
  links: { href: string; text: string }[];
}

function splitIntoColumns<T>(items: T[], columns: number): T[][] {
  const perColumn = Math.ceil(items.length / columns);
  return Array.from({ length: columns }, (_, index) =>
    items.slice(index * perColumn, (index + 1) * perColumn),
  );
}

const homeLinks: NavHomeLink[] = [
  { href: "/", text: "Home Baby", label: "hot" },
  { href: "/home-1", text: "Home 1", label: "new" },
  { href: "/home-fashion", text: "Home Fashion" },
  { href: "/home-fashion-2", text: "Home Fashion 2" },
  { href: "/home-cosmetic", text: "Home Cosmetic" },
  { href: "/home-sneaker", text: "Home Sneaker" },
  { href: "/home-bag-accessories", text: "Home Bag Accessories" },
  { href: "/home-furniture", text: "Home Furniture" },
  { href: "/home-electronics", text: "Home Electronics" },
  { href: "/home-headphone", text: "Home Headphone" },
  { href: "/home-jewelry", text: "Home Jewelry" },
  { href: "/home-garden", text: "Home Garden" },
  { href: "/home-organic", text: "Home Organic" },
  { href: "/home-sport", text: "Home Sport" },
  { href: "/home-mental", text: "Home Mental" },
  { href: "/home-pet-care", text: "Home Pet Care" },
  { href: "/home-construction", text: "Home Construction" },
  { href: "/home-auto", text: "Home Auto" },
  { href: "/home-office-equipment", text: "Home Office Equipment" },
  { href: "/home-pod", text: "Home POD" },
  { href: "/home-decor", text: "Home Decor" },
];

/** Collection submenu links (mega menu), in 3 columns. */
export const navHomeLinks: NavHomeLink[][] = splitIntoColumns(
  homeLinks,
  3,
);


export const navShop: NavMenuGroup[] = [
  {
    title: "CATALOG",
    links: [
      { href: "/shop-default", text: "Shop Default" },
      { href: "/collection", text: "Collections" },
      { href: "/shop-sub-collection", text: "Shop Sub Collection" },
      { href: "/search-result", text: "Search Result" },
      { href: "/wishlist", text: "Wishlist" },
      { href: "/view-cart", text: "View Cart" },
    ],
  },
  {
    title: "LAYOUTS",
    links: [
      { href: "/shop-left-sidebar", text: "Shop Left Sidebar" },
      { href: "/shop-right-sidebar", text: "Shop Right Sidebar" },
      { href: "/shop-full-width", text: "Shop Full Width" },
      { href: "/shop-filter-hidden", text: "Shop Filter Hidden" },
      { href: "/shop-filter-sidebar", text: "Shop Filter Sidebar" },
      { href: "/shop-filter-drawer", text: "Shop Filter Drawer" },
    ],
  },
  {
    title: "FILTERS & CARDS",
    links: [
      { href: "/shop-filter-dropdown", text: "Shop Filter Dropdown" },
      { href: "/shop-hover-01", text: "Shop Hover 01" },
      { href: "/shop-hover-02", text: "Shop Hover 02" },
      { href: "/shop-hover-03", text: "Shop Hover 03" },
      { href: "/shop-hover-04", text: "Shop Hover 04" },
      { href: "/shop-hover-05", text: "Shop Hover 05" },
    ],
  },
  {
    title: "MORE SHOP",
    links: [
      { href: "/shop-hover-06", text: "Shop Hover 06" },
      { href: "/shop-load-more-button", text: "Load More Button" },
      { href: "/shop-infinity-scroll", text: "Infinity Scroll" },
      { href: "/checkout", text: "Checkout" },
      { href: "/login", text: "Login" },
      { href: "/register", text: "Register" },
    ],
  },
];
export const navProduct: NavMenuGroup[] = [
  {
    title: "PRODUCT DETAIL",
    links: [
      { href: "/product-detail/1", text: "Product Detail" },
      { href: "/product-available/1", text: "Product Available" },
      { href: "/product-pre-order/1", text: "Product Pre Order" },
      { href: "/product-deals/1", text: "Product Deals" },
      { href: "/product-customer-note/1", text: "Product Customer Note" },
      { href: "/product-countdown-timer/1", text: "Countdown Timer" },
    ],
  },
  {
    title: "MEDIA LAYOUTS",
    links: [
      { href: "/product-grid/1", text: "Product Grid" },
      { href: "/product-grid-2/1", text: "Product Grid 2" },
      { href: "/product-stacked/1", text: "Product Stacked" },
      { href: "/product-bottom-thumbnail/1", text: "Bottom Thumbnail" },
      { href: "/product-right-thumbnail/1", text: "Right Thumbnail" },
      { href: "/product-video/1", text: "Product Video" },
    ],
  },
  {
    title: "ZOOM & SWATCHES",
    links: [
      { href: "/product-inner-zoom/1", text: "Inner Zoom" },
      { href: "/product-inner-circle-zoom/1", text: "Inner Circle Zoom" },
      { href: "/product-external-zoom/1", text: "External Zoom" },
      { href: "/product-no-zoom/1", text: "No Zoom" },
      { href: "/product-swatch-color/1", text: "Swatch Color" },
      { href: "/product-swatch-rounded/1", text: "Swatch Rounded" },
      { href: "/product-swatch-rounded-color/1", text: "Swatch Rounded Color" },
    ],
  },
  {
    title: "MORE VARIANTS",
    links: [
      { href: "/product-swatch-rounded-image/1", text: "Rounded Image" },
      { href: "/product-swatch-dropdown/1", text: "Swatch Dropdown" },
      { href: "/product-swatch-dropdown-color/1", text: "Dropdown Color" },
      { href: "/product-group/1", text: "Product Group" },
      { href: "/product-affiliate/1", text: "Product Affiliate" },
      { href: "/product-together/1", text: "Product Together" },
      { href: "/product-volume-discount-thumbnail/1", text: "Volume Discount" },
      { href: "/product-buyx-gety/1", text: "Buy X Get Y" },
      { href: "/product-out-of-stock/1", text: "Out Of Stock" },
      { href: "/product-open-lightbox/1", text: "Open Lightbox" },
      { href: "/product-3d/1", text: "Product 3D" },
    ],
  },
];
export const navBlog: { href: string; text: string }[] = [
  { href: "/blog", text: "Blog Listing" },
  { href: "/blog-single/1", text: "Blog Single" },
];
export const navPages = [
  {
    href: "/about",
    text: "About",
  },
  {
    href: "/contact",
    text: "Contact",
  },
  {
    href: "/our-store",
    text: "Our Store",
  },
  {
    href: "/compare",
    text: "Compare",
  },
  {
    href: "/account-page",
    text: "My Account",
  },
  {
    href: "/account-orders",
    text: "Account Orders",
  },
  {
    href: "/account-addresses",
    text: "Account Addresses",
  },
  {
    href: "/account-setting",
    text: "Account Settings",
  },
  {
    href: "/track-order",
    text: "Track Order",
  },
  {
    href: "/forget-password",
    text: "Forget Password",
  },
];
