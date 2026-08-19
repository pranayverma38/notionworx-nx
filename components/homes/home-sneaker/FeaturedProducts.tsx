import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import ProductCard from "@/components/ui/ProductCard";
import { featuredSneakerProducts } from "@/data/products/products";

export default function FeaturedProducts() {
  return (
    <section className="flat-spacing">
      <div className="container-full">
        <div className="sect-heading has-col-right align-items-center wow fadeInUp">
          <div>
            <h3 className="s-title mb-8">Featured Products</h3>
            <p className="s-desc cl-text-2 text-body-1">
              Top picks curated for your active lifestyle.
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
          paginationClassName="sw-line-default style-2 tf-sw-pagination"
          className="wrap-sw-over"
        >
          {featuredSneakerProducts.map((product) => (
            <ProductCard
              wrapperClass="square"
              key={product.id}
              product={product}
            />
          ))}
        </TfSwiper>
      </div>
    </section>
  );
}
