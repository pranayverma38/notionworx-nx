import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { categoriesOrganic } from "@/data/categories";

function Category() {
  return (
    <section className="flat-spacing">
      <div className="container">
        <TfSwiper
          preview={5}
          tablet={4}
          mobileSm={3}
          mobile={2}
          space={10}
          pagination={2}
          paginationSm={3}
          paginationMd={4}
          paginationLg={5}
          paginationClassName="sw-line-default style-2 tf-sw-pagination"
          className="swiper-cate"
        >
          {categoriesOrganic.map((item) => (
            <Link
              key={item.img ?? item.name}
              href="/shop-default"
              className="category-v02 hover-img wow fadeInUp"
            >
              <div className="cate-image img-style rounded-circle">
                <Image
                  src={`${item.img}`}
                  alt={item.name}
                  width={210}
                  height={210}
                  loading="lazy"
                />
              </div>
              <div className="cate-content text-center">
                <h6 className="cate_name link">{item.name}</h6>
                {item.quantity != null && (
                  <p className="cate_quantity cl-text-2">{item.quantity}</p>
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
