"use client";

import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import ProductCard from "@/components/ui/ProductCard";
import { featuredPetProducts } from "@/data/products/products";
import CountdownTimer from "@/components/common/Countdown";
import { useMatchesMaxWidth } from "@/hooks/useLookbookDropdownPlacement";

const SLIDE_SIZE = 3;
/** Hide center banner at or below this width (px); aligns with theme `d-none d-xl-block` (1200px). */
const DEFAULT_HIDE_BANNER_MAX_WIDTH_PX = 1199;
const BANNER_SLIDE = {
  img: "/assets/images/section/banner-16.jpg",
  desc: "HURRY! PAWLIDAY SALE ENDS SOON",
  title: "Save Up To 50%",
  countdown: 1093120,
};

type FeaturedProps = {
  /** When viewport width is ≤ this value (px), the center banner slide is omitted. */
  hideBannerMaxWidthPx?: number;
};

function Featured({
  hideBannerMaxWidthPx = DEFAULT_HIDE_BANNER_MAX_WIDTH_PX,
}: FeaturedProps) {
  const isNarrowViewport = useMatchesMaxWidth(hideBannerMaxWidthPx);
  const slide1 = featuredPetProducts.slice(0, SLIDE_SIZE);
  const slide2 = featuredPetProducts.slice(SLIDE_SIZE, SLIDE_SIZE * 2);

  return (
    <section className="section-featured-product flat-spacing">
      <div className="container">
        <div className="sect-heading type-2 text-center wow fadeInUp">
          <h3 className="s-title">Pet Deal Of The Week</h3>
          <p className="s-desc text-body-1 cl-text-2">
            Best-selling treats, toys, and gear your furry friends will love.
          </p>
        </div>
        <TfSwiper
          key={isNarrowViewport ? "pet-featured-2" : "pet-featured-3"}
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
            {slide1.map((product) => (
              <ProductCard
                key={product.img}
                product={product}
                cardClass="product-style_mini_list"
                imgWidth={160}
                imgHeight={160}
                actionBotLabel="Add to cart"
                actionBotHref="#shoppingCart"
                actionBotDataToggle="offcanvas"
              />
            ))}
          </div>
          {!isNarrowViewport ? (
            <div className="banner-image-text type-abs style-8">
              <Link href="/shop-default" className="bn-image img-style">
                <Image
                  src={`${BANNER_SLIDE.img}`}
                  alt=""
                  width={450}
                  height={608}
                  loading="lazy"
                />
              </Link>
              <div className="bn-content align-items-center wow fadeInUp">
                <p className="desc text-primary fw-semibold">
                  {BANNER_SLIDE.desc}
                </p>
                <Link href="/shop-default" className="title h3 fw-medium link">
                  {BANNER_SLIDE.title}
                </Link>
                <div className="countdown-v01 style-2">
                  <div className="js-countdown cd-has-zero cd-custom">
                    <CountdownTimer style={7} />
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          <div className="tf-list vertical gap-16">
            {slide2.map((product) => (
              <ProductCard
                key={product.img}
                product={product}
                cardClass="product-style_mini_list"
                imgWidth={160}
                imgHeight={160}
                actionBotLabel="Add to cart"
                actionBotHref="#shoppingCart"
                actionBotDataToggle="offcanvas"
              />
            ))}
          </div>
        </TfSwiper>
      </div>
    </section>
  );
}

export default Featured;
