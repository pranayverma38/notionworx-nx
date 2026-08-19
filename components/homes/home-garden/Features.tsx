import TfSwiper from "@/components/ui/TfSwiper";
import { featuresGarden } from "@/data/features";

function Features() {
  return (
    <div className="flat-spacing pt-0">
      <div className="container">
        <TfSwiper
          preview={4}
          tablet={3}
          mobileSm={2}
          mobile={1}
          spaceLg={60.67}
          spaceMd={33}
          space={13}
          pagination={1}
          paginationSm={2}
          paginationMd={3}
          paginationLg={4}
          paginationClassName="sw-dot-default tf-sw-pagination"
        >
          {featuresGarden.map((item) => (
            <div key={item.title} className="box-icon_V01 has-line wow fadeInLeft">
              <span className="icon mb-16">
                <i className={item.icon} aria-hidden />
              </span>
              <div className="content">
                <h5 className="title">{item.title}</h5>
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
