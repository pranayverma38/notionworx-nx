import TfSwiper from "@/components/ui/TfSwiper";
import ProductCard from "@/components/ui/ProductCard";
import { topPicksConstruction2Products } from "@/data/products/products";

function TopPicksThisWeek2() {
  return (
    <section>
      <div className="container">
        <div className="sect-heading type-2 text-center wow fadeInUp">
          <h3 className="s-title">Top Picks This Week</h3>
          <p className="s-desc text-body-1 cl-text-2">
            Weekly Favorites Selected With Care To Support Your Wellbeing.
          </p>
        </div>
        <TfSwiper
          className="wrap-sw-over"
          preview={4}
          tablet={3}
          mobile={2}
          spaceLg={30}
          spaceMd={20}
          space={10}
          paginationSm={1}
          paginationMd={3}
          paginationLg={4}
          paginationClassName="sw-dot-default tf-sw-pagination"
        >
          {topPicksConstruction2Products.map((product) => (
            <ProductCard
              key={product.img}
              product={product}
              wrapperClass="square"
              cardClass="product-style_stroke"
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

export default TopPicksThisWeek2;
