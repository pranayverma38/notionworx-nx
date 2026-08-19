import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { categoriesFashion } from "@/data/categories";

function Category() {
  return (
    <section className="flat-spacing bg-main-2 section-categories">
      <div className="container">
        <div className="sect-heading type-5 text-center wow fadeInUp">
          <h3 className="s-title">Shop By Categories</h3>
          <p className="s-desc text-body-1 cl-text-2">
            Explore essential activewear collections for every workout style.
          </p>
        </div>
      </div>
      <div className="px-10">
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
          externalNavSelectors={{
            nextEl: ".category-slider-nav-next",
            prevEl: ".category-slider-nav-prev",
          }}
          footerSlot={
            <>
              <div className="group-action-nav">
                <div className="tf-sw-nav-2 nav-prev-swiper category-slider-nav-prev">
                  <i className="icon icon-ArrowLeft" aria-hidden />
                </div>
                <div className="tf-sw-nav-2 nav-next-swiper category-slider-nav-next">
                  <i className="icon icon-ArrowRight" aria-hidden />
                </div>
              </div>
            </>
          }
        >
          {categoriesFashion.map((item) => (
            <div
              key={item.img}
              className="category-v03 style-3 hover-img4 wow fadeInUp"
            >
              <Link href="/shop-default" className="cate-image img-style4">
                <Image
                  src={`${item.img}`}
                  alt={item.name}
                  width={372}
                  height={623}
                  loading="lazy"
                />
              </Link>
              <div className="cate-content">
                <Link
                  href="/shop-default"
                  className="cate_name h5 fw-medium rounded-0"
                >
                  {item.name}
                  <i className="icon icon-ArrowUpRight1" aria-hidden />
                </Link>
              </div>
            </div>
          ))}
        </TfSwiper>
      </div>
    </section>
  );
}

export default Category;
