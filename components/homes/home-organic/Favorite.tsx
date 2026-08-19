import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import ProductCard from "@/components/ui/ProductCard";
import { favoriteOrganicProducts } from "@/data/products/products";

const BANNER = {
  img: "/assets/images/section/banner-33.jpg",
  desc: "Naturally sweet and full of flavor.",
  title: "Crispy Organic",
  titleBreak: "Apple Rings",
};

function Favorite() {
  return (
    <section className="section-banner-favorite flat-spacing pt-0">
      <div className="container">
        <div className="sect-heading type-2 has-col-right wow fadeInUp">
          <div>
            <p className="s-desc cl-text-3 fw-semibold mb-8">
              OUR BESTSELLERS
            </p>
            <h2 className="s-title font-outfit mb-0 letter-space-0">
              Customer Favorites
            </h2>
          </div>
          <div className="col-right">
            <Link
              href="/shop-default"
              className="tf-btn-line-2 py-4 style-primary"
            >
              <span className="fw-semibold">View All Products</span>
            </Link>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4 d-none d-lg-block">
            <div className="col-left">
              <div className="banner-image-text type-abs style-12">
                <Link href="/shop-default" className="bn-image img-style">
                  <Image
                    src={`${BANNER.img}`}
                    alt=""
                    width={420}
                    height={776}
                    loading="lazy"
                  />
                </Link>
                <div className="bn-content align-items-center text-center wow fadeInUp">
                  <p className="desc cl-text-2 fw-semibold text-capitalize">
                    {BANNER.desc}
                  </p>
                  <Link
                    href="/shop-default"
                    className="title h3 fw-medium link"
                  >
                    {BANNER.title}{" "}
                    <br className="d-none d-sm-block" /> {BANNER.titleBreak}
                  </Link>
                  <Link
                    href="/shop-default"
                    className="btn-action tf-btn btn-white"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="col-right">
              <TfSwiper
                preview={3}
                tablet={3}
                mobileSm={2}
                mobile={2}
                spaceLg={30}
                spaceMd={15}
                space={10}
                pagination={2}
                paginationSm={2}
                paginationMd={3}
                paginationLg={3}
                grid={2}
                paginationClassName="sw-dot-default tf-sw-pagination"
              >
                {favoriteOrganicProducts.map((product) => (
                  <ProductCard
                    key={product.img}
                    product={product}
                    wrapperClass="square"
                    imgWidth={330}
                    imgHeight={330}
                    actionBotLabel="Add to Cart"
                    actionBotHref="#shoppingCart"
                    actionBotDataToggle="offcanvas"
                  />
                ))}
              </TfSwiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Favorite;
