import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { gallerySneakerItems } from "@/data/gallery";

function Gallery() {
  return (
    <section className="px-20 mb-20">
      <div className="sect-heading text-center wow fadeInUp">
        <h3 className="s-title mb-16">Follow Us On Instagram</h3>
        <p className="s-desc cl-text-2 font-kumbh">@Amerce</p>
      </div>
      <TfSwiper
        preview={5}
        tablet={3}
        mobileSm={3}
        mobile={2}
        spaceLg={20}
        spaceMd={15}
        space={10}
        pagination={2}
        paginationSm={3}
        paginationMd={4}
        paginationLg={5}
        paginationClassName="sw-dot-default tf-sw-pagination"
      >
        {gallerySneakerItems.map((item) => (
          <div
            key={item.img}
            className="gallery-item radius-16 hover-img hover-overlay wow fadeInUp"
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
    </section>
  );
}

export default Gallery;
