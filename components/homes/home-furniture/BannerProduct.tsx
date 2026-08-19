import Link from "next/link";
import Image from "next/image";
function BannerProduct() {
  return (
    <>
      <div className="flat-animate-tab-2">
        <div className="container-full">
          <div className="banner-collect-v02">
            <div className="col-left wow fadeInUp">
              <ul
                className="tab-btn-wrap-v3 style-2 lg-overflow-auto"
                role="tablist"
              >
                <li className="nav-tab-item" role="presentation">
                  <a
                    href="#moderm"
                    data-bs-toggle="tab"
                    className="tf-btn-tab active"
                    role="tab"
                  >
                    <span className="h3">Modern Comfort Living</span>
                  </a>
                </li>
                <li className="nav-tab-item" role="presentation">
                  <a
                    href="#natural"
                    data-bs-toggle="tab"
                    className="tf-btn-tab"
                    role="tab"
                  >
                    <span className="h3">Natural Wood Home</span>
                  </a>
                </li>
                <li className="nav-tab-item" role="presentation">
                  <a
                    href="#minimal"
                    data-bs-toggle="tab"
                    className="tf-btn-tab"
                    role="tab"
                  >
                    <span className="h3">Minimal Forms Everyday</span>
                  </a>
                </li>
                <li className="nav-tab-item" role="presentation">
                  <a
                    href="#timeless"
                    data-bs-toggle="tab"
                    className="tf-btn-tab"
                    role="tab"
                  >
                    <span className="h3">Timeless Design Space</span>
                  </a>
                </li>
              </ul>
              <div className="bottom">
                <ul className="list-thumb-image">
                  <li className="thumb-item">
                    <Image
                      className="bg-white"
                      loading="lazy"
                      width={100}
                      height={100}
                      src="/assets/images/product/furniture/no-bg/product-1.png"
                      alt="Image"
                    />
                  </li>
                  <li className="thumb-item">
                    <Image
                      className="bg-white"
                      loading="lazy"
                      width={100}
                      height={100}
                      src="/assets/images/product/furniture/no-bg/product-5.png"
                      alt="Image"
                    />
                  </li>
                  <li className="thumb-item">
                    <Image
                      className="bg-white"
                      loading="lazy"
                      width={100}
                      height={100}
                      src="/assets/images/product/furniture/no-bg/product-7.png"
                      alt="Image"
                    />
                  </li>
                </ul>
                <p className="desc text-body-1 cl-text-2">
                  A nature-inspired collection featuring rich wood textures,
                  soft finishes, and timeless forms for comfortable, balanced
                  living.
                </p>
                <Link href={`/shop-default`} className="tf-btn animate-btn">
                  Shop Collection
                </Link>
              </div>
            </div>
            <div className="col-right">
              <div className="tab-content">
                <div
                  className="tab-pane active show"
                  id="moderm"
                  role="tabpanel"
                >
                  <div className="collect-image">
                    <Image
                      loading="lazy"
                      width={805}
                      height={604}
                      src="/assets/images/section/furniture-banner-2.jpg"
                      alt="Image"
                    />
                  </div>
                </div>
                <div className="tab-pane" id="natural" role="tabpanel">
                  <div className="collect-image">
                    <Image
                      loading="lazy"
                      width={805}
                      height={604}
                      src="/assets/images/section/furniture-banner-2.jpg"
                      alt="Image"
                    />
                  </div>
                </div>
                <div className="tab-pane" id="minimal" role="tabpanel">
                  <div className="collect-image">
                    <Image
                      loading="lazy"
                      width={805}
                      height={604}
                      src="/assets/images/section/furniture-banner-2.jpg"
                      alt="Image"
                    />
                  </div>
                </div>
                <div className="tab-pane" id="timeless" role="tabpanel">
                  <div className="collect-image">
                    <Image
                      loading="lazy"
                      width={805}
                      height={604}
                      src="/assets/images/section/furniture-banner-2.jpg"
                      alt="Image"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BannerProduct;
