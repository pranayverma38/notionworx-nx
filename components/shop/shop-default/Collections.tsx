import Link from "next/link";
import Image from "next/image";

import TfSwiper from "@/components/ui/TfSwiper";
import { categories } from "@/data/categories";

export default function Collections() {
  return (
    <section className="flat-spacing pb-0">
      <div className="container">
        <TfSwiper
          preview={6}
          tablet={4}
          mobileSm={3}
          mobile={2}
          spaceLg={30}
          spaceMd={15}
          space={10}
          pagination={2}
          paginationSm={3}
          paginationMd={4}
          paginationLg={6}
        >
          {categories.map((category) => (
            <div key={category.name}>
              <Link href={`/shop-default`} className="category-v01 hover-img">
                <div className="cate-image img-style">
                  <Image
                    loading="lazy"
                    width={210}
                    height={210}
                    src={category.img}
                    alt={category.name}
                  />
                </div>
                <h5 className="cate-name text-center link link-underline">
                  {category.name}
                </h5>
              </Link>
            </div>
          ))}
        </TfSwiper>
      </div>
    </section>
  );
}
