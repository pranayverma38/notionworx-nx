import Link from "next/link";
import Image from "next/image";
function Banner() {
  return (
    <>
      <div className="section-banner-collection-v02 flat-spacing">
        <div className="container-full">
          <div className="wrap-banner">
            <div className="banner-image-text type-abs style-17 hover-img4 mb-20 item-1">
              <Link
                href={`/shop-default`}
                className="bn-image img-style img-style4"
              >
                <Image
                  loading="lazy"
                  width={428}
                  height={317}
                  src="/assets/images/section/banner-42.jpg"
                  alt="Image"
                />
              </Link>
              <div className="bn-content wow fadeInUp">
                <Link
                  href={`/shop-default`}
                  className="title h4 fw-medium text-white link"
                >
                  Game Mode
                </Link>
              </div>
            </div>
            <div className="banner-image-text type-abs style-17 hover-img4 item-2">
              <Link
                href={`/shop-default`}
                className="bn-image img-style img-style4"
              >
                <Image
                  loading="lazy"
                  width={428}
                  height={317}
                  src="/assets/images/section/banner-43.jpg"
                  alt="Image"
                />
              </Link>
              <div className="bn-content wow fadeInUp">
                <Link
                  href={`/shop-default`}
                  className="title h4 fw-medium text-white link"
                >
                  Active Life
                </Link>
              </div>
            </div>
            <div className="banner-image-text type-abs style-17 large hover-img4 large item-3">
              <Link
                href={`/shop-default`}
                className="bn-image img-style img-style4"
              >
                <Image
                  loading="lazy"
                  width={875}
                  height={653}
                  src="/assets/images/section/banner-44.jpg"
                  alt="Image"
                />
              </Link>
              <div className="bn-content wow fadeInUp">
                <Link
                  href={`/shop-default`}
                  className="title h3 fw-medium text-white link mb-8"
                >
                  Explore Your Sound World
                </Link>
                <p className="text-body-1 text-white">
                  Headphones are here for every single moment of your life
                  journey.
                </p>
              </div>
            </div>
            <div className="banner-image-text type-abs style-17 hover-img4 mb-20 item-4">
              <Link
                href={`/shop-default`}
                className="bn-image img-style img-style4"
              >
                <Image
                  loading="lazy"
                  width={428}
                  height={317}
                  src="/assets/images/section/banner-45.jpg"
                  alt="Image"
                />
              </Link>
              <div className="bn-content wow fadeInUp">
                <Link
                  href={`/shop-default`}
                  className="title h4 fw-medium text-white link"
                >
                  Top Sale
                </Link>
              </div>
            </div>
            <div className="banner-image-text type-abs style-17 hover-img4 item-5">
              <Link
                href={`/shop-default`}
                className="bn-image img-style img-style4"
              >
                <Image
                  loading="lazy"
                  width={428}
                  height={317}
                  src="/assets/images/section/banner-46.jpg"
                  alt="Image"
                />
              </Link>
              <div className="bn-content wow fadeInUp">
                <Link
                  href={`/shop-default`}
                  className="title h4 fw-medium text-white link"
                >
                  Noise Off
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Banner;
