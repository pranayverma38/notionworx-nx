import Link from "next/link";
import Image from "next/image";
function BannerText() {
  return (
    <>
      <div className="themesFlat">
        <div className="container">
          <div className="banner-image-text type-abs style-14 type-2">
            <Link href={`/shop-default`} className="bn-image img-style">
              <Image
                loading="lazy"
                width={1410}
                height={400}
                src="/assets/images/section/banner-8.jpg"
                alt="Image"
              />
            </Link>
            <div className="bn-content wow fadeInUp">
              <Link href={`/shop-default`} className="title h2 fw-medium link">
                Nature’s Support <br className="d-none d-sm-block" />
                For Modern Life
              </Link>
              <h6 className="desc text-body-1 cl-text-2 sm-cl-black letter-space--1">
                Balanced nutrition made simple — support
                <br className="d-none d-sm-block" />
                your body and mind every single day.
              </h6>
              <Link
                href={`/shop-default`}
                className="btn-action tf-btn btn-white"
              >
                Shop Styles
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BannerText;
