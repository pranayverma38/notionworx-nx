import Link from "next/link";
import Image from "next/image";
function BannerDiscover() {
  return (
    <>
      <section className="themesFlat">
        <div className="container-full">
          <div
            className="banner-v03 parallaxie"
            style={{
              backgroundImage:
                'url("/assets/images/section/furniture-banner-1.jpg")',
            }}
          >
            <div className="bn_image">
              <Image
                className="opacity-0"
                loading="lazy"
                width={1770}
                height={440}
                src="/assets/images/section/furniture-banner-1.jpg"
                alt="Image"
              />
            </div>
            <div className="bn_content">
              <div className="container">
                <div className="wrap wow fadeInUp">
                  <h6 className="desc text-white">
                    DESIGNED FOR MODERN LIVING
                  </h6>
                  <h2 className="title text-white">
                    Furniture Crafted For <br className="d-none d-md-block" />
                    Everyday Comfort &amp; Style
                  </h2>
                  <Link href={`/shop-default`} className="tf-btn btn-white">
                    Discover Our Designs
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

export default BannerDiscover;
