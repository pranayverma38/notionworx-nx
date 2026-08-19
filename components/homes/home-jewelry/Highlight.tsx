import Image from "next/image";

import { jewelryHighlights } from "@/data/jewelry_highlights";
import TfSwiper from "@/components/ui/TfSwiper";

function Highlight() {
  return (
    <div className="container-full">
      <div className="section-highlight">
        <Image
          className="img-cover"
          width={1770}
          height={720}
          loading="lazy"
          decoding="async"
          src="/assets/images/section/banner-47.jpg"
          alt="banner"
        />
        <TfSwiper
          className="wrap-content"
          preview={4}
          tablet={3}
          mobileSm={2}
          mobile={1}
          spaceLg={0}
          spaceMd={0}
          space={0}
          paginationLg={1}
          paginationMd={1}
          paginationSm={1}
          pagination={1}
          paginationClassName="sw-line-default tf-sw-pagination d-flex d-lg-none mb-24"
        >
          {jewelryHighlights.map((item, index) => (
            <div
              key={index}
              className="item wow fadeInUp"
              data-wow-delay={item.delay}
            >
              <h4 className="text-white mb-8 title">{item.title}</h4>
              <p className="text-body-1 text-white ">{item.desc}</p>
            </div>
          ))}
        </TfSwiper>
      </div>
    </div>
  );
}

export default Highlight;
