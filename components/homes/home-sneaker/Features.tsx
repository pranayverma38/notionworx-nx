import Image from "next/image";
function Features() {
  return (
    <>
      <section className="section-feature-v2 flat-spacing">
        <div className="container-full">
          <div className="sect-heading text-center wow fadeInUp">
            <h3 className="s-title mb-8">Performance in Every Step</h3>
            <p className="s-desc text-body-1 cl-text-2">
              Designed for stability, comfort, and all day movement giving you
              balanced support and smooth <br className="d-none d-lg-block" />
              performance from your first step to your last.
            </p>
          </div>
          <div className="banner-feature style-2">
            <div className="feature-image">
              <div className="image">
                <Image
                  loading="lazy"
                  width={687}
                  height={863}
                  src="/assets/images/item/feature-shoe.png"
                  alt="Image"
                />
              </div>
            </div>
            <div className="feature-detail_list tf-grid-layout sm-col-2 gap-20">
              <div className="feature-detail pst-s1 justify-content-md-end">
                <div className="feature_illus order-md-2">
                  <i className="icon icon-Wind wow fadeZoom" />
                </div>
                <div className="feature_info order-md-1 text-md-end wow fadeInRight">
                  <p className="info__name h6">Breathable Comfort</p>
                  <p className="info__desc cl-text-2">
                    Soft, breathable fabrics deliver lasting comfort you can
                    feel.
                  </p>
                </div>
              </div>
              <div className="feature-detail pst-s2 justify-content-md-end">
                <div className="feature_illus order-md-2">
                  <i className="icon icon-Sparkle wow fadeZoom" />
                </div>
                <div className="feature_info order-md-1 text-md-end wow fadeInRight">
                  <p className="info__name h6">Superior Traction</p>
                  <p className="info__desc cl-text-2">
                    Advanced outsole design delivers reliable grip on multiple
                    surfaces.
                  </p>
                </div>
              </div>
              <div className="feature-detail pst-s3">
                <div className="feature_illus">
                  <i className="icon icon-Exclude wow fadeZoom" />
                </div>
                <div className="feature_info wow fadeInRight">
                  <p className="info__name h6">Flexible Support</p>
                  <p className="info__desc cl-text-2">
                    Adaptive support provides stability while allowing natural
                    movement.
                  </p>
                </div>
              </div>
              <div className="feature-detail pst-s4">
                <div className="feature_illus">
                  <i className="icon icon-Feather wow fadeZoom" />
                </div>
                <div className="feature_info wow fadeInRight">
                  <p className="info__name h6">Enhanced Cushioning</p>
                  <p className="info__desc cl-text-2">
                    Soft cushioning absorbs impact for all-day comfort.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Features;
