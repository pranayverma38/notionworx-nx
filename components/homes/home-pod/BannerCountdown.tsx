import CountdownTimer from "@/components/common/Countdown";
import Link from "next/link";
function BannerCountdown() {
  return (
    <>
      <div className="banner-countdown-v01 bg-primary">
        <div className="container-2">
          <div className="content">
            <div className="col-left">
              <h3 className="text-white mb-8">Hurry! Deals On</h3>
              <p className="text-white">
                Up to 50% Off Selected Styles. Don&apos;t Miss Out.
              </p>
            </div>
            <div className="countdown-v01 text-white">
              <div className="js-countdown cd-has-zero cd-custom">
                <CountdownTimer style={7} />
              </div>
            </div>
            <Link href={`/shop-default`} className="tf-btn btn-white">
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default BannerCountdown;
