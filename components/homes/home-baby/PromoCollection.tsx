import Image from "next/image";
import Link from "next/link";
import { categoriesCollection } from "@/data/categories";

const canopyCollectionNames = [
  "5x5 Custom Canopies",
  "10x10 Custom Canopies",
  "10x15 Custom Canopies",
  "10x20 Custom Canopies",
] as const;
const CANOPY_CARD_HEIGHT = 280;

function getCollection(name: (typeof canopyCollectionNames)[number]) {
  return categoriesCollection.find((category) => category.name === name);
}

export default function PromoCollection() {
  const fiveByFive = getCollection("5x5 Custom Canopies");
  const tenByTen = getCollection("10x10 Custom Canopies");
  const tenByFifteen = getCollection("10x15 Custom Canopies");
  const tenByTwenty = getCollection("10x20 Custom Canopies");

  if (!fiveByFive || !tenByTen || !tenByFifteen || !tenByTwenty) {
    return null;
  }

  return (
    <div className="flat-spacing">
      <div className="container">
        <div className="tf-grid-layout md-col-2 xl-col-3 xl-gap-20">
          <div className="banner-image-text type-abs style-4">
            <Link href="/collection" className="bn-image img-style">
              <Image
                loading="lazy"
                width={450}
                height={608}
                src="/assets/images/notionworx/hero/trade-show-banner.jpg"
                alt="Trade show banner"
                style={{ objectFit: "cover", objectPosition: "center center" }}
              />
            </Link>
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg, rgba(0, 0, 0, 0.62) 0%, rgba(0, 0, 0, 0.35) 45%, rgba(0, 0, 0, 0.12) 100%)",
                zIndex: 1,
              }}
            />
            <div
              className="bn-content wow fadeInUp"
              style={{
                top: "50%",
                bottom: "auto",
                left: "40px",
                right: "auto",
                transform: "translateY(-50%)",
                textAlign: "left",
                maxWidth: "280px",
                zIndex: 2,
              }}
            >
              <Link
                href="/collection"
                className="title h3 fw-medium text-white link"
              >
                The Ultimate Marketing Tool!
              </Link>
              <Link
                href="/collection"
                className="btn-action tf-btn btn-white small"
              >
                Explore Canopies
              </Link>
            </div>
          </div>
          <div className="tf-grid-layout gap-20">
            {[fiveByFive, tenByFifteen].map((collection) => (
              <div
                key={collection.name}
                className="box-image_v03 hover-img4"
              >
                <Link href={collection.href ?? "/collection"} className="box-image_img img-style4">
                  <Image
                    loading="lazy"
                    width={450}
                    height={CANOPY_CARD_HEIGHT}
                    src={collection.img}
                    alt={collection.name}
                    style={{
                      width: "100%",
                      height: `${CANOPY_CARD_HEIGHT}px`,
                      objectFit: "cover",
                    }}
                  />
                </Link>
                <div className="box-image_content">
                  <Link
                    href={collection.href ?? "/collection"}
                    className="title h6 fw-medium link"
                  >
                    {collection.name}
                    <i className="icon icon-ArrowUpRight" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="tf-grid-layout gap-20 md-col-2 xl-col-1 xl-wd-full">
            {[tenByTen, tenByTwenty].map((collection) => (
              <div
                key={collection.name}
                className="box-image_v03 hover-img4"
              >
                <Link href={collection.href ?? "/collection"} className="box-image_img img-style4">
                  <Image
                    loading="lazy"
                    width={450}
                    height={CANOPY_CARD_HEIGHT}
                    src={collection.img}
                    alt={collection.name}
                    style={{
                      width: "100%",
                      height: `${CANOPY_CARD_HEIGHT}px`,
                      objectFit: "cover",
                    }}
                  />
                </Link>
                <div className="box-image_content">
                  <Link
                    href={collection.href ?? "/collection"}
                    className="title h6 fw-medium link"
                  >
                    {collection.name}
                    <i className="icon icon-ArrowUpRight" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
