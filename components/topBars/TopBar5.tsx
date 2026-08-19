"use client";

import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { topBarSlides } from "@/data/topBar";
import CurrencySelect from "../common/CurrencySelect";
import LanguageSelect from "../common/LanguageSelect";

export default function TopBar5() {
  return (
    <div className="tf-topbar bg-secondary tf-btn-swiper-main">
      <div className="container-full">
        <div className="row align-items-center">
          <div className="col-6 col-lg-3 d-none d-xxl-block">
            <div className="tf-list">
              <a href="tel:0112348888" className="text-white link">
                (+01) 1234 8888
              </a>
              <Link
                href="/our-store"
                className="text-decoration-underline text-white link"
              >
                Our Store
              </Link>
              <Link href="/contact" className="text-white link">
                Contact
              </Link>
            </div>
          </div>
          <div className="col-sm-1 d-none d-lg-block ms-auto">
            <div className="nav-prev-swiper d-flex text-white link justify-content-end">
              <i className="icon icon-CaretLeft" aria-hidden />
            </div>
          </div>
          <div className="col-lg-6 col-xxl-4">
            <div className="text-center">
              <TfSwiper
                direction="vertical"
                auto
                loop
                speed={1500}
                delay={1500}
                useExternalNav
                className="tf-swiper swiper-topbar"
                paginationClassName="d-none"
              >
                {topBarSlides.map((slide, index) => (
                  <p key={index} className="text-white text-line-clamp-1">
                    {slide.text}
                  </p>
                ))}
              </TfSwiper>
            </div>
          </div>
          <div className="col-sm-1 d-none d-lg-block me-auto">
            <div className="nav-next-swiper d-flex text-white link">
              <i className="icon icon-CaretRightThin" aria-hidden />
            </div>
          </div>
          <div className="col-6 col-lg-3 d-none d-xxl-block">
            <div className="d-flex justify-content-end">
              <div className="tf-list list-currenci">
                <div className="tf-currencies">
                 
                  <CurrencySelect  />
                </div>
                <div className="tf-languages">
                 
                  <LanguageSelect />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
