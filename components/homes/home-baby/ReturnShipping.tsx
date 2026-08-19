import Image from "next/image";
import React from "react";

function ReturnShipping() {
  return (
    <>
      <div className="flat-spacing">
        <div className="container">
          <div className="infiniteSlide-policy wow fadeInUp">
            <div className="infiniteslide_wrap">
              <div className="infiniteSlide infinite-slider infiniteSlide-wrapper">
                {Array.from({ length: 4 }).map((_, index) => (
                  <React.Fragment key={index}>
                    <div className="h5 policy-text">
                      Free shipping on all orders over $20.00
                    </div>
                    <div className="policy-image">
                      <Image
                        loading="lazy"
                        width={90}
                        height={48}
                        src="/assets/images/section/policy-1.jpg"
                        alt="Image"
                      />
                    </div>
                    <div className="h5 policy-text">
                      Returns are free within 14 days
                    </div>
                    <div className="policy-image">
                      <Image
                        loading="lazy"
                        width={90}
                        height={48}
                        src="/assets/images/section/policy-2.jpg"
                        alt="Image"
                      />
                    </div>
                    <div className="h5 policy-text">
                      Free shipping on all orders over $20.00
                    </div>
                    <div className="policy-image">
                      <Image
                        loading="lazy"
                        width={90}
                        height={48}
                        src="/assets/images/section/policy-3.jpg"
                        alt="Image"
                      />
                    </div>
                    <div className="h5 policy-text">
                      Returns are free within 14 days
                    </div>
                    <div className="policy-image">
                      <Image
                        loading="lazy"
                        width={90}
                        height={48}
                        src="/assets/images/section/policy-4.jpg"
                        alt="Image"
                      />
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReturnShipping;
