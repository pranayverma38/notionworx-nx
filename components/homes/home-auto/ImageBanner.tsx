import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { imageBannerSlides } from "@/data/imageBanner";

function ImageBanner() {
  return (
    <div className="themesFlat">
      <div className="container">
        <TfSwiper
          preview={3}
          tablet={3}
          mobileSm={2}
          mobile={1}
          spaceLg={30}
          spaceMd={15}
          space={10}
          pagination={1}
          paginationSm={2}
          paginationMd={3}
          paginationLg={3}
        >
          {imageBannerSlides.map((slide) => {
            const titleParts = slide.title.split("\n");
            return (
              <div
                key={slide.img}
                className="banner-image-text type-abs style-7 hover-img"
              >
                <Link href="/shop-default" className="bn-image img-style">
                  <Image
                    src={`${slide.img}`}
                    alt={slide.alt ?? "Image"}
                    width={450}
                    height={520}
                    loading="lazy"
                  />
                </Link>
                <div className="bn-content wow fadeInUp">
                  <Link
                    href="/shop-default"
                    className="title h3 fw-medium text-white link"
                  >
                    {titleParts[0]}
                    {titleParts.slice(1).map((part, i) => (
                      <span key={i}>
                        <br />
                        {part}
                      </span>
                    ))}
                  </Link>
                  <p className="desc cl-text-line text-body-1">{slide.desc}</p>
                  <Link
                    href="/shop-default"
                    className={`btn-action tf-btn btn-white small ${slide.btnClassName ?? ""}`.trim()}
                  >
                    {slide.btnText}
                  </Link>
                </div>
              </div>
            );
          })}
        </TfSwiper>
      </div>
    </div>
  );
}

export default ImageBanner;
