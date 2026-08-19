"use client";

import TfSwiper from "@/components/ui/TfSwiper";
import { topBarSlides } from "@/data/topBar";

export default function TopBar1() {
  return (
    <div className="tf-topbar bg-dark tf-btn-swiper-main">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-sm-1 ms-auto d-none d-sm-block">
            <div className="nav-prev-swiper d-flex text-white link justify-content-end">
              <i className="icon icon-CaretLeft fs-20" aria-hidden />
            </div>
          </div>
          <div className="col-sm-10 col-md-8 col-lg-6">
            <div className="text-center">
              <TfSwiper
                auto
                loop
                speed={1500}
                delay={1500}
                useExternalNav
                paginationClassName="d-none"
              >
                {topBarSlides.map((slide, index) => (
                  <div key={index} className="d-flex align-items-center justify-content-center gap-8">
                    {slide.icon != null ? (
                      <>
                        <i
                          className={`icon ${slide.icon} text-primary fs-20`}
                          aria-hidden
                        />
                        <p className="text-white text-start text-line-clamp-1">
                          {slide.text}
                        </p>
                      </>
                    ) : (
                      <p className="text-white text-line-clamp-1">{slide.text}</p>
                    )}
                  </div>
                ))}
              </TfSwiper>
            </div>
          </div>
          <div className="col-sm-1 me-auto d-none d-sm-block">
            <div className="nav-next-swiper d-flex text-white link">
              <i className="icon icon-CaretRightThin fs-20" aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
