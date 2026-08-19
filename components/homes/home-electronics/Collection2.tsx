import Link from "next/link";
import Image from "next/image";
export default function Collection2() {
  return (
    <div className="flat-spacing">
      <div className="container">
        <div className="tf-grid-layout sm-col-2">
          <div className="box-image_v04">
            <Link href={`/shop-default`} className="box-image_img img-style">
              <Image
                loading="lazy"
                width={690}
                height={388}
                src="/assets/images/collection/cls-11.jpg"
                alt="Image"
              />
            </Link>
            <div className="box-image_content wow fadeInUp">
              <Link href={`/shop-default`} className="title h3 fw-medium link">
                Table Lamp Sale
              </Link>
              <p className="desc text-body-1 cl-text-2 ">
                Up to 50% Off Bestsellers.
              </p>
              <Link
                href={`/shop-default`}
                className="btn-action tf-btn-line-2 style-primary"
              >
                <span className="fw-semibold">Shop Now</span>
              </Link>
            </div>
          </div>
          <div className="box-image_v04">
            <Link href={`/shop-default`} className="box-image_img img-style">
              <Image
                loading="lazy"
                width={690}
                height={388}
                src="/assets/images/collection/cls-12.jpg"
                alt="Image"
              />
            </Link>
            <div className="box-image_content wow fadeInUp">
              <Link
                href={`/shop-default`}
                className="title h3 fw-medium text-white link"
              >
                Hear Every Detail
              </Link>
              <p className="desc text-body-1 cl-text-line">
                Power comfort clarity.
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
    </div>
  );
}
