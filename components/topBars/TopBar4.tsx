

import TfSwiper from "@/components/ui/TfSwiper";
import { topBarSlides } from "@/data/topBar";

export default function TopBar4() {
  return (
    <div className="tf-topbar bg-dark">
      <div className="container">
        <div
          className="text-center"
        >
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
      </div>
    </div>
  );
}
