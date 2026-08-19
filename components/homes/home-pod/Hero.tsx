import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { heroPodSlides } from "@/data/heros";

function Hero() {
  return (
    <div className="themesFlat">
      <TfSwiper
        preview={2}
        tablet={2}
        mobileSm={1}
        mobile={1}
        space={0}
        pagination={1}
        paginationSm={1}
        paginationMd={2}
        paginationLg={2}
        className="slider_effect_fade-md"
        paginationClassName="sw-line-default style-2 tf-sw-pagination d-md-none mt-10"
      >
        {heroPodSlides.map((slide) => (
          <div key={slide.img} className="banner-image-text type-abs style-3 hover-img overflow-hidden">
            <Link href="/shop-default" className="bn-image img-style">
              <Image
                src={`${slide.img}`}
                alt={slide.alt ?? "Image"}
                width={960}
                height={760}
                loading="lazy"
              />
            </Link>
            <div className="bn-content">
              <div className="d-grid">
                <div className="fade-item fade-item-1">
                  <Link
                    href="/shop-default"
                    className="title h2 fw-medium text-white link"
                  >
                    {slide.title}
                  </Link>
                </div>
                {slide.subtitle != null && (
                  <p className="desc text-white text-body-1 fade-item fade-item-2">
                    {slide.subtitle.split("\n").map((part, i) => (
                      <span key={i}>
                        {i > 0 && <br className="d-none d-sm-block" />}
                        {part}
                      </span>
                    ))}
                  </p>
                )}
              </div>
              <div className="fade-item fade-item-3">
                <Link
                  href="/shop-default"
                  className="btn-action tf-btn btn-white"
                >
                  {slide.ctaText}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </TfSwiper>
    </div>
  );
}

export default Hero;
