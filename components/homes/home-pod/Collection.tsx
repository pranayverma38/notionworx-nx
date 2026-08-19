import Link from "next/link";
import Image from "next/image";
function Collection() {
  return (
    <>
      <div className="flat-spacing">
        <div className="container">
          <div className="tf-grid-layout md-col-2 xl-col-3 xl-gap-20">
            <div className="banner-image-text type-abs style-4">
              <Link href={`/shop-default`} className="bn-image img-style">
                <Image
                  loading="lazy"
                  width={450}
                  height={608}
                  src="/assets/images/section/banner-12.jpg"
                  alt="Image"
                />
              </Link>
              <div className="bn-content wow fadeInUp">
                <Link
                  href={`/shop-default`}
                  className="title h3 fw-medium text-white link"
                >
                  Save 25% <br className="d-none d-sm-block" />
                  Today
                </Link>
                <p className="desc cl-text-3 mb-28">
                  T-Shirts, Hoodies &amp; More
                </p>
                <Link
                  href={`/shop-default`}
                  className="btn-action tf-btn btn-white small "
                >
                  View More
                </Link>
              </div>
            </div>
            <div className="tf-grid-layout gap-20">
              <div className="box-image_v03 hover-img4">
                <Link
                  href={`/shop-default`}
                  className="box-image_img img-style4"
                >
                  <Image
                    loading="lazy"
                    width={450}
                    height={294}
                    src="/assets/images/category/cate-12.jpg"
                    alt="Image"
                  />
                </Link>
                <div className="box-image_content">
                  <Link
                    href={`/shop-default`}
                    className="title h6 fw-medium link"
                  >
                    Up To 35% Off
                    <i className="icon icon-ArrowUpRight" />
                  </Link>
                </div>
              </div>
              <div className="box-image_v03 hover-img4">
                <Link
                  href={`/shop-default`}
                  className="box-image_img img-style4"
                >
                  <Image
                    loading="lazy"
                    width={450}
                    height={294}
                    src="/assets/images/category/cate-13.jpg"
                    alt="Image"
                  />
                </Link>
                <div className="box-image_content">
                  <Link
                    href={`/shop-default`}
                    className="title h6 fw-medium link"
                  >
                    Free Shipping On All Orders
                    <i className="icon icon-ArrowUpRight" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="tf-grid-layout gap-20 md-col-2 xl-col-1 xl-wd-full">
              <div className="box-image_v03 hover-img4">
                <Link
                  href={`/shop-default`}
                  className="box-image_img img-style4"
                >
                  <Image
                    loading="lazy"
                    width={450}
                    height={294}
                    src="/assets/images/category/cate-14.jpg"
                    alt="Image"
                  />
                </Link>
                <div className="box-image_content">
                  <Link
                    href={`/shop-default`}
                    className="title h6 fw-medium link"
                  >
                    Free Gift With Purchase
                    <i className="icon icon-ArrowUpRight" />
                  </Link>
                </div>
              </div>
              <div className="box-image_v03 hover-img4">
                <Link
                  href={`/shop-default`}
                  className="box-image_img img-style4"
                >
                  <Image
                    loading="lazy"
                    width={450}
                    height={294}
                    src="/assets/images/category/cate-15.jpg"
                    alt="Image"
                  />
                </Link>
                <div className="box-image_content">
                  <Link
                    href={`/shop-default`}
                    className="title h6 fw-medium link"
                  >
                    Limited Time Offer
                    <i className="icon icon-ArrowUpRight" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Collection;
