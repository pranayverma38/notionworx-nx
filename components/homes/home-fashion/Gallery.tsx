import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { galleryFashionItems } from "@/data/gallery";

function Gallery() {
  return (
    <div className="themesFlat flat-spacing">
      <div className="container">
        <div className="sect-heading text-center wow fadeInUp">
          <div className="h3 s-title font-kumbh letter-space-0 mb-9">
            Follow Us On Instagram
          </div>
          <p className="s-desc font-kumbh">@Amerce</p>
        </div>
      </div>
      <div className="px-20">
        <TfSwiper
          preview={5}
          tablet={4}
          mobileSm={3}
          mobile={2}
          space={20}
          pagination={2}
          paginationSm={3}
          paginationMd={4}
          paginationLg={6}
          paginationClassName="sw-line-default style-2 tf-sw-pagination"
        >
          {galleryFashionItems.map((item) => (
            <div
              key={item.img}
              className="gallery-item radius-12 hover-img hover-overlay wow fadeInUp"
            >
              <div className="image img-style">
                <Image
                  src={`${item.img}`}
                  alt={item.alt ?? "Image"}
                  width={274}
                  height={274}
                  loading="lazy"
                />
              </div>
              <Link href="/product-detail/1" className="box-icon hover-tooltip">
                <span className="icon icon-Eye" aria-hidden />
                <span className="tooltip">View product</span>
              </Link>
            </div>
          ))}
        </TfSwiper>
      </div>
    </div>
  );
}

export default Gallery;
