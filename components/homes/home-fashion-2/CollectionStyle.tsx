import Link from "next/link";
import Image from "next/image";
function CollectionStyle() {
  return (
    <>
      <section className="flat-spacing flat-animate-tab-2">
        <div className="container">
          <div className="banner-collect-v01 style-2 st-2_2 tf-grid-layout lg-col-2">
            <div className="col-left">
              <div className="heading wow fadeInUp">
                <h3 className="mb-8">Curated Collections For Style</h3>
                <p className="text-body-1 cl-text-2">
                  Thoughtfully designed fashion pieces defining modern elegance.
                </p>
              </div>
              <ul
                className="list-btn-tab-accordion style-2 wow fadeInUp"
                role="tablist"
                id="bnClsV02"
              >
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
                    <span className="h5 fw-medium">Fresh Seasonal Designs</span>
                    <span className="icon icon-ArrowRight" />
                  </div>
                  <div
                    id="accordionCls1"
                    className="collapse show"
                    data-bs-parent="#bnClsV02"
                  >
                    <p className="accordion-content cl-text-2">
                      A carefully curated selection of timeless essentials
                      designed for effortless daily styling, a refined look that
                      seamlessly adapts to your everyday lifestyle.
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
                    <span className="h5 fw-medium">
                      Sparkling Diamond Favorites
                    </span>
                    <span className="icon icon-ArrowRight" />
                  </div>
                  <div
                    id="accordionCls2"
                    className="collapse"
                    data-bs-parent="#bnClsV02"
                  >
                    <p className="accordion-content cl-text-2">
                      Dazzling diamond pieces that capture light beautifully,
                      adding timeless elegance to any outfit, perfect for
                      special occasions or everyday sophisticated style.
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
                    <span className="h5 fw-medium">
                      Bold Designs That Elevate Looks
                    </span>
                    <span className="icon icon-ArrowRight" />
                  </div>
                  <div
                    id="accordionCls3"
                    className="collapse"
                    data-bs-parent="#bnClsV02"
                  >
                    <p className="accordion-content cl-text-2">
                      Dazzling diamond pieces that capture light beautifully,
                      adding timeless elegance to any outfit, perfect for
                      special occasions or everyday sophisticated style.
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
                    <span className="h5 fw-medium">
                      Responsibly Made Conscious Fashion
                    </span>
                    <span className="icon icon-ArrowRight" />
                  </div>
                  <div
                    id="accordionCls4"
                    className="collapse"
                    data-bs-parent="#bnClsV02"
                  >
                    <p className="accordion-content cl-text-2">
                      Dazzling diamond pieces that capture light beautifully,
                      adding timeless elegance to any outfit, perfect for
                      special occasions or everyday sophisticated style.
                    </p>
                  </div>
                </li>
              </ul>
              <div className="wow fadeInUp">
                <Link href={`/shop-default`} className="tf-btn animate-btn">
                  Shop Collectionns
                </Link>
              </div>
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
                      width={705}
                      height={705}
                      src="/assets/images/collection/fashion-2/cls-1.jpg"
                      alt="Image"
                    />
                  </div>
                </div>
                <div className="tab-pane" id="tabCls2" role="tabpanel">
                  <div className="collect-image">
                    <Image
                      loading="lazy"
                      width={705}
                      height={705}
                      src="/assets/images/collection/fashion-2/cls-2.jpg"
                      alt="Image"
                    />
                  </div>
                </div>
                <div className="tab-pane" id="tabCls3" role="tabpanel">
                  <div className="collect-image">
                    <Image
                      loading="lazy"
                      width={705}
                      height={705}
                      src="/assets/images/collection/fashion-2/cls-3.jpg"
                      alt="Image"
                    />
                  </div>
                </div>
                <div className="tab-pane" id="tabCls4" role="tabpanel">
                  <div className="collect-image">
                    <Image
                      loading="lazy"
                      width={705}
                      height={705}
                      src="/assets/images/collection/fashion-2/cls-4.jpg"
                      alt="Image"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default CollectionStyle;
