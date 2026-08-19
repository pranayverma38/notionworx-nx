import { products } from "@/data/products/products";
import ProductCard from "@/components/ui/ProductCard";
import TfSwiper from "@/components/ui/TfSwiper";

function MayBe() {
  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="sect-heading">
          <h4>You may be interested in…</h4>
        </div>
        <TfSwiper
          preview={4}
          tablet={3}
          mobileSm={2}
          mobile={2}
          spaceLg={30}
          spaceMd={20}
          space={10}
          paginationLg={4}
          paginationMd={3}
          paginationSm={2}
          pagination={2}
          paginationClassName="sw-line-default style-2 tf-sw-pagination"
        >
          {products.slice(4, 12).map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </TfSwiper>
      </div>
    </section>
  );
}

export default MayBe;
