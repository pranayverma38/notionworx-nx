import { Metadata } from "next";
import CanopyDesigner from "@/components/pages/designer/CanopyDesigner";

export const metadata: Metadata = {
  title: "Custom Canopy Designer | Notion Worx",
  description: "Design your branded canopy tent in seconds with AI. Upload your logo and describe your vision.",
};

export default function DesignerPage() {
  return <CanopyDesigner />;
}
