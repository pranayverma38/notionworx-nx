import { Metadata } from "next";
import AboutUs from "@/components/pages/about/AboutUs";

export const metadata: Metadata = {
  title: "About Us | Notion Worx",
  description:
    "At Notion Worx, we make your brand impossible to miss. Full-service design and branding company specializing in custom canopies, promotional products, apparel, and logo design.",
};

export default function AboutPage() {
  return <AboutUs />;
}
