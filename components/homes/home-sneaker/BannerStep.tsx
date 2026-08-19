import Image from "next/image";
import ProductCard from "@/components/ui/ProductCard";
import { bannerStepSneakerProducts } from "@/data/products/products";

const BANNER = {
  img: "/assets/images/section/banner-68.jpg",
  title: "Step Into Better",
  titleBreak: "Movement",
};

const BENEFITS = [
  { icon: "icon-Wind", text: "Breathable Comfort" },
  { icon: "icon-Feather", text: "Enhanced Cushioning" },
  { icon: "icon-SneakerMove", text: "Superior Traction" },
  { icon: "icon-Exclude", text: "Flexible Support" },
  { icon: "icon-Sparkle", text: "Lightweight Design" },
  { icon: "icon-ShieldCheck", text: "Durable Construction" },
];

function BannerStep() {
  return (
    <section className="banner-v07">
      <div className="banner-image">
        <Image
          src={`${BANNER.img}`}
          alt=""
          width={1920}
          height={900}
          loading="lazy"
        />
      </div>
      <div className="banner-content flat-spacing-2">
        <div className="container-full full-v3">
          <p className="bn_title text-128 fw-medium text-white wow fadeInUp">
            {BANNER.title} <br />
            {BANNER.titleBreak}
          </p>
          <div className="row justify-content-between align-items-end gy-30">
            <div className="col-lg-6 col-xxl-4">
              <div className="tf-grid-layout ssm-col-2 md-col-3 gap-20 wow fadeInUp">
                {BENEFITS.map((item) => (
                  <div key={item.icon} className="wg-benefit text-white">
                    <i className={`bnf-ic icon ${item.icon}`} aria-hidden />
                    <h6 className="bnf-text">{item.text}</h6>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-6 col-xxl-5">
              <div className="tf-grid-layout d-sm-flex justify-content-end cl-xl-gap-38">
                {bannerStepSneakerProducts.map((product) => (
                  <ProductCard
                    key={product.img}
                    product={product}
                    showRatting={false}
                    variant="shopGridHover03"
                    wrapperClass="square"
                    cardClass="card-product_v02 style-2"
                    imgWidth={300}
                    imgHeight={300}
                    actionBotLabel="Quick Add"
                    actionBotHref="#quickAdd"
                    actionBotDataToggle="modal"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BannerStep;
