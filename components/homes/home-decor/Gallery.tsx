import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { galleryDecorItems } from "@/data/gallery";

function Gallery() {
  return (
    <div className="mb-10 px-10">
      <TfSwiper
        preview={5}
        tablet={4}
        mobileSm={3}
        mobile={2}
        space={12}
        pagination={2}
        paginationSm={3}
        paginationMd={4}
        paginationLg={6}
        paginationClassName="sw-line-default style-2 tf-sw-pagination xxl-mt-10"
      >
        {galleryDecorItems.map((item) => (
          <div key={item.img} className="gallery-item hover-img hover-overlay wow fadeInUp">
            <div className="image img-style">
              <Image
                src={`${item.img}`}
                alt={item.alt ?? "Image"}
                width={274}
                height={274}
                loading="lazy"
              />
            </div>
            <Link href="/product-detail" className="box-icon hover-tooltip">
              <span className="icon icon-Eye" aria-hidden />
              <span className="tooltip">View product</span>
            </Link>
          </div>
        ))}
      </TfSwiper>
    </div>
  );
}

export default Gallery;
