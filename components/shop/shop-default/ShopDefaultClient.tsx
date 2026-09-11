"use client";

import dynamic from "next/dynamic";

const Shop = dynamic(() => import("./Shop"), {
  ssr: false,
});

type ShopDefaultClientProps = {
  defaultCategories?: string[];
  itemPerPage?: number;
};

export default function ShopDefaultClient({
  defaultCategories = [],
  itemPerPage = 30,
}: ShopDefaultClientProps) {
  return (
    <Shop
      defaultCategories={defaultCategories}
      itemPerPage={itemPerPage}
    />
  );
}
