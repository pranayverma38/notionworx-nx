import type { ProductCardItem } from "@/types/productCard";

export type ProductDetailTabKey =
  | "description"
  | "dimensions"
  | "warranty"
  | "how-to-order";

export type ProductDetailTab = {
  key: ProductDetailTabKey;
  id: string;
  label: string;
};

function hasContent(html?: string, text?: string) {
  return Boolean(html?.trim() || text?.trim());
}

export function getProductDetailTabs(product?: ProductCardItem): ProductDetailTab[] {
  const tabs: ProductDetailTab[] = [
    {
      key: "description",
      id: "description",
      label: "Description",
    },
  ];

  if (hasContent(product?.howToOrderHtml, product?.howToOrderText)) {
    tabs.push({
      key: "how-to-order",
      id: "how-to-order",
      label: "How to Order",
    });
  }

  if (hasContent(product?.dimensionsHtml, product?.dimensionsText)) {
    tabs.push({
      key: "dimensions",
      id: "dimensions",
      label: "Dimensions",
    });
  }

  if (hasContent(product?.warrantyHtml, product?.warrantyText)) {
    tabs.push({
      key: "warranty",
      id: "warranty",
      label: "Warranty",
    });
  }

  return tabs;
}
