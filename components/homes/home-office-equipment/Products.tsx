import TfSwiper from "@/components/ui/TfSwiper";
import ProductCard from "@/components/ui/ProductCard";
import { productsOfficeEquipment } from "@/data/products/products";

function Products() {
  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="sect-heading type-2 text-center wow fadeInUp">
          <h3 className="s-title">Popular Products</h3>
          <p className="s-desc text-body-1 cl-text-2">
            These are the most popular and hottest products on the market right
            now.
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
          paginationClassName="sw-dot-default tf-sw-pagination"
        >
          {productsOfficeEquipment.map((product) => (
            <ProductCard
              key={product.img}
              product={product}
              wrapperClass="square"
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

export default Products;
