
export interface AboutStat {
  prefix?: string;
  suffix?: string;
  number: number;
  title: string;
  sub: string;
}

export const aboutStats: AboutStat[] = [
  {
    number: 8.2,
    suffix: "k",
    title: "Products Available",
    sub: "We offer a wide selection of high-quality products to meet every need.",
  },
  {
    number: 10,
    suffix: "k",
    title: "Happy Customers",
    sub: "Serving over 10,000 delighted customers who trust us for quality and service.",
  },
  {
    number: 96,
    title: "Partner Brand",
    sub: "Our top-brand partnerships bring a trusted collection for your kitchen and home.",
  },
  {
    number: 16,
    suffix: "k",
    title: "Products For Sale",
    sub: "That's why we strive to offer a diverse range of products that cater to all styles.",
  },
];
