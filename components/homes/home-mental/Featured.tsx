import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import ProductCard from "@/components/ui/ProductCard";
import { featuredMentalProducts } from "@/data/products/products";

const p = featuredMentalProducts;

function FeaturedBannersSlide() {
  return (
    <div className="tf-list vertical gap-16">
      <div className="box-image_v02 hover-img wow fadeInUp">
        <Link href="/shop-default" className="box-image_img img-style">
          <Image
            loading="lazy"
            width={450}
            height={294}
            src="/assets/images/section/banner-6.jpg"
            alt="Vitamins Every Day"
          />
        </Link>
        <div className="box-image_content">
          <Link href="/shop-default" className="title h4 fw-medium link">
            Vitamins <br />
            Every Day
          </Link>
          <p className="desc">
            Discover calming products <br />
            for deeper, peaceful sleep.
          </p>
          <Link
            href="/shop-default"
            className="btn-action tf-btn-icon link"
          >
            <span className="text-caption-01 fw-semibold">View More</span>
            <i className="icon icon-ArrowRight fs-20" />
          </Link>
        </div>
      </div>
      <div className="box-image_v02 hover-img wow fadeInUp">
        <Link href="/shop-default" className="box-image_img img-style">
          <Image
            loading="lazy"
            width={450}
            height={294}
            src="/assets/images/section/banner-7.jpg"
            alt="Vitamins Every Day"
          />
        </Link>
        <div className="box-image_content">
          <Link href="/shop-default" className="title h4 fw-medium link">
            Vitamins <br />
            Every Day
          </Link>
          <p className="desc">
            Discover calming products <br />
            for deeper, peaceful sleep.
          </p>
          <Link
            href="/shop-default"
            className="btn-action tf-btn-icon link"
          >
            <span className="text-caption-01 fw-semibold">View More</span>
            <i className="icon icon-ArrowRight fs-20" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function Featured() {
  return (
    <section className="section-featured-product flat-spacing">
      <div className="container">
        <div className="sect-heading type-2 text-center wow fadeInUp">
          <h3 className="s-title">Featured Products</h3>
          <p className="s-desc text-body-1 cl-text-2">
            Top styles everyone&apos;s talking about.
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
          className="wow fadeInUp"
          slideClassName={["", "d-none d-xl-block", "", "d-md-none"]}
        >
          {/* Slide 1 — three products; third hidden below md (shown in slide 4) */}
          <div className="tf-list vertical gap-16">
            <ProductCard
              variant="miniList"
              product={p[0]}
              cardClass="wow fadeInUp"
              imgWidth={160}
              imgHeight={160}
              actionBotLabel="Add to cart"
              actionBotHref="#shoppingCart"
              actionBotDataToggle="offcanvas"
            />
            <ProductCard
              variant="miniList"
              product={p[1]}
              cardClass="wow fadeInUp"
              imgWidth={160}
              imgHeight={160}
              actionBotLabel="Add to cart"
              actionBotHref="#shoppingCart"
              actionBotDataToggle="offcanvas"
            />
            <ProductCard
              variant="miniList"
              product={p[2]}
              cardClass="wow fadeInUp d-none d-md-flex"
              imgWidth={160}
              imgHeight={160}
              actionBotLabel="Add to cart"
              actionBotHref="#shoppingCart"
              actionBotDataToggle="offcanvas"
            />
          </div>

          {/* Slide 2 — promo banners, xl+ only */}
          <FeaturedBannersSlide />

          {/* Slide 3 — three products */}
          <div className="tf-list vertical gap-16">
            <ProductCard
              variant="miniList"
              product={p[3]}
              cardClass="wow fadeInUp"
              imgWidth={160}
              imgHeight={160}
              actionBotLabel="Add to cart"
              actionBotHref="#shoppingCart"
              actionBotDataToggle="offcanvas"
            />
            <ProductCard
              variant="miniList"
              product={p[4]}
              cardClass="wow fadeInUp"
              imgWidth={160}
              imgHeight={160}
              actionBotLabel="Add to cart"
              actionBotHref="#shoppingCart"
              actionBotDataToggle="offcanvas"
            />
            <ProductCard
              variant="miniList"
              product={p[5]}
              cardClass="wow fadeInUp d-none d-md-flex"
              imgWidth={160}
              imgHeight={160}
              actionBotLabel="Add to cart"
              actionBotHref="#shoppingCart"
              actionBotDataToggle="offcanvas"
            />
          </div>

          {/* Slide 4 — mobile-only duplicates for items hidden on small screens */}
          <div className="tf-list vertical gap-16">
            <ProductCard
              variant="miniList"
              product={p[2]}
              imgWidth={160}
              imgHeight={160}
              actionBotLabel="Add to cart"
              actionBotHref="#shoppingCart"
              actionBotDataToggle="offcanvas"
            />
            <ProductCard
              variant="miniList"
              product={p[5]}
              imgWidth={160}
              imgHeight={160}
              actionBotLabel="Add to cart"
              actionBotHref="#shoppingCart"
              actionBotDataToggle="offcanvas"
            />
          </div>
        </TfSwiper>
      </div>
    </section>
  );
}

export default Featured;
