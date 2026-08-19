import Link from "next/link";
import Image from "next/image";
import CountdownTimer from "@/components/common/Countdown";
function BannerCountdown() {
  return (
    <>
      <div className="banner-countdown-v03 flat-spacing">
        <div className="banner-image">
          <Image
            loading="lazy"
            width={1920}
            height={600}
            src="/assets/images/section/banner-32.jpg"
            alt="Image"
          />
        </div>
        <div className="container position-relative z-3">
          <div className="banner-content wow fadeInUp">
            <h1 className="title text-white">
              Glow On Sale. Your <br className="d-none d-sm-block" />
              Radiance Starts Here
            </h1>
            <p className="desc text-white text-body-1">
              Discover your perfect skincare ritual and save while it lasts
            </p>
            <div className="countdown-v02 full-white">
              <div className="js-countdown cd-has-zero cd-custom">
                {" "}
                <CountdownTimer style={7} />
              </div>
            </div>
            <Link
              href={`/shop-default`}
              className="btn-action tf-btn btn-white"
            >
              <span>Shop Now - $69.99</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default BannerCountdown;
