import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { categoriesDecor } from "@/data/categories";

function Category() {
  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="sect-heading type-2 text-center wow fadeInUp">
          <h3 className="s-title">Curated Categories</h3>
          <p className="s-desc cl-text-2">
            Explore premium selections that redefine comfort and style.
          </p>
        </div>
        <TfSwiper
          preview={5}
          tablet={4}
          mobileSm={3}
          mobile={2}
          spaceLg={40}
          spaceMd={20}
          space={10}
          pagination={2}
          paginationSm={3}
          paginationMd={4}
          paginationLg={5}
          className="swiper-cate"
          paginationClassName="sw-dot-default tf-sw-pagination"
        >
          {categoriesDecor.map((item) => (
            <Link
              key={item.img}
              href="/shop-default"
              className="category-v01 hover-img wow fadeInUp"
            >
              <div className="cate-image img-style">
                <Image
                  src={`${item.img}`}
                  alt={item.name}
                  width={250}
                  height={250}
                  className="aspect-ratio-1"
                  loading="lazy"
                />
              </div>
              <h5 className="cate-name text-center link link-underline text-line-clamp-1">
                {item.name}
              </h5>
            </Link>
          ))}
        </TfSwiper>
      </div>
    </section>
  );
}

export default Category;
