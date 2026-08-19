import TfSwiper from "@/components/ui/TfSwiper";
import ProductCard from "@/components/ui/ProductCard";
import { topPicksCosmeticProducts } from "@/data/products/products";

function TopPicksThisWeek() {
  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="sect-heading type-2 text-center wow fadeInUp">
          <h3 className="s-title">Find Your Perfect Match</h3>
          <p className="s-desc text-body-1 cl-text-2">
            From glow boosting serums to timeless beauty must haves start your
            routine today.
          </p>
        </div>
        <TfSwiper
          className="wrap-sw-over"
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
        >
          {topPicksCosmeticProducts.map((product) => (
            <ProductCard
              key={product.img}
              product={product}
              imgWidth={330}
              imgHeight={440}
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

export default TopPicksThisWeek;
