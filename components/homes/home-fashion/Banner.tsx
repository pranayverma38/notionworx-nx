import Link from "next/link";
import Image from "next/image";
import React from "react";

function Banner() {
  return (
    <>
      <div className="banner-v01">
        <div className="bn_image">
          <Image
            loading="lazy"
            width={1920}
            height={620}
            src="/assets/images/section/banner-40.jpg"
            alt="Image"
          />
        </div>
        <div className="bn_content">
          <div className="container">
            <div className="h1 title text-white mb-12">
              Elevate Your <br />
              Workout Style
            </div>
            <p className="desc text-white mb-32">
              Premium activewear crafted for comfort, <br />
              performance, and confidence.
            </p>
            <Link href={`/shop-default`} className="tf-btn btn-white">
              Shop Styles
            </Link>
          </div>
        </div>
        <div className="infiniteSlide-text wow fadeInUp">
          <div className="infiniteslide_wrap">
            <div className="infiniteSlide infinite-slider infiniteSlide-wrapper">
              {Array.from({ length: 4 }).map((_, index) => (
                <React.Fragment key={index}>
                  <p className="text h1 fw-semibold">NEW SEASON PICKS</p>
                  <p className="text h1 fw-semibold">TRENDING STYLES</p>
                  <p className="text h1 fw-semibold">LIMITED DROPS</p>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Banner;
