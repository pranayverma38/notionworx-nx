import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { categoriesMental } from "@/data/categories";

function Category() {
  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="sect-heading type-2 has-col-right wow fadeInUp">
          <div>
            <h3 className="s-title">Shop By Category</h3>
            <p className="s-desc text-body-1 cl-text-2">
              Mindful choices for everyday wellbeing.
            </p>
          </div>
          <Link
            href="/collection"
            className="tf-btn-line-2 style-primary py-4"
          >
            <span className="fw-semibold"> View All Category </span>
          </Link>
        </div>
        <TfSwiper
          preview={6}
          tablet={4}
          mobileSm={3}
          mobile={2}
          space={10}
          pagination={2}
          paginationSm={3}
          paginationMd={4}
          paginationLg={6}
          paginationClassName="sw-line-default style-2 tf-sw-pagination"
          className="wow fadeInUp"
        >
          {categoriesMental.map((item) => (
            <Link
              key={item.saleLabel ?? item.img ?? item.name}
              href="/shop-default"
              className={item.saleLabel != null ? "category-v02 style-2 hover-img" : "category-v02 hover-img"}
            >
              {item.saleLabel != null ? (
                <div className="cate-sale fw-medium text-white">
                  <span className="h3"> {item.saleLabel} </span>
                  <span className="h6"> OFF </span>
                </div>
              ) : item.img != null ? (
                <div className="cate-image img-style overflow-visible">
                  <Image
                    src={`${item.img}`}
                    alt={item.name}
                    width={210}
                    height={210}
                    loading="lazy"
                  />
                </div>
              ) : null}
              <div className="cate-content text-center">
                <h6
                  className={
                    item.saleLabel != null
                      ? "cate_name text-primary link-underline"
                      : "cate_name link link-underline"
                  }
                >
                  {item.name}
                </h6>
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
