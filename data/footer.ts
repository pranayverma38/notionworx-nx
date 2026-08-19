import type {
  FooterLinkGroup,
  FooterStore,
  FooterPaymentIcon,
} from "@/types/footer";

export const footerStore: FooterStore = {
  supportLabel: "24/7 Support Center:",
  phone: "(+01) 1234 8888",
  phoneHref: "tel:0112348888",
  address: "600 N Michigan Ave, Chicago, IL 60611, USA",
  addressHref:
    "https://www.google.com/maps?q=600+N+Michigan+Ave+Chicago,+IL+60611+USA",
  email: "hi.amere@gmail.com",
};

export const footerCompanyLinks: FooterLinkGroup = {
  title: "COMPANY",
  links: [
    { label: "About Us", href: "/about" },
    { label: "Our Stories", href: "/our-store" },
    { label: "Contact us", href: "/contact" },
    { label: "Latest New", href: "/blog" },
    { label: "My Account", href: "/account-page" },
  ],
};

export const footerCustomerLinks: FooterLinkGroup = {
  title: "CUSTOMER",
  links: [
    { label: "Shipping", href: "/shipping" },
    { label: "Return & Refund", href: "/return-and-refund" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/term-and-condition" },
    { label: "Orders FAQs", href: "/faq" },
  ],
};

/** Account links for Footer7 (modal triggers) */
export const footerAccountLinksModal: FooterLinkGroup = {
  title: "MY ACCOUNT",
  links: [
    { label: "Login", href: "#sign" },
    { label: "Sign up", href: "#register" },
    { label: "My Account", href: "/account-page" },
    { label: "Wish List", href: "/wishlist" },
  ],
};

/** Account links for Footer9 (page links) */
export const footerAccountLinksPage: FooterLinkGroup = {
  title: "MY ACCOUNT",
  links: [
    { label: "Login", href: "/login" },
    { label: "Sign up", href: "/register" },
    { label: "My Account", href: "/account-page" },
    { label: "Wish List", href: "/wishlist" },
  ],
};

export const footerPaymentIcons: FooterPaymentIcon[] = [
  { src: "/assets/images/payment/visa.svg", alt: "Visa" },
  { src: "/assets/images/payment/master-card.svg", alt: "Mastercard" },
  { src: "/assets/images/payment/amex.svg", alt: "Amex" },
  { src: "/assets/images/payment/paypal.svg", alt: "PayPal" },
  { src: "/assets/images/payment/water.svg", alt: "Payment" },
  { src: "/assets/images/payment/discover.svg", alt: "Discover" },
];
