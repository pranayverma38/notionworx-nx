import Link from "next/link";
import Image from "next/image";
function BannerImage() {
  return (
    <>
      <div className="flat-spacing">
        <div className="container">
          <div
            className="banner-image-text type-abs style-10 parallaxie"
            style={{
              backgroundImage: 'url("/assets/images/section/banner-29.jpg")',
            }}
          >
            <Link href={`/shop-default`} className="bn-image img-style">
              <Image
                className="opacity-0"
                loading="lazy"
                width={1410}
                height={480}
                src="/assets/images/section/banner-29.jpg"
                alt="Image"
              />
            </Link>
            <div className="bn-content align-items-center text-center wow fadeInUp">
              <p className="mini-title fw-semibold text-white">
                Summer 2025 Sale Event
              </p>
              <Link
                href={`/shop-default`}
                className="title h2 fw-medium text-white link"
              >
                Enjoy Up To 50% Off
              </Link>
              <p className="desc text-white text-body-1">
                Perfect pieces for your favorite spaces.
              </p>
              <Link
                href={`/shop-default`}
                className="btn-action tf-btn btn-white style-2 "
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
