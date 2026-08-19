import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import ProductCard from "@/components/ui/ProductCard";
import { productFeatureFashion2Products } from "@/data/products/products";

function ProductFeature() {
  return (
    <section className="flat-spacing">
      <div className="container-full">
        <div className="row">
          <div className="col-lg-3">
            <div className="sect-heading wow fadeInUp">
              <h3 className="s-title mb-8">Featured Sweaters and Knits</h3>
              <p className="text-body-1 cl-text-2">
                Our curated knitwear collection for maximum warmth and
                flawless style.
              </p>
            </div>
            <Link
              href="/shop-default"
              className="tf-btn animate-btn wow fadeInUp mb-30"
            >
              View All Products
            </Link>
          </div>
          <div className="col-lg-9">
            <TfSwiper
              className="wrap-sw-over"
              preview={3}
              tablet={3}
              mobileSm={2}
              mobile={2}
              spaceLg={30}
              spaceMd={20}
              space={10}
              pagination={2}
              paginationSm={2}
              paginationMd={3}
              paginationLg={3}
              paginationClassName="sw-dot-default tf-sw-pagination"
            >
              {productFeatureFashion2Products.map((product, index) => (
                <ProductCard
                  key={product.img}
                  product={product}
                  imgWidth={330}
                  imgHeight={440}
                  actionBotLabel={
                    index === 1 ? "Add to Cart" : "Quick Add"
                  }
                  actionBotHref={
                    index === 1 ? "#shoppingCart" : "#quickAdd"
                  }
                  actionBotDataToggle={
                    index === 1 ? "offcanvas" : "modal"
                  }
                />
              ))}
            </TfSwiper>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductFeature;
