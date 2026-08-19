import TfSwiper from "@/components/ui/TfSwiper";
import ProductCard from "@/components/ui/ProductCard";
import { topPicksDecorProducts } from "@/data/products/products";

function TopPicksThisWeek() {
  return (
    <section className="flat-spacing pt-0">
      <div className="container">
        <div className="sect-heading type-2 text-center wow fadeInUp">
          <h3 className="s-title">Discover New Products</h3>
          <p className="s-desc cl-text-2">
            Top styles everyone&apos;s talking about.
          </p>
        </div>
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
          paginationClassName="sw-dot-default tf-sw-pagination"
        >
          {topPicksDecorProducts.map((product) => (
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

export default TopPicksThisWeek;
