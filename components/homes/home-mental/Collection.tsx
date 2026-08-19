import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { collectionMentalSlides } from "@/data/collectionMental";

function Collection() {
  return (
    <div className="themesFlat">
      <div className="container">
        <TfSwiper
          preview={3}
          tablet={2}
          mobileSm={2}
          mobile={1}
          spaceLg={30}
          spaceMd={20}
          space={10}
          pagination={1}
          paginationSm={2}
          paginationMd={2}
          paginationLg={3}
          paginationClassName="sw-dot-default tf-sw-pagination"
        >
          {collectionMentalSlides.map((slide, index) => (
            <div
              key={slide.img}
              className="box-image_v02 hover-img wow fadeInLeft"
              data-wow-delay={index > 0 ? `${index * 0.1}s` : undefined}
            >
              <Link href="/shop-default" className="box-image_img img-style">
                <Image
                  src={`${slide.img}`}
                  alt={slide.alt ?? "Image"}
                  width={450}
                  height={280}
                  loading="lazy"
                />
              </Link>
              <div className="box-image_content">
                <Link
                  href="/shop-default"
                  className={`title h4 fw-medium ${slide.contentWhite === true ? "text-white link-underline-white" : "link-underline-text"}`}
                >
                  {slide.title.split("\n").map((part, i) => (
                    <span key={i}>
                      {i > 0 && <br />}
                      {part}
                    </span>
                  ))}
                </Link>
                <p className={slide.contentWhite === true ? "desc text-white" : "desc cl-text-2"}>
                  {slide.desc.split("\n").map((part, i) => (
                    <span key={i}>
                      {i > 0 && <br />}
                      {part}
                    </span>
                  ))}
                </p>
                <Link
                  href="/shop-default"
                  className={`btn-action tf-btn-icon link ${slide.contentWhite === true ? "text-white" : ""}`}
                >
                  <span className="text-caption-01 fw-semibold">View More</span>
                  <i className="icon icon-ArrowRight fs-20" aria-hidden />
                </Link>
              </div>
            </div>
          ))}
        </TfSwiper>
      </div>
    </div>
  );
}

export default Collection;
