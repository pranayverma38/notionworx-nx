import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import ProductCard from "@/components/ui/ProductCard";
import { productsSneaker } from "@/data/products/products";

function Products() {
  return (
    <section className="flat-spacing pt-0">
      <div className="container-full">
        <div className="sect-heading has-col-right align-items-center wow fadeInUp">
          <div>
            <h3 className="s-title mb-8">Today&apos;s Best Choices</h3>
            <p className="s-desc cl-text-2 text-body-1">
              Handpicked sport shoes trending right now.
            </p>
          </div>
          <Link
            href="/shop-default"
            className="text-body-1 cl-text-2 text-decoration-underline link"
          >
            View More
          </Link>
        </div>
        <TfSwiper
          className="wrap-sw-over"
          laptop={5}
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
          {productsSneaker.map((product) => (
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

export default Products;
