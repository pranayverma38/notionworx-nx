import { Metadata } from "next";

import PageTitle from "@/components/pages/contact/PageTitle";
import Map from "@/components/pages/contact/Map";
import Contact from "@/components/pages/contact/Contact";

export const metadata: Metadata = {
  title: "Contact Us | Notion Worx",
  description:
    "Contact Notion Worx for product questions, quote requests, artwork guidance, and order support.",
};

const ContactPage = () => {
  return (
    <>
      <PageTitle />
      <Map />
      <Contact />
    </>
  );
};

export default ContactPage;
