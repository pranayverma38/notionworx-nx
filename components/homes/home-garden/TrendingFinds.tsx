import TfSwiper from "@/components/ui/TfSwiper";
import ProductCard from "@/components/ui/ProductCard";
import { trendingFindsGardenProducts } from "@/data/products/products";

function TrendingFinds() {
  return (
    <section className="flat-spacing ">
      <div className="container">
        <div className="sect-heading type-4 align-items-end mb-43">
          <div className="flex-sm-1  wow fadeInUp">
            <h3 className="s-title mb-6">Trending Green Finds</h3>
            <p className="s-subtitle text-body-1 cl-text-2">
              Popular choices that bring freshness and character to any room.
            </p>
          </div>
          <div
            className="group-btn-slider wow fadeInUp d-md-flex d-none"
            data-wow-delay="0.1s"
          >
            <div className="tf-sw-nav-2 style-large rounded-8 nav-prev-swiper">
              <i className="icon icon-ArrowLeft" aria-hidden />
            </div>
            <div className="tf-sw-nav-2 style-large rounded-8 nav-next-swiper">
              <i className="icon icon-ArrowRight" aria-hidden />
            </div>
          </div>
        </div>
        <TfSwiper
          preview={4}
          tablet={3}
          mobileSm={2}
          mobile={2}
          spaceLg={30}
          spaceMd={20}
          space={10}
          pagination={2}
          paginationSm={2}
          paginationMd={3}
          paginationLg={4}
          paginationClassName="sw-dot-default tf-sw-pagination"
          externalNavSelectors={{
            prevEl: ".nav-prev-swiper",
            nextEl: ".nav-next-swiper",
          }}
        >
          {trendingFindsGardenProducts.map((product) => (
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
    </section>
  );
}

export default TrendingFinds;
