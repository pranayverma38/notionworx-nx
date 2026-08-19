import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import ProductCard from "@/components/ui/ProductCard";
import { popularOrganicProducts } from "@/data/products/products";

function Popular() {
  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="sect-heading type-2 has-col-right wow fadeInUp">
          <div>
            <p className="s-desc cl-text-3 fw-semibold mb-8">
              Nature&apos;s New Finds
            </p>
            <h2 className="s-title font-outfit mb-0 letter-space-0">
              Popular Product
            </h2>
          </div>
          <div className="col-right">
            <Link
              href="/shop-default"
              className="tf-btn-line-2 py-4 style-primary"
            >
              <span className="fw-semibold">View All Products</span>
            </Link>
          </div>
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
          {popularOrganicProducts.map((product) => (
            <ProductCard
              key={product.img}
              product={product}
              imgWidth={330}
              imgHeight={440}
              actionBotLabel="Add to cart"
              actionBotHref="#shoppingCart"
              actionBotDataToggle="offcanvas"
            />
          ))}
        </TfSwiper>
      </div>
    </section>
  );
}

export default Popular;
