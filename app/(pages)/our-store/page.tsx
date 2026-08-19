import { Metadata } from "next";

import PageTitle from "@/components/pages/our-store/PageTitle";
import OurStore from "@/components/pages/our-store/OurStore";

export const metadata: Metadata = {
  title: "Our Store | Amerce - Multipurpose eCommerce React Nextjs Template",
  description: "Amerce - Multipurpose eCommerce React Nextjs Template",
};

const OurStorePage = () => {
  return (
    <>
      <PageTitle />
      <OurStore />
    </>
  );
};

export default OurStorePage;
