import Image from "next/image";
function BannerSale() {
  return (
    <>
      <section className="themesFlat">
        <div className="container">
          <div className="banner-sale">
            <div className="bn-bg">
              <Image
                loading="lazy"
                width={1410}
                height={144}
                src="/assets/images/section/bg-percent.png"
                alt="Image"
              />
            </div>
            <div className="wrap-1">
              <p className="text-display fw-7 text-primary">35%</p>
            </div>
            <div className="wrap-2">
              <h4 className="fw-7 text-primary">
                Super Discount For Your First Purchase
              </h4>
              <p className="text-body-1 cl-text-2">
                Use discount code in checkout page..
              </p>
            </div>
            <p className="coupon-copy-wrap h6 fw-medium cs-pointer">
              Code:
              <span className="coupon-code">Amerce</span>
              <i className="icon icon-CopySimple fs-24" />
            </p>
            <div className="img-item">
              <Image
                className="wow fadeZoom"
                loading="lazy"
                width={390}
                height={390}
                src="/assets/images/item/graphic-item-2.png"
                alt="Image"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default BannerSale;
