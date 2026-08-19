import TfSwiper from "@/components/ui/TfSwiper";
import { features } from "@/data/features";

function Features() {
  return (
    <div className="flat-spacing">
      <div className="container">
        <div className="position-relative flat-spacing pb-0">
          <div className="br-line fake-class top-0" />
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
            {features.map((item) => (
              <div key={item.title} className="box-icon_V01 style-2 wow fadeInLeft">
                <span className="icon">
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
    </div>
  );
}

export default Features;
