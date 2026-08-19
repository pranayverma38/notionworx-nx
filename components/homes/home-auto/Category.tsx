import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { categoriesAuto } from "@/data/categories";

function Category() {
  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="sect-heading type-2 text-center wow fadeInUp">
          <h3 className="s-title mb-0">Top Categories For You</h3>
        </div>
        <TfSwiper
          laptop={6}
          preview={5}
          tablet={4}
          mobileSm={3}
          mobile={2}
          spaceLg={30}
          spaceMd={20}
          space={10}
          pagination={2}
          paginationSm={3}
          paginationMd={4}
          paginationLg={5}
          paginationClassName="sw-dot-default tf-sw-pagination"
        >
          {categoriesAuto.map((item) => (
            <Link
              key={item.img}
              href="/shop-default"
              className="category-v01 style-2 hover-img wow fadeInUp"
            >
              <div className="cate-image img-style">
                <Image
                  src={`${item.img}`}
                  alt={item.name}
                  width={210}
                  height={210}
                  loading="lazy"
                />
              </div>
              <p className="cate-name text-center link link-underline fw-semibold">
                {item.name}
              </p>
            </Link>
          ))}
        </TfSwiper>
      </div>
    </section>
  );
}

export default Category;
