import Link from "next/link";
import Image from "next/image";
function GridCollection() {
  return (
    <>
      <div className="flat-spacing-3 pb-0">
        <div className="container">
          <div className="tf-grid-layout md-col-2 gap-xl-30">
            <div className="box-image_v07 hover-img">
              <Link href={`/shop-default`} className="box-image_img img-style">
                <Image
                  loading="lazy"
                  width={690}
                  height={922}
                  src="/assets/images/collection/bag/cls-1.jpg"
                  alt="Image"
                />
              </Link>
              <div className="box-image_content wow fadeInUp">
                <Link
                  href={`/shop-default`}
                  className="bn_title h2 text-white link mb-8"
                >
                  Jacquard Bucket <br />
                  Bag With Logo
                </Link>
                <p className="bn_desc text-white mb-20">
                  Up to 50% Off Bestsellers
                </p>
                <Link
                  href={`/shop-default`}
                  className="tf-btn-line-2 style-white py-4"
                >
                  <span className="fw-semibold text-caption-01">Shop Now</span>
                </Link>
              </div>
            </div>
            <div className="tf-grid-layout gap-xl-30">
              <div className="box-cls-v1 style-2 hover-img">
                <Link href={`/shop-default`} className="cls-image img-style">
                  <Image
                    loading="lazy"
                    width={690}
                    height={446}
                    src="/assets/images/collection/bag/cls-2.jpg"
                    alt="Image"
                  />
                </Link>
                <div className="cls-content wow fadeInUp">
                  <Link
                    href={`/shop-default`}
                    className="cls_title h2 link mb-8"
                  >
                    Leather Belt <br />
                    With Oval Buckle
                  </Link>
                  <p className="cls_desc mb-20">Up to 50% Off Bestsellers</p>
                  <Link
                    href={`/shop-default`}
                    className="tf-btn-line-2 style-primary py-4"
                  >
                    <span className="fw-semibold text-caption-01">
                      Shop Now
                    </span>
                  </Link>
                </div>
              </div>
              <div className="box-cls-v1 hover-img">
                <Link href={`/shop-default`} className="cls-image img-style">
                  <Image
                    loading="lazy"
                    width={690}
                    height={446}
                    src="/assets/images/collection/bag/cls-3.jpg"
                    alt="Image"
                  />
                </Link>
                <div className="cls-content wow fadeInUp">
                  <Link
                    href={`/shop-default`}
                    className="cls_title h2 link mb-8"
                  >
                    latest Jewelry <br />
                    Collection
                  </Link>
                  <p className="cls_desc mb-20">Up to 50% Off Bestsellers</p>
                  <Link
                    href={`/shop-default`}
                    className="tf-btn-line-2 style-primary py-4"
                  >
                    <span className="fw-semibold text-caption-01">
                      Shop Now
                    </span>
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

export default GridCollection;
