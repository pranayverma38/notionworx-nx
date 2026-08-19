import CountdownTimer from "@/components/common/Countdown";

function BannerCountdown() {
  return (
    <>
      <section className="themesFlat">
        <div className="container">
          <div className="banner-countdown-v01 style-3 wow fadeInUp">
            <div className="content">
              <div className="col-left">
                <h5 className="mb-8">Limited Time Furniture Offers.</h5>
                <p className="text-body-1 cl-text-2">
                  Enjoy special pricing on designs for modern homes.
                </p>
              </div>
              <div className="countdown-v07 h1 fw-semibold">
                <div className="js-countdown cd-has-zero cd-custom">
                  <CountdownTimer style={3} />
                </div>
              </div>
              <p className="coupon-copy-wrap bg-dark animate-btn h6 fw-medium cs-pointer">
                Code:
                <span className="coupon-code">Amerce</span>
                <i className="icon icon-CopySimple fs-24" />
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default BannerCountdown;
