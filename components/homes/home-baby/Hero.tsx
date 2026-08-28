import Link from "next/link";
import Image from "next/image";

import TfSwiper from "@/components/ui/TfSwiper";
import { heroSlidesBaby } from "@/data/heros";

function Hero() {
  return (
    <section className="tf-slideshow notionworx-hero-section pt-30 p-xl-0">
      <div className="container">
        <TfSwiper
          loop
          effect="fade"
          auto
          delay={4000}
          speed={800}
          className="sw-slide-show notionworx-hero-swiper slider_effect_fade"
          paginationClassName="sw-line-default pst-2 tf-sw-pagination"
        >
          {heroSlidesBaby.map((slide, index) => {
            const TitleTag = index === 0 ? "h1" : "p";

            return (
              <div key={slide.img} className="notionworx-hero-slide">
                <div className="notionworx-hero-media">
                  <Image
                    src={slide.img}
                    alt={slide.alt ?? slide.title}
                    fill
                    priority={index === 0}
                    sizes="(min-width: 1200px) 1320px, 100vw"
                    className="notionworx-hero-image"
                  />
                  <div className="notionworx-hero-overlay" />
                </div>

                <div className="notionworx-hero-content">
                  <div className="notionworx-hero-copy">
                    <TitleTag className="notionworx-hero-title text-white">
                      {slide.title}
                    </TitleTag>
                    {slide.subtitle ? (
                      <p className="notionworx-hero-subtitle text-white">
                        {slide.subtitle}
                      </p>
                    ) : null}

                    <div className="notionworx-hero-actions">
                      <Link
                        href={slide.href ?? "/collection"}
                        className="tf-btn btn-white style-2 small notionworx-hero-button"
                      >
                        {slide.ctaText}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </TfSwiper>
      </div>
    </section>
  );
}

export default Hero;
