import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import ProductCard from "@/components/ui/ProductCard";
import { bestDealsAutoProducts } from "@/data/products/products";
import CountdownTimer from "@/components/common/Countdown";

function BestDealsOfTheWeek() {
  return (
    <section className="flat-spacing pt-0">
      <div className="container">
        <div className="sect-heading type-4 wow fadeInUp">
          <h3 className="s-title mb-0">Best Deals Of The Week!</h3>
          <div className="flex-1">
            <div className="countdown-v04">
              <div className="js-countdown cd-has-zero cd-custom h4">
                <CountdownTimer style={8} />
              </div>
            </div>
          </div>
          <Link
            href="/shop-default"
            className="tf-btn-line-2 py-4 style-primary"
          >
            <span className="fw-semibold">View All Products</span>
          </Link>
        </div>
        <div className="box-swiper-product">
          <TfSwiper
            preview={4}
            tablet={3}
            mobileSm={2}
            mobile={2}
            spaceLg={30}
            spaceMd={15}
            space={10}
            pagination={2}
            paginationSm={2}
            paginationMd={3}
            paginationLg={4}
            paginationClassName="sw-line-default style-2 tf-sw-pagination"
          >
            {bestDealsAutoProducts.map((product) => (
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
    </section>
  );
}

export default BestDealsOfTheWeek;
