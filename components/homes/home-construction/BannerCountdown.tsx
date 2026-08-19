import CountdownTimer from "@/components/common/Countdown";
import Image from "next/image";
function BannerCountdown() {
  return (
    <>
      <div className="container flat-spacing">
        <div className="banner-countdown-v01 style-4 ">
          <div className="banner-img">
            <Image
              className="img-cover"
              width={1410}
              height={180}
              loading="lazy"
              decoding="async"
              src="/assets/images/section/banner-countdown.jpg"
              alt="banner"
            />
          </div>
          <div className="content">
            <div className="col-left">
              <h2 className="text-white mb-8">Hurry! Deals On</h2>
              <p className="text-white text-body-1">
                Up to 50% Off Selected Styles. Don&apos;t Miss Out.
              </p>
            </div>
            <div className="countdown-v01 text-white">
              <div className="js-countdown cd-has-zero cd-custom">
                <CountdownTimer style={7} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BannerCountdown;
