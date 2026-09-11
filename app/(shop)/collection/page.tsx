import { permanentRedirect } from "next/navigation";

export default function CollectionPageRedirect() {
  permanentRedirect("/categories");
}
