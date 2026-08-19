import Link from "next/link";
import Image from "next/image";
function Banner() {
  return (
    <>
      <div className="flat-spacing pb-0">
        <div className="container">
          <div
            className="banner-v04 parallaxie"
            style={{
              backgroundImage: 'url("/assets/images/section/banner-65.jpg")',
            }}
          >
            <div className="bn_image">
              <Image
                className="opacity-0 aspect-ratio-0"
                loading="lazy"
                width={1410}
                height={460}
                src="/assets/images/section/banner-65.jpg"
                alt="Image"
              />
            </div>
            <div className="bn_content">
              <div className="wrap wow fadeInUp">
                <h1 className="title mb-12">
                  <Link href={`/shop-default`} className="text-white link">
                    The Perfectly <br className="d-none d-md-block" />
                    Balanced Work Kit
                  </Link>
                </h1>
                <p className="desc text-body-1 text-white mb-32">
                  Boost efficiency, reduce strain, and work smarter
                </p>
                <Link href={`/shop-default`} className="tf-btn btn-white">
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

export default Banner;
