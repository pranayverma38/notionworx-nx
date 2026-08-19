import { Metadata } from "next";

import Section404 from "@/components/pages/404/Section404";

export const metadata: Metadata = {
  title: "404 | Amerce - Multipurpose eCommerce React Nextjs Template",
  description: "Amerce - Multipurpose eCommerce React Nextjs Template",
};

const NotFoundPage = () => {
  return (
    <>
      <Section404 />
    </>
  );
};

export default NotFoundPage;
