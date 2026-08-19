import TfSwiper from "@/components/ui/TfSwiper";
import ProductCard from "@/components/ui/ProductCard";
import { topPicksProducts } from "@/data/products/products";

function TopPicksThisWeek() {
  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="sect-heading type-2 text-center wow fadeInUp">
          <h3 className="s-title">Top Trending</h3>
          <p className="s-desc text-body-1 cl-text-2">
            Browse our Top Trending picks loved by all.
          </p>
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
          className="wrap-sw-over"
          paginationClassName="sw-dot-default tf-sw-pagination"
        >
          {topPicksProducts.map((product) => (
            <ProductCard key={product.img} product={product} />
          ))}
        </TfSwiper>
      </div>
    </section>
  );
}

export default TopPicksThisWeek;
