import Image from "next/image";
import React from "react";

function Brand() {
  return (
    <>
      <div className="infiniteSlide-brand syle-3 wow fadeInUp">
        <div className="infiniteslide_wrap">
          <div className="infiniteSlide infinite-slider infiniteSlide-wrapper">
            {Array.from({ length: 4 }).map((_, index) => (
              <React.Fragment key={index}>
                <div className="img-brand">
                  <Image
                    width={159}
                    height={44}
                    src="/assets/images/brand/shangxi.svg"
                    alt="Image"
                  />
                </div>
                <div className="img-brand">
                  <Image
                    width={109}
                    height={44}
                    src="/assets/images/brand/cheryl.svg"
                    alt="Image"
                  />
                </div>
                <div className="img-brand">
                  <Image
                    width={139}
                    height={32}
                    src="/assets/images/brand/vanfaba.svg"
                    alt="Image"
                  />
                </div>
                <div className="img-brand">
                  <Image
                    width={128}
                    height={36}
                    src="/assets/images/brand/carolin.svg"
                    alt="Image"
                  />
                </div>
                <div className="img-brand">
                  <Image
                    width={156}
                    height={33}
                    src="/assets/images/brand/panadoxn.svg"
                    alt="Image"
                  />
                </div>
                <div className="img-brand">
                  <Image
                    width={126}
                    height={40}
                    src="/assets/images/brand/textitles.svg"
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

export default Brand;
