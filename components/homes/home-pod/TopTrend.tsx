import TfSwiper from "@/components/ui/TfSwiper";
import ProductCard from "@/components/ui/ProductCard";
import { topTrendPodProducts } from "@/data/products/products";

function TopTrend() {
  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="sect-heading type-2 text-center wow fadeInUp">
          <h3 className="s-title">Top Trending</h3>
          <p className="s-desc text-body-1 cl-text-2">
            Browse our Top Trending: the hottest picks loved by all.
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
          grid={2}
          paginationClassName="sw-dot-default tf-sw-pagination"
        >
          {topTrendPodProducts.map((product) => (
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

export default TopTrend;
