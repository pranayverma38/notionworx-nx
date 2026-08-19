import Link from "next/link";

import CurrencySelect from "../common/CurrencySelect";
import LanguageSelect from "../common/LanguageSelect";
import TfSwiper from "../ui/TfSwiper";
import { topBarSlides } from "@/data/topBar";

export default function TopBar2({
  isContainerFull,
  isDark,
  hasSwiper
}: {
  isContainerFull?: boolean;
  isDark?: boolean;
  hasSwiper?: boolean;
}) {
  const containerClass = isContainerFull ? "container-full" : "container";
  const className = isDark
    ? "tf-topbar topbar-s2 d-none d-md-flex bg-dark"
    : "tf-topbar topbar-s2 d-none d-md-flex";
  return (
    <div className={className}>
      <div className={containerClass}>
        <div className="row">
          <div className={`col-6 ${hasSwiper ? 'col-xxl-3' : ''}`}>
            <div className="tf-list">
              <a
                href="tel:0112348888"
                className={`link ${isDark ? "text-white" : ""}`}
              >
                (+01) 1234 8888
              </a>
              <Link
                href={`/our-store`}
                className={`text-decoration-underline link ${isDark ? "text-white" : ""}`}
              >
                Our Store
              </Link>
              <Link
                href={`/contact`}
                className={`link ${isDark ? "text-white" : ""}`}
              >
                Contact
              </Link>
            </div>
          </div>
          {hasSwiper ? 
<div className="col-6 d-none d-xxl-block">
  <div className="text-center">
      <TfSwiper
                direction="vertical"
                auto
                loop
                speed={1000}
                className="tf-swiper swiper-topbar"
                paginationClassName="d-none"
              >
                {topBarSlides.map((slide, index) => (
                  <div key={index} className="h-auto">
                    <p className="text-white text-line-clamp-1">{slide.text}</p>
                  </div>
                ))}
              </TfSwiper>
  </div>
</div>:''}
          <div className={`col-6 ${hasSwiper ? 'col-xxl-3' : ''}`}>
            <div className="d-flex justify-content-end">
              <div className="tf-list list-currenci">
                <div className="tf-currencies">
                  <CurrencySelect textBlack={!isDark} />
                </div>
                <div className="tf-languages">
                  <LanguageSelect textBlack={!isDark} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
