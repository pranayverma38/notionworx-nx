import { Metadata } from "next";
import ArtUploadForm from "@/components/pages/uploadart/ArtUploadForm";

export const metadata: Metadata = {
  title: "Art Upload | Notion Worx",
  description: "Upload your artwork and design instructions for your Notion Worx custom order.",
};

export default function ArtUploadPage() {
  return <ArtUploadForm />;
}
