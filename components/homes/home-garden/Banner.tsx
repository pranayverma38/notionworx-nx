import Link from "next/link";
import Image from "next/image";
function Banner() {
  return (
    <>
      <div className="section-banner-cls-v02">
        <div className="left">
          <div className="banner-image-text style-top-left tl-2">
            <Link
              href={`/shop-default`}
              className="bn-image img-style rounded-0"
            >
              <Image
                loading="lazy"
                width={640}
                height={954}
                src="/assets/images/section/banner-49.jpg"
                alt="Image"
              />
            </Link>
            <div className="bn-content">
              <Link
                href={`/shop-default`}
                className="title h2 fw-medium link text-white mb-8"
              >
                Indoor Plant Picks
              </Link>
              <p className="desc lh-26 text-white mb-24">
                Lush, easy-care varieties for every corner
              </p>
              <Link
                href={`/shop-default`}
                className="btn-action tf-btn small-2 btn-white"
              >
                <span className="text-caption-01">Shop Now</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="right tf-grid-layout gap-10">
          <div className="tf-grid-layout sm-col-2 gap-10">
            <div className="banner-image-text type-abs style-20">
              <Link href={`/shop-default`} className="bn-image img-style">
                <Image
                  loading="lazy"
                  width={450}
                  height={608}
                  src="/assets/images/section/banner-50.jpg"
                  alt="Image"
                />
              </Link>
              <div className="bn-content wow fadeInUp">
                <Link
                  href={`/shop-default`}
                  className="title h3 fw-medium link text-white mb-8"
                >
                  Modern Plant Pots
                </Link>
                <p className="desc text-body-1 text-white mb-12">
                  Up to 50% Off Bestsellers.
                </p>
                <Link
                  href={`/shop-default`}
                  className="btn-action tf-btn-line-2 style-white"
                >
                  <span className="fw-semibold">Shop Now</span>
                </Link>
              </div>
            </div>
            <div className="banner-image-text type-abs style-20">
              <Link href={`/shop-default`} className="bn-image img-style">
                <Image
                  loading="lazy"
                  width={450}
                  height={608}
                  src="/assets/images/section/banner-51.jpg"
                  alt="Image"
                />
              </Link>
              <div className="bn-content wow fadeInUp">
                <Link
                  href={`/shop-default`}
                  className="title h3 fw-medium link text-white mb-8"
                >
                  Simple Plant Tools
                </Link>
                <p className="desc text-body-1 text-white mb-12">
                  Practical gear for simple
                </p>
                <Link
                  href={`/shop-default`}
                  className="btn-action tf-btn-line-2 style-white"
                >
                  <span className="fw-semibold">Shop Now</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="banner-image-text type-abs style-19">
            <Link href={`/shop-default`} className="bn-image img-style">
              <Image
                loading="lazy"
                width={450}
                height={608}
                src="/assets/images/section/banner-52.jpg"
                alt="Image"
              />
            </Link>
            <div className="bn-content wow fadeInUp">
              <Link
                href={`/shop-default`}
                className="title h3 fw-medium link text-white mb-8"
              >
                Home Green Decor
              </Link>
              <p className="desc text-body-1 text-white mb-12">
                Natural accents to refresh spaces.
              </p>
              <Link
                href={`/shop-default`}
                className="btn-action tf-btn-line-2 style-white"
              >
                <span className="fw-semibold">Shop Now</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Banner;
