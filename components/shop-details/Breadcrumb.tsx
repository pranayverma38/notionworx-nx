"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { products as localProducts } from "@/data/products/products";
import type { ProductCardItem } from "@/types/productCard";

function useAdjacentProductIds(
  currentId: number,
  catalogProducts: ProductCardItem[],
) {
  return useMemo(() => {
    const sorted = [...catalogProducts].sort((a, b) => Number(a.id) - Number(b.id));
    const idx = sorted.findIndex((p) => p.id === currentId);
    if (idx === -1) {
      return { prevId: null as number | null, nextId: null as number | null };
    }
    return {
      prevId: idx > 0 ? sorted[idx - 1].id : null,
      nextId: idx < sorted.length - 1 ? sorted[idx + 1].id : null,
    };
  }, [catalogProducts, currentId]);
}

function NavArrow({
  direction,
  href,
  iconClass,
}: {
  direction: "prev" | "next";
  href: string | undefined;
  iconClass: string;
}) {
  const className = `link nav-post-item nav-post-${direction}`;

  if (!href) {
    return (
      <span
        className={`${className} opacity-50`}
        style={{ pointerEvents: "none" }}
        aria-disabled="true"
        tabIndex={-1}
      >
        <i className={`icon ${iconClass}`} />
      </span>
    );
  }

  return (
    <Link href={href} className={className} prefetch={false}>
      <i className={`icon ${iconClass}`} />
    </Link>
  );
}

export default function Breadcrumb({
  product,
  catalogProducts = localProducts,
}: {
  product: ProductCardItem;
  catalogProducts?: ProductCardItem[];
}) {
  const params = useParams();
  const pathname = usePathname() ?? "";

  const idParam = params?.id;
  const rawId = Array.isArray(idParam) ? idParam[0] : idParam;
  const parsed = Number(rawId);
  const currentId = Number.isFinite(parsed) ? parsed : product.id;

  const basePath =
    pathname.includes("/") && pathname.length > 0
      ? pathname.slice(0, pathname.lastIndexOf("/"))
      : "";

  const { prevId, nextId } = useAdjacentProductIds(currentId, catalogProducts);

  const prevHref =
    basePath && prevId != null ? `${basePath}/${prevId}` : undefined;
  const nextHref =
    basePath && nextId != null ? `${basePath}/${nextId}` : undefined;
  const categoryHref = product.category
    ? `/shop-default?category=${encodeURIComponent(product.category)}`
    : "/shop-default";

  return (
    <div className="section-page-title-single flat-spacing-3 product-detail-breadcrumb-nav">
      <div className="container">
        <div className="main-page-title">
          <div className="breadcrumbs">
            <Link href="/" className="text-caption-01 cl-text-3 link">
              Home
            </Link>
            <i className="icon icon-CaretRightThin cl-text-3" />
            <Link href={categoryHref} className="text-caption-01 cl-text-3 link">
              {product.category ?? "Shop"}
            </Link>
            <i className="icon icon-CaretRightThin cl-text-3" />
            <p className="text-caption-01">{product.name}</p>
          </div>
          <div className="nav-post-list">
            <NavArrow
              direction="prev"
              href={prevHref}
              iconClass="icon-CaretLeft"
            />
            <Link
              href={categoryHref}
              className="link nav-all-post nav-post-link"
            >
              <i className="icon icon-SquaresFour" />
            </Link>
            <NavArrow
              direction="next"
              href={nextHref}
              iconClass="icon-CaretRightThin"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
