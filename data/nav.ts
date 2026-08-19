export interface NavHomeLink {
  href: string;
  text: string;
  /** Optional label: "Hot" | "New" | "Trend" */
  label?: "hot" | "new" | "trend";
}

/** Home submenu links (mega menu), in 3 columns. */
export const navHomeLinks: NavHomeLink[][] = [
  [
    { href: "/", text: "Main Demo", label: "hot" },
    { href: "/home-mental", text: "Home Mental", label: "new" },
    { href: "/home-electronics", text: "Home Electronics" },
    { href: "/home-pod", text: "Home POD", label: "new" },
    { href: "/home-pet-care", text: "Home Pet Care", label: "trend" },
    { href: "/home-baby", text: "Home Baby", label: "hot" },
    { href: "/home-auto", text: "Home Auto", label: "new" },
  ],
  [
    { href: "/home-decor", text: "Home Decor", label: "new" },
    { href: "/home-cosmetic", text: "Home Cosmetic" },
    { href: "/home-organic", text: "Home Organic", label: "hot" },
    { href: "/home-fashion", text: "Home Fashion", label: "trend" },
    { href: "/home-headphone", text: "Home Headphone" },
    { href: "/home-jewelry", text: "Home Jewelry", label: "hot" },
    { href: "/home-garden", text: "Home Garden", label: "new" },
  ],
  [
    { href: "/home-construction", text: "Home Construct" },
    { href: "/home-furniture", text: "Home Furniture", label: "hot" },
    { href: "/home-fashion-2", text: "Home Fashion 2", label: "trend" },
    { href: "/home-bag-accessories", text: "Home Bag", label: "new" },
    { href: "/home-sport", text: "Home Sport", label: "hot" },
    { href: "/home-office-equipment", text: "Home Office" },
    { href: "/home-sneaker", text: "Home Sneaker", label: "trend" },
  ],
];


