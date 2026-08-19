import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { collectionBagAccessoriesSlides } from "@/data/collectionBagAccessories";

function Collection() {
  return (
    <section className="themesFlat">
      <div className="container-full">
        <TfSwiper
          preview={2}
          tablet={2}
          mobileSm={1}
          mobile={1}
          spaceLg={30}
          spaceMd={20}
          space={15}
          pagination={1}
          paginationSm={1}
          paginationMd={2}
          paginationLg={2}
          paginationClassName="sw-dot-default tf-sw-pagination"
        >
          {collectionBagAccessoriesSlides.map((slide) => {
            const titleParts = slide.title.split("\n");
            return (
              <div key={slide.img} className="banner-image-text style-top-left tl-3">
                <Link
                  href="/shop-default"
                  className="bn-image img-style radius-20"
                >
                  <Image
                    src={`${slide.img}`}
                    alt={slide.alt ?? "Image"}
                    width={870}
                    height={680}
                    loading="lazy"
                  />
                </Link>
                <div className="bn-content wow fadeInUp">
                  <h2 className="title mb-8">
                    <Link
                      href="/shop-default"
                      className="link"
                    >
                      {titleParts[0]}
                      {titleParts.slice(1).map((part, i) => (
                        <span key={i}>
                          <br className="d-none d-sm-block" />
                          {part}
                        </span>
                      ))}
                    </Link>
                  </h2>
                  <p className="desc text-body-1 text-cl-2 mb-24">{slide.desc}</p>
                  <Link
                    href="/shop-default"
                    className="btn-action tf-btn animate-btn"
                  >
                    {slide.btnText}
                  </Link>
                </div>
              </div>
            );
          })}
        </TfSwiper>
      </div>
    </section>
  );
}

export default Collection;
