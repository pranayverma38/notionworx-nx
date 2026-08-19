export interface TestimonialProduct {
  img: string;
  name: string;
  price: string;
  /** Optional original price for strikethrough (e.g. furniture testimonials). */
  priceOld?: string;
}

export interface TestimonialSlide {
  /** Optional when only author name + verified badge are shown (e.g. fashion-2). */
  authorImg?: string;
  authorAlt?: string;
  authorName: string;
  quote: string;
  /** Optional role/title (e.g. "Yoga Instructor"). When set, product may be omitted. */
  role?: string;
  /** Optional badge (e.g. "Verified Buyer"). */
  verifiedLabel?: string;
  product?: TestimonialProduct;
}
