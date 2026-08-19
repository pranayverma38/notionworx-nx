import { Metadata } from "next";

import PageTitle from "@/components/pages/our-store/PageTitle";
import OurStore from "@/components/pages/our-store/OurStore";

export const metadata: Metadata = {
  title: "Project Support | Notion Worx",
  description:
    "Review key Notion Worx collections and find the right product family for your next branded event, display, or merchandise project.",
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
