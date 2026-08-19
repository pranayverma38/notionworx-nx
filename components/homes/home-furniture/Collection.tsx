import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { collectionFurnitureSlides } from "@/data/collectionFurniture";

function Collection() {
  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="sect-heading type-2 text-center wow fadeInUp">
          <h3 className="s-title">Featured Collection</h3>
          <p className="s-desc text-body-1 cl-text-2">
            Design-forward furniture selected to shape spaces with warmth and
            intention.
          </p>
        </div>
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
          {collectionFurnitureSlides.map((slide, index) => (
            <div
              key={slide.img}
              className="box-image_v06 style-2 hover-img wow fadeInLeft"
              data-wow-delay={index > 0 ? `${index * 0.1}s` : undefined}
            >
              <Link href="/shop-default" className="box-image_img img-style">
                <Image
                  src={`${slide.img}`}
                  alt={slide.alt ?? "Image"}
                  width={450}
                  height={550}
                  loading="lazy"
                />
              </Link>
              <div className="box-image_content align-items-center">
                <Link href="/shop-default" className="tf-btn btn-white">
                  Shop Collection
                </Link>
              </div>
            </div>
          ))}
        </TfSwiper>
      </div>
    </section>
  );
}

export default Collection;
