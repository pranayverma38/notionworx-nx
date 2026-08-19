"use client";

import TfSwiper from "@/components/ui/TfSwiper";
import { topBarSlides } from "@/data/topBar";
import CurrencySelect from "../common/CurrencySelect";
import LanguageSelect from "../common/LanguageSelect";
import Link from "next/link";

export default function TopBar6() {
  return (
    <div className="tf-topbar d-none d-md-flex bg-dark">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-6 col-xxl-3">
            <div className="tf-list">
                <a href="tel:0112348888" className="text-white link">(+01) 1234 8888</a>
                <Link href={`/our-store`} className="text-decoration-underline text-white link">Our Store</Link>
                <Link href={`/contact`} className="text-white link">Contact</Link>
              </div>
          </div>
        
          <div className="col-6 d-none d-xxl-block">
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
         
          <div className="col-6 col-xxl-3 d-flex justify-content-end align-items-center">
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
        </div>
      </div>
    </div>
  );
}
