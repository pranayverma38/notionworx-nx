import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import ProductCard from "@/components/ui/ProductCard";
import { topPickPetProducts } from "@/data/products/products";

function TopPick() {
  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="sect-heading type-2 has-col-right wow fadeInUp">
          <div>
            <h3 className="s-title">Top Pet Picks This Week</h3>
            <p className="s-desc cl-text-2 text-body-1">
              Curated favorites chosen to make your pets&apos; days more fun and
              comfortable.
            </p>
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
          {topPickPetProducts.map((product) => (
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

export default TopPick;
