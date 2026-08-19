import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { collectionSportSlides } from "@/data/collectionSport";

function Collection() {
  return (
    <div className="px-20">
      <TfSwiper
        preview={3}
        tablet={3}
        mobileSm={2}
        mobile={1}
        spaceLg={20}
        spaceMd={15}
        space={10}
        pagination={1}
        paginationSm={2}
        paginationMd={3}
        paginationLg={3}
        paginationClassName="sw-line-default tf-sw-pagination"
      >
        {collectionSportSlides.map((item) => (
          <div key={item.img} className="item2 box-cls-v1 style-3 hover-img">
            <Link href="/shop-default" className="cls-image img-style">
              <Image
                src={`${item.img}`}
                alt={item.alt ?? "Image"}
                width={620}
                height={455}
                loading="lazy"
              />
            </Link>
            <div className="cls-content wow fadeInRight">
              <Link
                href="/shop-default"
                className="cls_title h4 text-white link-underline-white mb-8"
              >
                {item.title.split("\n").map((line, i) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    {line}
                  </span>
                ))}
              </Link>
              <p className="cls_desc text-white mb-24">{item.desc}</p>
              <Link href="/shop-default" className="tf-btn small-2 btn-white">
                Shop Now
              </Link>
            </div>
          </div>
        ))}
      </TfSwiper>
    </div>
  );
}

export default Collection;
