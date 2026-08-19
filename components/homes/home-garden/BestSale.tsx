import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import { bestSaleGardenProducts } from "@/data/products/products";

const BANNER = {
  img: "/assets/images/section/banner-48.jpg",
  title: "Discover Your",
  titleBreak: "New Green",
  desc: "Handpicked selections perfect for",
  descBreak: "modern homes",
};

function BestSale() {
  const leftProducts = bestSaleGardenProducts.slice(0, 2);
  const rightProducts = bestSaleGardenProducts.slice(2, 6);

  return (
    <section className="flat-spacing-7">
      <div className="container">
        <div className="sect-heading d-block d-md-flex type-2 has-col-right wow fadeInUp">
          <div>
            <h3 className="s-title">Best-Selling Plants</h3>
            <p className="text-body-1 cl-text-2 ">
              A selection of our most-loved indoor plants and essentials.
            </p>
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
          <div className="col-lg-6 mb-lg-0 mb-30">
            <div className="banner-image-text type-abs style-18">
              <Link href="/shop-default" className="bn-image img-style">
                <Image
                  src={`${BANNER.img}`}
                  alt=""
                  width={450}
                  height={608}
                  loading="lazy"
                />
              </Link>
              <div className="bn-content wow fadeInUp">
                <Link
                  href="/shop-default"
                  className="title h2 fw-medium link-3 mb-8"
                >
                  {BANNER.title}{" "}
                  <br className="d-xxl-block d-none" /> {BANNER.titleBreak}
                </Link>
                <p className="desc cl-text-2 mb-24">
                  {BANNER.desc}{" "}
                  <br className="d-xxl-block d-none" /> {BANNER.descBreak}
                </p>
                <Link
                  href="/shop-default"
                  className="tf-btn animate-btn small-2"
                >
                  <span className="text-caption-01">Shop now</span>
                </Link>
              </div>
            </div>
            <div className="tf-grid-layout tf-col-2 gap-15 gap-lg-30">
              {leftProducts.map((product) => (
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
            </div>
          </div>
          <div className="col-lg-6">
            <div className="tf-grid-layout tf-col-2 gap-lg-30 gap-15">
              {rightProducts.map((product) => (
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BestSale;
