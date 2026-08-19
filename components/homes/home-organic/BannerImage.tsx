import Link from "next/link";
import Image from "next/image";
import CountdownTimer from "@/components/common/Countdown";
function BannerImage() {
  return (
    <>
      <div className="tf-grid-layout sm-col-2 xl-col-3 gap-10">
        <div className="banner-countdown-v04">
          <div className="banner-image">
            <Image
              loading="lazy"
              width={633}
              height={856}
              src="/assets/images/section/banner-38.jpg"
              alt="Image"
            />
          </div>
          <div className="banner-content text-center">
            <h2 className="title text-white mb-8 wow fadeInUp">
              Grand Opening Sale
            </h2>
            <p className="desc text-white mb-20 wow fadeInUp">
              Up to 30% off all organic products!
            </p>
            <div className="countdown-v01 text-white d-flex justify-content-center">
              <div className="js-countdown cd-has-zero cd-custom">
                <CountdownTimer style={7} />
              </div>
            </div>
            <Link href={`/shop-default`} className="tf-btn btn-white">
              Shop Now
            </Link>
          </div>
        </div>
        <div className="tf-grid-layout gap-10">
          <div className="banner-image-text type-abs style-13">
            <Link href={`/shop-default`} className="bn-image img-style">
              <Image
                loading="lazy"
                width={654}
                height={436}
                src="/assets/images/section/banner-34.jpg"
                alt="Image"
              />
            </Link>
            <div className="bn-content wow fadeInUp">
              <h6 className="desc text-primary mb-0">Up to 25% off</h6>
              <Link href={`/shop-default`} className="title h3 fw-medium link">
                Seasonal Fruits Offer
              </Link>
              <Link
                href={`/shop-default`}
                className="btn-action tf-btn btn-white"
              >
                Shop Now
              </Link>
            </div>
          </div>
          <div className="banner-image-text type-abs style-13">
            <Link href={`/shop-default`} className="bn-image img-style">
              <Image
                loading="lazy"
                width={654}
                height={436}
                src="/assets/images/section/banner-35.jpg"
                alt="Image"
              />
            </Link>
            <div className="bn-content wow fadeInUp">
              <h6 className="desc text-primary mb-0">Most Loved Picks</h6>
              <Link href={`/shop-default`} className="title h3 fw-medium link">
                Organic Coffee Blend
              </Link>
              <Link
                href={`/shop-default`}
                className="btn-action tf-btn btn-white"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
        <div className="tf-grid-layout gap-10 sm-col-2 xl-col-1 xl-wd-full">
          <div className="banner-image-text type-abs style-13">
            <Link href={`/shop-default`} className="bn-image img-style">
              <Image
                loading="lazy"
                width={654}
                height={436}
                src="/assets/images/section/banner-36.jpg"
                alt="Image"
              />
            </Link>
            <div className="bn-content wow fadeInUp">
              <h6 className="desc text-primary mb-0">Top Organic Choices</h6>
              <Link href={`/shop-default`} className="title h3 fw-medium link">
                Fresh Veggies Deal
              </Link>
              <Link
                href={`/shop-default`}
                className="btn-action tf-btn btn-white"
              >
                Shop Now
              </Link>
            </div>
          </div>
          <div className="banner-image-text type-abs style-13">
            <Link href={`/shop-default`} className="bn-image img-style">
              <Image
                loading="lazy"
                width={654}
                height={436}
                src="/assets/images/section/banner-37.jpg"
                alt="Image"
              />
            </Link>
            <div className="bn-content wow fadeInUp">
              <h6 className="desc text-primary mb-0">Most Loved Picks</h6>
              <Link href={`/shop-default`} className="title h3 fw-medium link">
                Healthy Starts Here
              </Link>
              <Link
                href={`/shop-default`}
                className="btn-action tf-btn btn-white"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BannerImage;
