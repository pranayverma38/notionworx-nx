import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { galleryOrganicItems } from "@/data/gallery";

function Gallery() {
  return (
    <section className="themesFlat">
      <div className="container">
        <div className="sect-heading text-center wow fadeInUp">
          <h3 className="s-title font-kumbh letter-space-0">
            Follow Us On Instagram
          </h3>
          <p className="s-desc font-kumbh">@Amerce</p>
        </div>
      </div>
      <div className="px-20">
        <TfSwiper
          preview={5}
          tablet={4}
          mobileSm={3}
          mobile={2}
          spaceLg={20}
          spaceMd={10}
          space={10}
          pagination={2}
          paginationSm={3}
          paginationMd={4}
          paginationLg={6}
          paginationClassName="sw-line-default style-2 tf-sw-pagination"
        >
          {galleryOrganicItems.map((item) => (
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
    </section>
  );
}

export default Gallery;
