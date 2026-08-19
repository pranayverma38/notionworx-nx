import Link from "next/link";
import Image from "next/image";
function BannerImage() {
  return (
    <>
      <div className="flat-spacing pt-0">
        <div className="container">
          <div className="tf-grid-layout md-col-2 gap-10">
            <div className="banner-image-text type-abs style-11 hover-img">
              <Link href={`/shop-default`} className="bn-image img-style">
                <Image
                  loading="lazy"
                  width={700}
                  height={700}
                  src="/assets/images/section/banner-30.jpg"
                  alt="Image"
                />
              </Link>
              <div className="bn-content wow fadeInUp">
                <Link
                  href={`/shop-default`}
                  className="title h2 fw-medium text-white link"
                >
                  ULTIMATE MOISTURE <br className="d-none d-md-block" />
                  CREAM DUO
                </Link>
                <p className="desc text-white text-body-1">
                  Nourish your skin with clinically proven hydration.
                </p>
                <Link
                  href={`/shop-default`}
                  className="btn-action tf-btn btn-white"
                >
                  Shop Now
                </Link>
              </div>
            </div>
            <div className="banner-image-text type-abs style-11 hover-img">
              <Link href={`/shop-default`} className="bn-image img-style">
                <Image
                  loading="lazy"
                  width={700}
                  height={700}
                  src="/assets/images/section/banner-31.jpg"
                  alt="Image"
                />
              </Link>
              <div className="bn-content wow fadeInUp">
                <Link
                  href={`/shop-default`}
                  className="title h2 fw-medium text-white link"
                >
                  LIFE CHANGING
                  <br className="d-none d-md-block" />
                  LIP MASK DUO
                </Link>
                <p className="desc text-white text-body-1">
                  Discover 2 hydrating lip masks with proven plump effect.
                </p>
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
      </div>
    </>
  );
}

export default BannerImage;
