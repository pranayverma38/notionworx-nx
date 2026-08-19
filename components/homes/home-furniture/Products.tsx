import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import ProductCard from "@/components/ui/ProductCard";
import { productsFurniture } from "@/data/products/products";

function Products() {
  return (
    <section className="flat-spacing">
      <div className="sect-heading type-2 wow fadeInUp">
        <div className="container">
          <div className="row align-items-center gy-12">
            <div className="col-lg-7">
              <h3>
                Where Comfort Meets <br />
                Timeless Design.
              </h3>
            </div>
            <div className="col-lg-5">
              <p className="text-body-1 cl-text-2 mb-12">
                Explore furniture pieces made to elevate daily life with subtle
                elegance and lasting quality.
              </p>
              <Link
                href="/shop-default"
                className="tf-btn-line-2 style-primary pb-4"
              >
                <span className="fw-semibold">View All Products</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
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
          {productsFurniture.map((product) => (
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

export default Products;
