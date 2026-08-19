import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { categoriesConstruction } from "@/data/categories";

function Categories() {
  return (
    <section className="themesFlat flat-spacing">
      <div className="container">
        <div className="sect-heading type-2 text-center wow fadeInUp">
          <h3 className="s-title">Construction Categories</h3>
          <p className="s-desc text-body-1 cl-text-2">
            Essential tools and equipment designed for professional building
            work.
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
          paginationSm={2}
          paginationMd={3}
          paginationLg={5}
          grid={2}
          className="swiper-cate"
          paginationClassName="sw-dot-default tf-sw-pagination"
        >
          {categoriesConstruction.map((item) => (
            <Link
              key={item.img}
              href="/shop-default"
              className="category-v04 hover-img wow fadeInUp"
            >
              <div className="cate-image img-style">
                <Image
                  src={`${item.img}`}
                  alt={item.name}
                  width={240}
                  height={180}
                  loading="lazy"
                />
              </div>
              <div className="cate-content text-center">
                <div className="h5 cate_name link-underline-text">{item.name}</div>
                {item.quantity != null && (
                  <p className="cate_quantity text-caption-01 cl-text-2">
                    {item.quantity}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </TfSwiper>
      </div>
    </section>
  );
}

export default Categories;
