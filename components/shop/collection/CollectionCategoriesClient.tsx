"use client";

import Image from "next/image";
import Link from "next/link";

import { categoriesCollection } from "@/data/categories";

export default function CollectionCategoriesClient() {
  return (
    <div className="flat-spacing">
      <div className="container">
        <div className="tf-grid-layout ssm-col-2 xl-col-4 gap-lg-30">
          {categoriesCollection.map((category) => (
            <article
              key={category.name}
              className="notionworx-collection-card hover-img4"
            >
              <Link
                href={category.href ?? "/shop-default"}
                className="notionworx-collection-card__image img-style4"
              >
                <Image
                  loading="lazy"
                  width={396}
                  height={330}
                  src={category.img}
                  alt={category.name}
                />
              </Link>
              <div className="notionworx-collection-card__body text-center">
                <Link
                  href={category.href ?? "/shop-default"}
                  className="notionworx-collection-card__title"
                >
                  {category.name}
                  <i className="icon icon-ArrowUpRight1" />
                </Link>
                {category.quantity ? (
                  <p className="notionworx-collection-card__meta text-caption-01 mt-6">
                    {category.quantity}
                  </p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
