import Link from "next/link";
import Image from "next/image";
function BannerCollection() {
  return (
    <>
      <section className="section-banner-cls">
        <div className="container-full">
          <div className="main-section">
            <div className="col-left">
              <div className="banner-image-text type-abs style-14 h-100">
                <Link
                  href={`/shop-default`}
                  className="bn-image img-style radius-20"
                >
                  <Image
                    loading="lazy"
                    width={1170}
                    height={794}
                    src="/assets/images/section/banner-15.jpg"
                    alt="Image"
                  />
                </Link>
                <div className="bn-content">
                  <Link
                    href={`/shop-default`}
                    className="title text-display fw-medium text-white link-underline-white text-decoration-thickness_3"
                  >
                    Everything <br />
                    Your Pet <br />
                    Deserves
                  </Link>
                  <h6 className="desc text-body-1 text-white letter-space--1">
                    Experience true wireless sound with deep bass,{" "}
                    <br className="d-none d-sm-block" />
                    crystal clarity.
                  </h6>
                  <Link
                    href={`/shop-default`}
                    className="btn-action tf-btn btn-white"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-right tf-grid-layout md-col-2 lg-col-1 gap-20">
              <div className="box-image_v04 type-2">
                <Link
                  href={`/shop-default`}
                  className="box-image_img img-style"
                >
                  <Image
                    loading="lazy"
                    width={580}
                    height={387}
                    src="/assets/images/collection/cls-18.jpg"
                    alt="Image"
                  />
                </Link>
                <div className="box-image_content wow fadeInUp">
                  <Link
                    href={`/shop-default`}
                    className="title h3 fw-medium link-underline-text text-decoration-thickness_3"
                  >
                    Cat Feast
                  </Link>
                  <p className="desc cl-text-2">
                    Healthy, tasty meals for cats
                  </p>
                  <Link
                    href={`/shop-default`}
                    className="btn-action tf-btn-line-2 style-primary"
                  >
                    <span className="fw-semibold">Shop Now</span>
                  </Link>
                </div>
              </div>
              <div className="box-image_v04 type-2">
                <Link
                  href={`/shop-default`}
                  className="box-image_img img-style"
                >
                  <Image
                    loading="lazy"
                    width={580}
                    height={387}
                    src="/assets/images/collection/cls-17.jpg"
                    alt="Image"
                  />
                </Link>
                <div className="box-image_content wow fadeInUp">
                  <Link
                    href={`/shop-default`}
                    className="title h3 fw-medium link-underline-text text-decoration-thickness_3"
                  >
                    Pet Fashion
                  </Link>
                  <p className="desc cl-text-2">Cute outfits for every pet</p>
                  <Link
                    href={`/shop-default`}
                    className="btn-action tf-btn-line-2 style-primary"
                  >
                    <span className="fw-semibold">Shop Now</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default BannerCollection;
