import TfSwiper from "@/components/ui/TfSwiper";
import ProductCard from "@/components/ui/ProductCard";
import { topPicsProducts } from "@/data/products/products";

function TopPicsProducts() {
  return (
    <section className="flat-spacing pt-0">
      <div className="container">
        <div className="sect-heading type-2 text-center wow fadeInUp">
          <h3 className="s-title">Today&apos;s Top Picks</h3>
          <p className="s-desc text-body-1 cl-text-2">
            Fresh styles just in! Elevate your look.
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
          {topPicsProducts.map((product) => (
            <ProductCard key={product.img} product={product} />
          ))}
        </TfSwiper>
      </div>
    </section>
  );
}

export default TopPicsProducts;
