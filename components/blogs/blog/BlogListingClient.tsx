"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { allBlogPosts } from "@/data/blogs";
import { ShopPagination } from "@/components/shop/shop-default/ShopListingUi";
import { computePageItems } from "@/components/shop/shop-default/shopLayoutUtils";

/** Matches `sm-col-2` — two posts per row on small+ viewports. */
const ITEMS_PER_PAGE = 6;

export default function BlogListingClient() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(allBlogPosts.length / ITEMS_PER_PAGE),
  );

  const pageItems = useMemo(
    () => computePageItems(totalPages, currentPage),
    [totalPages, currentPage],
  );

  const visible = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return allBlogPosts.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage]);

  return (
    <div className="tf-grid-layout sm-col-2">
      {visible.map((post) => (
        <article key={post.id} className="article-blog hover-img">
          <Link
            href={`/blog-single/${post.id}`}
            className="blog-image img-style"
          >
            <Image
              loading="lazy"
              width={450}
              height={307}
              src={post.img}
              alt={post.alt || post.title}
            />
          </Link>
          <div className="blog-content">
            <p className="entry-date text-caption-01 fw-semibold cl-text-3">
              {post.date}
            </p>
            <h5 className="entry-title">
              <Link
                href={`/blog-single/${post.id}`}
                className="link-underline link"
              >
                {post.title}
              </Link>
            </h5>
            <p className="entry-desc cl-text-2">{post.desc}</p>
          </div>
        </article>
      ))}
      {totalPages > 1 ? (
        <div className="wd-full">
          <ShopPagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageItems={pageItems}
            onPageChange={setCurrentPage}
          />
        </div>
      ) : null}
    </div>
  );
}
