import React from "react";

function Slide() {
  return (
    <>
      <div className="container-full  flat-spacing ">
        <div className="infiniteSlide-text-v02 wow fadeInUp">
          <div className="infiniteslide_wrap">
            <div className="infiniteSlide infinite-slider infiniteSlide-wrapper">
              {Array.from({ length: 4 }).map((_, index) => (
                <React.Fragment key={index}>
                  <p className="text h5 fw-medium">
                    Black Friday Sale: Up to 50% Off. Code: FUEL2025
                  </p>
                  <i className="icon-Star2" />
                  <p className="text h5 fw-medium">
                    Black Friday Sale: Up to 50% Off. Code: FUEL2025
                  </p>
                  <i className="icon-Star2" />
                  <p className="text h5 fw-medium">
                    Black Friday Sale: Up to 50% Off. Code: FUEL2025
                  </p>
                  <i className="icon-Star2" />
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Slide;
