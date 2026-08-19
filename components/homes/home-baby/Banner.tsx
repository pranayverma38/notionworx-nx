import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { bannerBabySlides } from "@/data/bannerBaby";

function BannerSlideContent({
  slide,
  contentClassName,
}: {
  slide: (typeof bannerBabySlides)[number];
  contentClassName?: string;
}) {
  return (
    <div className="banner-image-text style-5 hover-img">
      <Link href="/shop-default" className="bn-image img-style">
        <Image
          src={`${slide.img}`}
          alt={slide.alt ?? "Image"}
          width={380}
          height={380}
          loading="lazy"
        />
      </Link>
      <div className={`bn-content ${contentClassName ?? ""}`.trim()}>
        <Link
          href="/shop-default"
          className="title h4 fw-medium link"
        >
          {slide.title}
        </Link>
        <p className="desc cl-text-2 text-body-1">{slide.desc}</p>
        <Link
          href="/shop-default"
          className={`btn-action tf-btn animate-btn ${slide.btnClassName ?? ""}`.trim()}
        >
          {slide.btnText}
        </Link>
      </div>
    </div>
  );
}

function Banner() {
  return (
    <div className="themesFlat">
      <div className="container">
        <TfSwiper
          preview={2}
          tablet={2}
          mobileSm={2}
          mobile={1}
          spaceLg={30}
          spaceMd={20}
          space={10}
          pagination={1}
          paginationSm={2}
          paginationMd={2}
          paginationLg={2}
        >
          {bannerBabySlides.map((slide) => (
            <BannerSlideContent key={slide.img} slide={slide} contentClassName="flex-1" />
          ))}
        </TfSwiper>
        <div className="tf-grid-layout md-col-2 d-none">
          {bannerBabySlides.map((slide) => (
            <BannerSlideContent key={slide.img} slide={slide} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Banner;
