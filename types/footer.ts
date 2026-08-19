export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterLinkGroup {
  title: string;
  links: FooterLink[];
}

export interface FooterStore {
  supportLabel: string;
  phone: string;
  phoneHref: string;
  address: string;
  addressHref: string;
  email: string;
}

export interface FooterPaymentIcon {
  src: string;
  alt: string;
}
