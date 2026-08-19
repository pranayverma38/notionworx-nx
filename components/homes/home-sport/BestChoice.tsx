import TfSwiper from "@/components/ui/TfSwiper";
import ProductCard from "@/components/ui/ProductCard";
import { bestChoiceSportProducts } from "@/data/products/products";

function BestChoice() {
  return (
    <section className="flat-spacing pt-0">
      <div className="container">
        <div className="sect-heading type-2 text-center wow fadeInUp">
          <h3 className="s-title">Performance Starts Here</h3>
          <p className="s-desc text-body-1 cl-text-2">
            Premium sports gear crafted for durability, comfort, and results.
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
          grid={2}
          paginationClassName="sw-dot-default tf-sw-pagination"
        >
          {bestChoiceSportProducts.map((product) => (
            <ProductCard
              key={product.img}
              product={product}
              wrapperClass="square"
              imgWidth={330}
              imgHeight={440}
              actionBotLabel="Quick Add"
              actionBotHref="#quickAdd"
              actionBotDataToggle="modal"
            />
          ))}
        </TfSwiper>
      </div>
    </section>
  );
}

export default BestChoice;
