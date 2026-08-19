import TfSwiper from "@/components/ui/TfSwiper";
import { features } from "@/data/features";

function Features() {
  return (
    <div className="flat-spacing">
      <div className="container">
        <TfSwiper
          preview={4}
          tablet={3}
          mobileSm={2}
          mobile={1}
          spaceLg={30}
          spaceMd={20}
          space={10}
          pagination={1}
          paginationSm={2}
          paginationMd={3}
          paginationLg={4}
        >
          {features.map((item) => (
            <div key={item.title} className="swiper-slide">
              <div className="box-icon_V01 wow fadeInLeft">
                <span className="icon">
                  <i className={item.icon} />
                </span>
                <div className="content">
                  <p className="title h6">{item.title}</p>
                  <p className="text cl-text-2">{item.text}</p>
                </div>
              </div>
            </div>
          ))}
        </TfSwiper>
      </div>
    </div>
  );
}

export default Features;
