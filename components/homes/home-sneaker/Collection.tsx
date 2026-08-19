import Link from "next/link";
import Image from "next/image";
function Collection() {
  return (
    <>
      <div className="container-full">
        <div className="tf-grid-layout md-col-2 gap-10">
          <div className="banner-image-text style-bottom bt-center">
            <Link
              href={`/shop-default`}
              className="bn-image img-style radius-20"
            >
              <Image
                loading="lazy"
                width={880}
                height={800}
                src="/assets/images/section/banner-66.jpg"
                alt="Image"
              />
            </Link>
            <div className="bn-content wow fadeInUp">
              <Link
                href={`/shop-default`}
                className="title h2 link-underline-text mb-12"
              >
                SALE OFF UP TO 50%
              </Link>
              <p className="desc text-body-1 mb-24">
                Grab top sport shoes at unbeatable deals — limited time.
              </p>
              <Link
                href={`/shop-default`}
                className="btn-action tf-btn btn-white"
              >
                Order Now
              </Link>
            </div>
          </div>
          <div className="banner-image-text style-bottom bt-center">
            <Link
              href={`/shop-default`}
              className="bn-image img-style radius-20"
            >
              <Image
                loading="lazy"
                width={880}
                height={800}
                src="/assets/images/section/banner-67.jpg"
                alt="Image"
              />
            </Link>
            <div className="bn-content wow fadeInUp">
              <Link
                href={`/shop-default`}
                className="title h2 text-white link-underline-white mb-12"
              >
                BIG SEASON SALE
              </Link>
              <p className="desc text-body-1 text-white mb-24">
                Exclusive deals on top-style sneakers. Save more while stocks
                last.
              </p>
              <Link
                href={`/shop-default`}
                className="btn-action tf-btn btn-white"
              >
                Order Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Collection;
