import Image from "next/image";
function BannerCollection() {
  return (
    <>
      <div className="container-full flat-animate-tab-2">
        <div className="banner-collect-v01 tf-grid-layout lg-col-2">
          <div className="col-left">
            <div className="heading">
              <h3 className="mb-8">Exclusive Jewellery Collections</h3>
              <p className="cl-text-2">
                Discover exquisite pieces designed to elevate your style,
                perfect for every occasion.
              </p>
            </div>
            <ul className="list-btn-tab-accordion" role="tablist" id="bnClsV01">
              <li
                className="nav-tab-item active"
                role="presentation"
                data-bs-toggle="tab"
                data-bs-target="#tabCls1"
              >
                <div
                  className="accordion-title"
                  data-bs-target="#accordionCls1"
                  role="button"
                  data-bs-toggle="collapse"
                  aria-expanded="true"
                  aria-controls="accordionCls1"
                >
                  <span className="h4 fw-medium">Elegant Gold Essentials</span>
                  <span className="icon icon-ArrowRight" />
                </div>
                <div
                  id="accordionCls1"
                  className="collapse show"
                  data-bs-parent="#bnClsV01"
                >
                  <p className="accordion-content cl-text-2">
                    Dazzling diamond pieces that capture light beautifully,
                    adding timeless elegance to any outfit, perfect for special
                    occasions or everyday sophisticated style.
                  </p>
                </div>
              </li>
              <li className="br-line" />
              <li
                className="nav-tab-item"
                role="presentation"
                data-bs-toggle="tab"
                data-bs-target="#tabCls2"
              >
                <div
                  className="accordion-title collapsed"
                  data-bs-target="#accordionCls2"
                  role="button"
                  data-bs-toggle="collapse"
                  aria-expanded="true"
                  aria-controls="accordionCls2"
                >
                  <span className="h4 fw-medium">
                    Sparkling Diamond Favorites
                  </span>
                  <span className="icon icon-ArrowRight" />
                </div>
                <div
                  id="accordionCls2"
                  className="collapse"
                  data-bs-parent="#bnClsV01"
                >
                  <p className="accordion-content cl-text-2">
                    Dazzling diamond pieces that capture light beautifully,
                    adding timeless elegance to any outfit, perfect for special
                    occasions or everyday sophisticated style.
                  </p>
                </div>
              </li>
              <li className="br-line" />
              <li
                className="nav-tab-item"
                role="presentation"
                data-bs-toggle="tab"
                data-bs-target="#tabCls3"
              >
                <div
                  className="accordion-title collapsed"
                  data-bs-target="#accordionCls3"
                  role="button"
                  data-bs-toggle="collapse"
                  aria-expanded="true"
                  aria-controls="accordionCls3"
                >
                  <span className="h4 fw-medium">Chic Silver Designs</span>
                  <span className="icon icon-ArrowRight" />
                </div>
                <div
                  id="accordionCls3"
                  className="collapse"
                  data-bs-parent="#bnClsV01"
                >
                  <p className="accordion-content cl-text-2">
                    Dazzling diamond pieces that capture light beautifully,
                    adding timeless elegance to any outfit, perfect for special
                    occasions or everyday sophisticated style.
                  </p>
                </div>
              </li>
              <li className="br-line" />
              <li
                className="nav-tab-item"
                role="presentation"
                data-bs-toggle="tab"
                data-bs-target="#tabCls4"
              >
                <div
                  className="accordion-title collapsed"
                  data-bs-target="#accordionCls4"
                  role="button"
                  data-bs-toggle="collapse"
                  aria-expanded="true"
                  aria-controls="accordionCls4"
                >
                  <span className="h4 fw-medium">
                    Gemstone Statement Pieces
                  </span>
                  <span className="icon icon-ArrowRight" />
                </div>
                <div
                  id="accordionCls4"
                  className="collapse"
                  data-bs-parent="#bnClsV01"
                >
                  <p className="accordion-content cl-text-2">
                    Dazzling diamond pieces that capture light beautifully,
                    adding timeless elegance to any outfit, perfect for special
                    occasions or everyday sophisticated style.
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div className="col-right">
            <div className="tab-content">
              <div
                className="tab-pane active show"
                id="tabCls1"
                role="tabpanel"
              >
                <div className="collect-image">
                  <Image
                    loading="lazy"
                    width={760}
                    height={700}
                    src="/assets/images/section/accordion-cls.jpg"
                    alt="Image"
                  />
                </div>
              </div>
              <div className="tab-pane" id="tabCls2" role="tabpanel">
                <div className="collect-image">
                  <Image
                    loading="lazy"
                    width={760}
                    height={700}
                    src="/assets/images/section/accordion-cls.jpg"
                    alt="Image"
                  />
                </div>
              </div>
              <div className="tab-pane" id="tabCls3" role="tabpanel">
                <div className="collect-image">
                  <Image
                    loading="lazy"
                    width={760}
                    height={700}
                    src="/assets/images/section/accordion-cls.jpg"
                    alt="Image"
                  />
                </div>
              </div>
              <div className="tab-pane" id="tabCls4" role="tabpanel">
                <div className="collect-image">
                  <Image
                    loading="lazy"
                    width={760}
                    height={700}
                    src="/assets/images/section/accordion-cls.jpg"
                    alt="Image"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BannerCollection;
