import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import ProductCard from "@/components/ui/ProductCard";
import { favoriteBabyProducts } from "@/data/products/products";

function Favorite() {
  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="sect-heading type-2 has-col-right wow fadeInUp">
          <div>
            <h3 className="s-title">Parent &amp; Baby Favorites</h3>
            <p className="s-desc cl-text-2 text-body-1">
              Discover the softest, most-loved essentials for your little world.
            </p>
          </div>
          <div className="col-right">
            <Link
              href="/shop-default"
              className="tf-btn-line-2 py-4 style-primary"
            >
              <span className="fw-semibold"> View All Products </span>
            </Link>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4 d-none d-lg-block">
            <div className="banner-image-text type-abs style-6 h-100">
              <Link href="/shop-default" className="bn-image img-style">
                <Image
                  src="/assets/images/section/banner-21.jpg"
                  alt=""
                  width={450}
                  height={830}
                  loading="lazy"
                />
              </Link>
              <div className="bn-content wow fadeInUp">
                <p className="desc fw-semibold">
                  LOVE IN EVERY LITTLE DETAIL
                </p>
                <Link
                  href="/shop-default"
                  className="title h3 fw-medium link"
                >
                  Comfort And Care For Your Baby
                </Link>
                <Link
                  href="/shop-default"
                  className="btn-action tf-btn btn-white"
                >
                  View All Products
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-8">
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
              {favoriteBabyProducts.map((product) => (
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
    </section>
  );
}

export default Favorite;
