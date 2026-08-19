import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { galleryItems } from "@/data/gallery";

function Gallery() {
  return (
    <section className="themesFlat">
      <div className="container">
        <div className="sect-heading type-2 text-center wow fadeInUp">
          <h3 className="s-title">Shop Instagram</h3>
          <p className="s-desc text-body-1 cl-text-2">
            Elevate your wardrobe with fresh finds today!
          </p>
        </div>
        <TfSwiper
          preview={5}
          tablet={3}
          mobileSm={3}
          mobile={2}
          space={10}
          pagination={2}
          paginationSm={3}
          paginationMd={4}
          paginationLg={5}
          paginationClassName="sw-dot-default tf-sw-pagination"
        >
          {galleryItems.map((item) => (
            <div key={item.img} className="wow fadeInUp">
              <div className="gallery-item hover-img hover-overlay">
                <div className="image img-style">
                  { }
                  <Image
                    loading="lazy"
                    width={274}
                    height={274}
                    src={`${item.img}`}
                    alt={item.alt ?? "Image"}
                  />
                </div>
                <Link href="/product-detail/1" className="box-icon hover-tooltip">
                  <span className="icon icon-Eye" />
                  <span className="tooltip">View product</span>
                </Link>
              </div>
            </div>
          ))}
        </TfSwiper>
      </div>
    </section>
  );
}

export default Gallery;
