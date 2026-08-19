"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { categoriesCollection } from "@/data/categories";
import { ShopPagination } from "@/components/shop/shop-default/ShopListingUi";
import { computePageItems } from "@/components/shop/shop-default/shopLayoutUtils";

/** Matches `xl-col-4` so one “page” is a full row on large screens. */
const ITEMS_PER_PAGE = 8;

export default function CollectionCategoriesClient() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(categoriesCollection.length / ITEMS_PER_PAGE),
  );

  const pageItems = useMemo(
    () => computePageItems(totalPages, currentPage),
    [totalPages, currentPage],
  );

  const visible = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return categoriesCollection.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage]);

  return (
    <div className="flat-spacing">
      <div className="container">
        <div className="tf-grid-layout ssm-col-2 xl-col-4 gap-lg-30">
          {visible.map((category) => (
            <div
              key={category.name}
              className="category-v03 style-2 hover-img4"
            >
              <Link href={`/shop-default`} className="cate-image img-style4">
                <Image
                  loading="lazy"
                  width={330}
                  height={440}
                  src={category.img}
                  alt={category.name}
                />
              </Link>
              <div className="cate-content text-center">
                <Link href={`/shop-default`} className="cate_name h5 fw-medium">
                  {category.name}
                  <i className="icon icon-ArrowUpRight1" />
                </Link>
              </div>
            </div>
          ))}
          {totalPages > 1 ? (
            <div className="wd-full d-flex justify-content-center">
              <ShopPagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageItems={pageItems}
                onPageChange={setCurrentPage}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
