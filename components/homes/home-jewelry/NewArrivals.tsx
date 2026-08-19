import TfSwiper from "@/components/ui/TfSwiper";
import ProductCard from "@/components/ui/ProductCard";
import { newArrivalsJewelryProducts } from "@/data/products/products";

function NewArrivals() {
  return (
    <section className="flat-spacing ">
      <div className="container">
        <div className="sect-heading type-4 align-items-end">
          <div className="flex-sm-1  wow fadeInUp">
            <h3 className="s-title mb-8">New Arrivals</h3>
            <p className="s-subtitle cl-text-2">
              Fresh designs to refresh your jewellery collection
            </p>
          </div>
          <div
            className="group-btn-slider wow fadeInUp d-sm-flex d-none"
            data-wow-delay="0.1s"
          >
            <div className="tf-sw-nav-2 style-large rounded-8 nav-prev-swiper">
              <i className="icon icon-ArrowLeft" aria-hidden />
            </div>
            <div className="tf-sw-nav-2 style-large rounded-8 nav-next-swiper">
              <i className="icon icon-ArrowRight" aria-hidden />
            </div>
          </div>
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
          externalNavSelectors={{
            prevEl: ".nav-prev-swiper",
            nextEl: ".nav-next-swiper",
          }}
        >
          {newArrivalsJewelryProducts.map((product) => (
            <ProductCard
              key={product.img}
              product={product}
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

export default NewArrivals;
