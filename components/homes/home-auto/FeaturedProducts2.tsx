"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import TfSwiper from "@/components/ui/TfSwiper";
import ProductCardMiniList from "@/components/ui/ProductCardMiniList";
import { featured2AutoProducts } from "@/data/products/products";

function FeaturedProducts2() {
  const slide1Products = featured2AutoProducts.slice(0, 3);
  const slide2Products = featured2AutoProducts.slice(3, 6);
  const [showBannerSlide, setShowBannerSlide] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1200px)");
    const sync = () => setShowBannerSlide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <section className="section-featured-product flat-spacing">
      <div className="container">
        <div className="sect-heading type-2 text-center wow fadeInUp">
          <h3 className="s-title">Featured Products</h3>
          <p className="s-desc text-body-1 cl-text-2">
            Best-selling treats, toys, and gear your furry friends will love.
          </p>
        </div>
        <TfSwiper
          preview={3}
          tablet={2}
          mobileSm={2}
          mobile={2}
          spaceLg={30}
          spaceMd={20}
          space={10}
          pagination={1}
          paginationSm={1}
          paginationMd={2}
          paginationLg={3}
          paginationClassName="sw-line-default style-2 tf-sw-pagination"
        >
          <div className="tf-list vertical gap-16">
            {slide1Products.map((product) => (
              <ProductCardMiniList key={product.img} product={product} />
            ))}
          </div>
          {showBannerSlide ? (
            <div>
              <div className="banner-image-text type-abs style-6">
                <Link href="/shop-default" className="bn-image img-style">
                  <Image
                    src="/assets/images/section/banner-26.jpg"
                    alt=""
                    width={450}
                    height={608}
                    loading="lazy"
                  />
                </Link>
                <div className="bn-content text-center align-items-center wow fadeInUp">
                  <p className="desc text-white fw-semibold">
                    HURRY! SALE ENDS SOON
                  </p>
                  <Link
                    href="/shop-default"
                    className="title h3 fw-medium text-white link mb-24"
                  >
                    Save Up To 50%
                  </Link>
                  <Link
                    href="/shop-default"
                    className="btn-action tf-btn btn-white hv-primary"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
          <div className="tf-list vertical gap-16">
            {slide2Products.map((product) => (
              <ProductCardMiniList key={product.img} product={product} />
            ))}
          </div>
        </TfSwiper>
      </div>
    </section>
  );
}

export default FeaturedProducts2;
