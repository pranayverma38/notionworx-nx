import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { galleryOfficeEquipmentItems } from "@/data/gallery";

function Gallery() {
  return (
    <section className="px-20 mb-20">
      <div className="sect-heading type-2 text-center wow fadeInUp">
        <h3 className="s-title">Shop Instagram</h3>
        <p className="s-desc text-body-1 cl-text-2">
          Connect with us on all platforms to get new information about
          products
        </p>
      </div>
      <TfSwiper
        laptop={7}
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
        {galleryOfficeEquipmentItems.map((item) => (
          <div
            key={item.img}
            className="gallery-item hover-img hover-overlay wow fadeInUp"
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
