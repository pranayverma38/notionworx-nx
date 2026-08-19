import Image from "next/image";

import { aboutStats } from "@/data/about_stats";
import TfSwiper from "@/components/ui/TfSwiper";

export default function MainAbout() {
  return (
    <section className="section-main-about flat-spacing pt-0">
      <div className="container">
        <div className="flat-spacing-2">
          <div className="hero-image">
            <Image
              loading="lazy"
              width={1410}
              height={600}
              src="/assets/images/notionworx-inventory/trade-show-display/10-fabric-pop-up-display-straight-copy/01.jpg"
              alt="Notion Worx branded display"
            />
          </div>
        </div>
        <div className="row align-items-center gy-4">
          <div className="col-md-6">
            <h2 className="text-capitalize">
              Built for events, trade shows, team gear, and branded activations
            </h2>
          </div>
          <div className="col-md-6">
            <p className="text-body-1">
              This storefront now runs from a unified local inventory feed so the
              shopping experience stays consistent from homepage discovery to
              collection browsing and product detail review. The result is a more
              maintainable catalog with mirrored assets and cleaner merchandising.
            </p>
          </div>
        </div>
        <div className="flat-spacing pb-0">
          <div className="position-relative flat-spacing pb-0">
            <div className="br-line fake-class top-0" />
            <TfSwiper
              preview={4}
              tablet={3}
              mobileSm={2}
              mobile={1}
              spaceLg={40}
              spaceMd={20}
              space={10}
              paginationLg={4}
              paginationMd={3}
              paginationSm={2}
              pagination={1}
              paginationClassName="sw-dot-default tf-sw-pagination"
            >
              {aboutStats.map((item) => (
                <div key={item.title} className="box-why couter-side">
                  <p className="h1 fw-medium">
                    {item.prefix}
                    {item.number}
                    {item.suffix}
                  </p>
                  <p className="title h5 fw-medium">{item.title}</p>
                  <p className="sub cl-text-2">{item.sub}</p>
                </div>
              ))}
            </TfSwiper>
          </div>
        </div>
      </div>
    </section>
  );
}
