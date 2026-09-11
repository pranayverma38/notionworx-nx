import { NextResponse } from "next/server";

import { getShopCatalogProducts } from "@/lib/medusa/notionworx-storefront";

export async function GET() {
  const products = await getShopCatalogProducts();

  return NextResponse.json({ products });
}
