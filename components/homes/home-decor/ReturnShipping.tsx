import Image from "next/image";
import React from "react";

function ReturnShipping() {
  return (
    <>
      <div className="infiniteSlide-policy-v2 wow fadeInUp">
        <div className="infiniteslide_wrap">
          <div className="infiniteSlide infinite-slider infiniteSlide-wrapper">
            {Array.from({ length: 6 }).map((_, index) => (
              <React.Fragment key={index}>
                <p className="policy-text h1 fw-medium">Elegant Comfort</p>
                <div className="policy-image">
                  <Image
                    loading="lazy"
                    width={160}
                    height={80}
                    src="/assets/images/section/policy-5.jpg"
                    alt="Image"
                  />
                </div>
                <p className="policy-text h1 fw-medium">Timeless Comfort</p>
                <div className="policy-image">
                  <Image
                    loading="lazy"
                    width={160}
                    height={80}
                    src="/assets/images/section/policy-6.jpg"
                    alt="Image"
                  />
                </div>
                <p className="policy-text h1 fw-medium">Pure Comfort</p>
                <div className="policy-image">
                  <Image
                    loading="lazy"
                    width={160}
                    height={80}
                    src="/assets/images/section/policy-7.jpg"
                    alt="Image"
                  />
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default ReturnShipping;
