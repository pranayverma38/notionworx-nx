import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { heroMentalSlides } from "@/data/heros";

function Hero() {
  return (
    <section className="tf-slideshow tf-btn-swiper-main hover-sw-nav">
      <TfSwiper
        loop
        effect="fade"
        auto
        delay={3000}
        className="sw-slide-show slider_effect_fade"
        externalNavSelectors={{
          nextEl: ".tf-btn-swiper-main .nav-next-swiper",
          prevEl: ".tf-btn-swiper-main .nav-prev-swiper",
        }}
        paginationClassName="sw-line-default tf-sw-pagination"
      >
        {heroMentalSlides.map((slide) => {
          const titleParts = slide.title.split("\n");
          const TitleTag = slide.titleTag === "p" ? "p" : "h1";
          return (
            <div key={slide.img} className="slideshow-wrap">
              <div className="sld_image">
                <Image
                  src={`${slide.img}`}
                  alt={slide.alt ?? "Image"}
                  width={1920}
                  height={600}
                  loading="lazy"
                />
              </div>
              <div className="sld_content">
                <div className="container">
                  <div className="content-sld_wrap">
                    <div className="heading">
                      {slide.subtitle != null && slide.subtitle !== "" && (
                        <p className="sub-text_sld text-body-1 text-white fade-item fade-item-1 mb-15">
                          {slide.subtitle}
                        </p>
                      )}
                      <TitleTag
                        className={
                          slide.titleTag === "p"
                            ? "title_sld h1 fw-medium text-white fade-item fade-item-2 mb-15"
                            : "title_sld text-white fade-item fade-item-1 mb-15"
                        }
                      >
                        {titleParts[0]}
                        {titleParts[1] != null && (
                          <>
                            <br className="d-none d-sm-block" />
                            {titleParts[1]}
                          </>
                        )}
                      </TitleTag>
                      {slide.desc != null && (
                        <p className="sub-text_sld text-body-1 text-white fade-item fade-item-2">
                          {slide.desc.split("\n").map((part, i) => (
                            <span key={i}>
                              {i > 0 && <br className="d-none d-md-block" />}
                              {part}
                            </span>
                          ))}
                        </p>
                      )}
                    </div>
                    <div className="fade-item fade-item-3">
                      <Link href="/shop-default" className="tf-btn btn-white">
                        {slide.ctaText}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </TfSwiper>
      <div className="group-nav-action">
        <div className="container-full">
          <div className="d-flex align-items-center justify-content-between">
            <div className="tf-sw-nav text-white link nav-prev-swiper">
              <i className="icon icon-ArrowLongLeft" aria-hidden />
            </div>
            <div className="tf-sw-nav text-white link nav-next-swiper">
              <i className="icon icon-ArrowLongRight" aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
