import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { galleryCosmeticItems } from "@/data/gallery";

function Gallery() {
  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="sect-heading text-center wow fadeInUp">
          <h3 className="s-title">Shop Our Insta Glow</h3>
          <p className="s-desc">
            Find clean beauty favorites loved by our online community.
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
          {galleryCosmeticItems.map((item) => (
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
    </section>
  );
}

export default Gallery;
