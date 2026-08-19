import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { categoriesBaby } from "@/data/categories";

function Category() {
  return (
    <section className="themesFlat">
      <div className="container">
        <div className="sect-heading type-2 text-center wow fadeInUp">
          <h3 className="s-title">Shop By Categories</h3>
          <p className="s-desc text-body-1 cl-text-2">
            Explore trusted essentials to comfort and nurture your little one.
          </p>
        </div>
        <TfSwiper
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
          className="swiper-cate"
          paginationClassName="sw-dot-default tf-sw-pagination"
        >
          {categoriesBaby.map((item) => (
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
                <h5 className="cate_name link-underline-text">{item.name}</h5>
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

export default Category;
