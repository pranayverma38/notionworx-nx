import Link from "next/link";
import Image from "next/image";
function BannerProduct() {
  return (
    <>
      <div className="themesFlat">
        <div className="container-full">
          <div className="tf-grid-layout md-col-2 gap-20">
            <div className="banner-image-text type-abs style-6">
              <Link href={`/shop-default`} className="bn-image img-style">
                <Image
                  loading="lazy"
                  width={875}
                  height={680}
                  src="/assets/images/section/banner-17.jpg"
                  alt="Image"
                />
              </Link>
              <div className="bn-content wow fadeInUp">
                <p className="desc text-caption-01 fw-semibold text-white">
                  HEALTHY MEALS FOR DOGS
                </p>
                <Link
                  href={`/shop-default`}
                  className="title h2 fw-medium link text-white mb-24"
                >
                  Fuel Their Energy <br />
                  Every Day
                </Link>
                <Link
                  href={`/shop-default`}
                  className="btn-action tf-btn btn-white"
                >
                  Shop Now
                </Link>
              </div>
            </div>
            <div className="banner-image-text type-abs style-6">
              <Link href={`/shop-default`} className="bn-image img-style">
                <Image
                  loading="lazy"
                  width={875}
                  height={680}
                  src="/assets/images/section/banner-18.jpg"
                  alt="Image"
                />
              </Link>
              <div className="bn-content wow fadeInUp">
                <p className="desc text-caption-01 fw-semibold">
                  TASTY BITES FOR CATS
                </p>
                <Link
                  href={`/shop-default`}
                  className="title h2 fw-medium link mb-24"
                >
                  Keep Them Purring <br />
                  All Day
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
      </div>
    </>
  );
}

export default BannerProduct;
