import Image from "next/image";

import { aboutStats } from "@/data/about_stats";
import TfSwiper from "@/components/ui/TfSwiper";

function MainAbout() {
  return (
    <section className="section-main-about flat-spacing pt-0">
      <div className="container">
        <div className="flat-spacing-2">
          <div className="hero-image">
            <Image
              loading="lazy"
              width={1410}
              height={600}
              src="/assets/images/section/s-contact-1.jpg"
              alt="Image"
            />
          </div>
        </div>
        <div className="row align-items-center gy-4">
          <div className="col-md-6">
            <h2 className="text-capitalize">
              Design, attention to detail &amp; efficiency to delight the world
            </h2>
          </div>
          <div className="col-md-6">
            <p className="text-body-1">
              From the moment it is conceived to the moment it is worn, every
              one of our garments follows this path. We could do it at a fast
              pace. However, at Mango, we choose to take care of all those who
              are walking this path with us.
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
              {aboutStats.map((item, index) => (
                <div key={index} className="box-why couter-side">
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

export default MainAbout;
