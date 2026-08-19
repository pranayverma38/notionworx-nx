import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import { bannerHighlightFashionProducts } from "@/data/products/products";

const BANNER = {
  img: "/assets/images/section/banner-39.jpg",
  desc: "Built for every move.",
  title: "Gear Up For",
  titleBreak: "Greatness",
};

function BannerHighlight() {
  return (
    <section className="flat-spacing section-banner-highlight">
      <div className="container">
        <div className="sect-heading type-6 text-center wow fadeInUp">
          <h3 className="s-title">Weekly Top Highlights</h3>
          <p className="s-desc text-body-1 cl-text-2">
            Fresh styles and must-have picks curated for your week.
          </p>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <div className="banner-image-text type-abs style-15">
              <Link href="/shop-default" className="bn-image img-style">
                <Image
                  src={`${BANNER.img}`}
                  alt=""
                  width={450}
                  height={608}
                  loading="lazy"
                />
              </Link>
              <div className="bn-content">
                <p className="desc text-body-1 text-white mb-4">
                  {BANNER.desc}
                </p>
                <div className="h1 title text-white mb-28">
                  {BANNER.title} <br />
                  {BANNER.titleBreak}
                </div>
                <Link
                  href="/shop-default"
                  className="btn-action tf-btn btn-white hv-primary"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="tf-grid-layout tf-col-2">
              {bannerHighlightFashionProducts.map((product) => (
                <ProductCard
                  key={product.img}
                  product={product}
                  imgWidth={330}
                  imgHeight={440}
                  actionBotLabel="Quick Add"
                  actionBotHref="#quickAdd"
                  actionBotDataToggle="modal"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BannerHighlight;