export const navShop = [
  {
    "title": "SHOP LAYOUT",
    "links": [
      {
        "href": "/shop-default",
        "text": "Default"
      },
      {
        "href": "/shop-left-sidebar",
        "text": "Left Sidebar"
      },
      {
        "href": "/shop-right-sidebar",
        "text": "Right Sidebar"
      },
      {
        "href": "/shop-full-width",
        "text": "Full Width"
      },
      {
        "href": "/collection",
        "text": "Collection List"
      },
      {
        "href": "/shop-sub-collection",
        "text": "Sub Collection"
      }
    ]
  },
  {
    "title": "SHOP FEATURE",
    "links": [
      {
        "href": "/shop-default",
        "text": "Pagination Link"
      },
      {
        "href": "/shop-load-more-button",
        "text": "Pagination Loadmore"
      },
      {
        "href": "/shop-infinity-scroll",
        "text": "Infinite Scroll"
      },
      {
        "href": "/shop-filter-sidebar",
        "text": "Filter Sidebar"
      },
      {
        "href": "/shop-filter-hidden",
        "text": "Filter Hidden"
      },
      {
        "href": "/shop-filter-dropdown",
        "text": "Filter Dropdown"
      },
      {
        "href": "/shop-filter-drawer",
        "text": "Filter Drawer"
      }
    ]
  },
  {
    "title": "PRODUCT HOVER",
    "links": [
      {
        "href": "/shop-hover-01",
        "text": "Product Style 01"
      },
      {
        "href": "/shop-hover-02",
        "text": "Product Style 02"
      },
      {
        "href": "/shop-hover-03",
        "text": "Product Style 03"
      },
      {
        "href": "/shop-hover-04",
        "text": "Product Style 04"
      },
      {
        "href": "/shop-hover-05",
        "text": "Product Style 05"
      },
      {
        "href": "/shop-hover-06",
        "text": "Product Style 06"
      }
    ]
  },
  {
    "title": "MY PAGES",
    "links": [
      {
        "href": "/wishlist",
        "text": "Wish List"
      },
      {
        "href": "/search-result",
        "text": "Search Result"
      },
      {
        "href": "/view-cart",
        "text": "View Cart"
      },
      {
        "href": "/login",
        "text": "Login/Register"
      },
      {
        "href": "/forget-password",
        "text": "Forget Password"
      },
      {
        "href": "/track-order",
        "text": "Order Tracking"
      },
      {
        "href": "/account-page",
        "text": "My Account"
      }
    ]
  }
];
export const navProduct = [
  {
    "title": "PRODUCT LAYOUT",
    "links": [
      {
        "href": "/product-detail/1",
        "text": "Product Default"
      },
      {
        "href": "/product-right-thumbnail/1",
        "text": "Right Thumbnail"
      },
      {
        "href": "/product-bottom-thumbnail/1",
        "text": "Bottom Thumbnail"
      },
      {
        "href": "/product-grid/1",
        "text": "Product Grid"
      },
      {
        "href": "/product-grid-2/1",
        "text": "Product Grid 2"
      },
      {
        "href": "/product-stacked/1",
        "text": "Product Stacked"
      },
      {
        "href": "/product-description-accordion/1",
        "text": "Description Accordion"
      }
    ]
  },
  {
    "title": "PRODUCT DETAIL",
    "links": [
      {
        "href": "/product-inner-zoom/1",
        "text": "Inner Zoom"
      },
      {
        "href": "/product-inner-circle-zoom/1",
        "text": "Inner Circle Zoom"
      },
      {
        "href": "/product-no-zoom/1",
        "text": "No Zoom"
      },
      {
        "href": "/product-external-zoom/1",
        "text": "External Zoom"
      },
      {
        "href": "/product-open-lightbox/1",
        "text": "Open Lightbox"
      },
      {
        "href": "/product-video/1",
        "text": "Product Video"
      },
      {
        "href": "/product-3d/1",
        "text": "Product 3D/AR"
      },
      {
        "href": "/product-group/1",
        "text": "Product Group"
      },
      {
        "href": "/product-affiliate/1",
        "text": "Product Affiliate"
      },
      {
        "href": "/product-out-of-stock/1",
        "text": "Out Of Stock"
      }
    ]
  },
  {
    "title": "PRODUCT FEATURE",
    "links": [
      {
        "href": "/product-together/1",
        "text": "Buy Together"
      },
      {
        "href": "/product-countdown-timer/1",
        "text": "Countdown Timer"
      },
      {
        "href": "/product-volume-discount-thumbnail/1",
        "text": "Discount Thumbnail"
      },
      {
        "href": "/product-available/1",
        "text": "Pickup Avaiable"
      },
      {
        "href": "/product-pre-order/1",
        "text": "Pre Order"
      },
      {
        "href": "/product-deals/1",
        "text": "Deals"
      },
      {
        "href": "/product-customer-note/1",
        "text": "Customer Note"
      },
      {
        "href": "/product-buyx-gety/1",
        "text": "Buy X Get Y"
      }
    ]
  },
  {
    "title": "PRODUCT SWATCH",
    "links": [
      {
        "href": "/product-swatch-color/1",
        "text": "Swatch Color"
      },
      {
        "href": "/product-swatch-image/1",
        "text": "Swatch Image"
      },
      {
        "href": "/product-swatch-rounded/1",
        "text": "Swatch Rounded"
      },
      {
        "href": "/product-swatch-rounded-color/1",
        "text": "Rounded Color"
      },
      {
        "href": "/product-swatch-rounded-image/1",
        "text": "Rounded Image"
      },
      {
        "href": "/product-swatch-dropdown/1",
        "text": "Dropdown"
      },
      {
        "href": "/product-swatch-dropdown-color/1",
        "text": "Dropdown Color"
      }
    ]
  }
];
export const navBlog = [
  {
    "href": "/blog",
    "text": "Blog"
  },
  {
    "href": "/blog-single/1",
    "text": "Blog Single"
  }
];
export const navPages = [
  {
    "href": "/about",
    "text": "About Us"
  },
  {
    "href": "/contact",
    "text": "Contact Us"
  },
  {
    "href": "/our-store",
    "text": "Our Store"
  },
  {
    "href": "/invoice",
    "text": "Invoice"
  },
  {
    "href": "/404",
    "text": "404"
  },
  {
    "href": "/compare",
    "text": "Compare"
  },
  {
    "href": "/account-page",
    "text": "My Account"
  }
];
