import { Metadata } from "next";

import PageTitle from "@/components/blogs/blog/PageTitle";
import Blog from "@/components/blogs/blog/Blog";

export const metadata: Metadata = {
  title: "Blog | Amerce - Multipurpose eCommerce React Nextjs Template",
  description: "Amerce - Multipurpose eCommerce React Nextjs Template",
};

const BlogPage = () => {
  return (
    <>
      <PageTitle />
      <Blog />
    </>
  );
};

export default BlogPage;
