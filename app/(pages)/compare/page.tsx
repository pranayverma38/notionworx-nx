import { Metadata } from "next";

import PageTitle from "@/components/pages/compare/PageTitle";
import Compare from "@/components/pages/compare/Compare";

export const metadata: Metadata = {
  title: "Compare | Amerce - Multipurpose eCommerce React Nextjs Template",
  description: "Amerce - Multipurpose eCommerce React Nextjs Template",
};

const ComparePage = () => {
  return (
    <>
      <PageTitle />
      <Compare />
    </>
  );
};

export default ComparePage;
