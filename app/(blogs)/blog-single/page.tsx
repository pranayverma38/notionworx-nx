import { redirect } from "next/navigation";

/** Legacy URL: send users to the first main blog article. */
export default function BlogSingleLegacyPage() {
  redirect("/blog-single/1");
}
