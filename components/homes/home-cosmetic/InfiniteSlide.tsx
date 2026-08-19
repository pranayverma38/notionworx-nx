import React from "react";

function InfiniteSlide() {
  return (
    <>
      <div className="infiniteSlide-policy style-2 wow fadeInUp ">
        <div className="infiniteslide_wrap">
          <div className="infiniteSlide infinite-slider infiniteSlide-wrapper">
            {Array.from({ length: 4 }).map((_, index) => (
              <React.Fragment key={index}>
                <i className="icon icon-Lightning-1" />
                <p className="policy-text text-caption-02 lh-20 fw-semibold text-uppercase">
                  Enjoy free shipping on orders above $20
                </p>
                <i className="icon icon-Lightning-1" />
                <p className="policy-text text-caption-02 lh-20 fw-semibold text-uppercase">
                  Free returns within 14 days
                </p>
                <i className="icon icon-Lightning-1" />
                <p className="policy-text text-caption-02 lh-20 fw-semibold text-uppercase">
                  Enjoy free shipping on orders above $20
                </p>
                <i className="icon icon-Lightning-1" />
                <p className="policy-text text-caption-02 lh-20 fw-semibold text-uppercase">
                  Free returns within 14 days
                </p>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default InfiniteSlide;
