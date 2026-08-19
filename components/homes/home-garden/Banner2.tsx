import Link from "next/link";
import Image from "next/image";

export default function Banner2() {
  return (
    <section className="flat-spacing">
      <div
        className="banner-v02 parallaxie "
        style={{
          backgroundImage: 'url("/assets/images/section/banner-53.jpg")',
        }}
      >
        <div className="bn_image">
          <Image
            className="opacity-0"
            loading="lazy"
            width={1920}
            height={620}
            src="/assets/images/section/banner-53.jpg"
            alt="Image"
          />
        </div>
        <div className="bn_content">
          <div className="wrap">
            <h3 className="title">
              Nurture A Home Filled With <br className="d-none d-md-block" />
              Calm Green Beauty
            </h3>
            <p className="desc text-body-1">
              Experience thoughtfully crafted pieces that refresh your space{" "}
              <br className="d-none d-md-block" />
              and elevate your everyday living.
            </p>
            <Link href={`/shop-default`} className="tf-btn animate-btn">
              View All Products
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
