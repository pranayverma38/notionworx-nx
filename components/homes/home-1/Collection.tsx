import Link from "next/link";
import Image from "next/image";
function Collection() {
  return (
    <>
      <div className="section-banner-collection">
        <div className="container">
          <div className="tf-grid-layout sm-col-2 gap-10">
            <div className="box-image_v01">
              <Link href={`/shop-default`} className="box-image_img img-style">
                <Image
                  loading="lazy"
                  width={700}
                  height={933}
                  src="/assets/images/collection/cls-6.jpg"
                  alt="Image"
                />
              </Link>
              <div className="box-image_content">
                <Link
                  href={`/shop-default`}
                  className="title h3 fw-medium text-white link-underline-white text-decoration-thickness"
                >
                  Shop Women
                </Link>
              </div>
            </div>
            <div className="d-flex flex-column gap-10">
              <div className="box-image_v01 h-100">
                <Link
                  href={`/shop-default`}
                  className="box-image_img img-style"
                >
                  <Image
                    loading="lazy"
                    width={700}
                    height={461}
                    src="/assets/images/collection/cls-7.jpg"
                    alt="Image"
                  />
                </Link>
                <div className="box-image_content">
                  <Link
                    href={`/shop-default`}
                    className="title h3 fw-medium text-white link-underline-white text-decoration-thickness"
                  >
                    Shop Men
                  </Link>
                </div>
              </div>
              <div className="box-image_v01 h-100">
                <Link
                  href={`/shop-default`}
                  className="box-image_img img-style"
                >
                  <Image
                    loading="lazy"
                    width={700}
                    height={461}
                    src="/assets/images/collection/cls-8.jpg"
                    alt="Image"
                  />
                </Link>
                <div className="box-image_content">
                  <Link
                    href={`/shop-default`}
                    className="title h3 fw-medium text-white link-underline-white text-decoration-thickness"
                  >
                    Shop Essentials
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
