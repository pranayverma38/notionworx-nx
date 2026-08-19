import { Metadata } from "next";

import PageTitle from "@/components/pages/contact/PageTitle";
import Map from "@/components/pages/contact/Map";
import Contact from "@/components/pages/contact/Contact";

export const metadata: Metadata = {
  title: "Contact Us | Amerce - Multipurpose eCommerce React Nextjs Template",
  description: "Amerce - Multipurpose eCommerce React Nextjs Template",
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
