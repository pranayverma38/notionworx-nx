"use client";

import TfSwiper from "@/components/ui/TfSwiper";
import { topBarSlides } from "@/data/topBar";
import CurrencySelect from "../common/CurrencySelect";
import LanguageSelect from "../common/LanguageSelect";

export default function TopBar3() {
  return (
    <div className="tf-topbar topbar-s3 bg-dark tf-btn-swiper-main">
      <div className="container-full">
        <div className="row align-items-center">
          <div className="col-lg-3 d-none d-lg-block">
            <div className="tf-list list-currenci">
              <div className="tf-currencies d-none d-xl-block">
                <CurrencySelect />
              </div>
              <div className="tf-currencies d-xl-none">
                <CurrencySelect />
              </div>
              <div className="tf-languages">
                <LanguageSelect />
              </div>
            </div>
          </div>
          <div className="col-sm-1 d-none d-xl-block">
            <div className="nav-prev-swiper d-flex text-white link">
              <i className="icon icon-CaretLeft" aria-hidden />
            </div>
          </div>
          <div className="col-lg-6 col-xl-4">
            <div className="text-center">
              <TfSwiper
                auto
                loop
                speed={1500}
                delay={1500}
                useExternalNav
                paginationClassName="d-none"
                externalNavSelectors={{
                  prevEl: "#topbar-swiper .nav-prev-swiper",
                  nextEl: "#topbar-swiper .nav-next-swiper",
                }}
              >
                {topBarSlides.map((slide, index) => (
                  <p key={index} className="text-white text-line-clamp-1">
                    {slide.text}
                  </p>
                ))}
              </TfSwiper>
            </div>
          </div>
          <div className="col-sm-1 d-none d-xl-block">
            <div className="nav-next-swiper d-flex text-white link justify-content-end">
              <i className="icon icon-CaretRightThin" aria-hidden />
            </div>
          </div>
          <div className="col-lg-3 d-none d-lg-block">
            <div className="d-flex align-items-center justify-content-end gap-20">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="d-flex"
              >
                <i
                  className="fs-20 text-white link icon icon-FacebookLogo"
                  aria-hidden
                />
              </a>
              <a
                href="https://x.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="d-flex"
              >
                <i
                  className="fs-20 text-white link icon icon-XLogo"
                  aria-hidden
                />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="d-flex"
              >
                <i
                  className="fs-20 text-white link icon icon-InstagramLogo"
                  aria-hidden
                />
              </a>
              <a
                href="https://www.tiktok.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="d-flex"
              >
                <i
                  className="fs-20 text-white link icon icon-TiktokLogo"
                  aria-hidden
                />
              </a>
              <a
                href="https://www.snapchat.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="d-flex"
              >
                <i
                  className="fs-20 text-white link icon icon-SnapchatLogo"
                  aria-hidden
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
