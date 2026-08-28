import { Metadata } from "next";

import Contact from "@/components/pages/contact/Contact";

export const metadata: Metadata = {
  title: "Contact Us | Notion Worx",
  description:
    "Contact Notion Worx for product questions, quote requests, artwork guidance, and order support.",
};

const ContactPage = () => {
  return (
    <>
      <Contact />
    </>
  );
};

export default ContactPage;
