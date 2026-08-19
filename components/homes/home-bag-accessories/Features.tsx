import TfSwiper from "@/components/ui/TfSwiper";
import { features } from "@/data/features";

function Features() {
  return (
    <div className="themesFlat">
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
          paginationClassName="sw-dot-default tf-sw-pagination"
        >
          {features.map((item, index) => (
            <div
              key={item.title}
              className="box-icon_V01 wow fadeInLeft"
              data-wow-delay={index > 0 ? `${index * 0.1}s` : undefined}
            >
              <span className="icon">
                <i className={item.icon} aria-hidden />
              </span>
              <div className="content">
                <p className="title h6">{item.title}</p>
                <p className="text cl-text-2">{item.text}</p>
              </div>
            </div>
          ))}
        </TfSwiper>
      </div>
    </div>
  );
}

export default Features;
