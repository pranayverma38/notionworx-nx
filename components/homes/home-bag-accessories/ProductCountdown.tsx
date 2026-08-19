import TfSwiper from "@/components/ui/TfSwiper";
import ProductCard from "@/components/ui/ProductCard";
import { productCountdownBagProducts } from "@/data/products/products";
import CountdownTimer from "@/components/common/Countdown";

function ProductCountdown() {
  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="sect-heading type-2 has-col-right align-items-center wow fadeInUp">
          <div>
            <h3 className="s-title">Limited-Time Deals On!</h3>
            <p className="s-desc text-body-1 cl-text-2">
              Up to 50% Off Selected Style. Don&apos;t Miss Out
            </p>
          </div>
          <div className="col-right">
            <div className="countdown-v08 h4 ">
              <div className="js-countdown cd-has-zero cd-custom">
                <CountdownTimer style={7} />
              </div>
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
          paginationClassName="sw-line-default style-2 tf-sw-pagination"
        >
          {productCountdownBagProducts.map((product) => (
            <ProductCard
              key={product.img}
              product={product}
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

export default ProductCountdown;
