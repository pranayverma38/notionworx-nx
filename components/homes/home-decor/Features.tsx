import TfSwiper from "@/components/ui/TfSwiper";
import { featuresDecor } from "@/data/featuresDecor";

function Features() {
  return (
    <div className="flat-spacing pt-0">
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
          paginationClassName="sw-line-default style-2 tf-sw-pagination"
        >
          {featuresDecor.map((item) => (
            <div key={item.title} className="box-icon_V01 wow fadeInLeft">
              <span className="icon">
                <i className={item.icon} aria-hidden />
              </span>
              <div className="content">
                <h6 className="title">{item.title}</h6>
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
