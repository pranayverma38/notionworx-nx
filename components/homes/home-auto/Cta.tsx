import Link from "next/link";
import Image from "next/image";

import { PreventDefaultForm } from "@/components/forms/PreventDefaultForm";

function Cta() {
  return (
    <>
      <section className="section-cta themesFlat">
        <div className="container">
          <div className="row gy-4">
            <div className="col-lg-6">
              <div className="banner-image-text type-abs style-9 h-100">
                <Link href={`/shop-default`} className="bn-image img-style">
                  <Image
                    loading="lazy"
                    width={690}
                    height={620}
                    src="/assets/images/section/banner-27.jpg"
                    alt="Image"
                  />
                </Link>
                <div className="bn-content wow fadeInUp">
                  <Link
                    href={`/shop-default`}
                    className="title h3 fw-medium text-white link"
                  >
                    Top Quality Auto Parts <br className="d-none d-sm-block" />
                    &amp; Smart Accessories
                  </Link>
                  <p className="desc text-white text-body-1">
                    Discover Premium Parts to Enhance Performance.
                  </p>
                  <Link
                    href={`/shop-default`}
                    className="btn-action tf-btn btn-white"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <PreventDefaultForm className="form-cta">
                <div className="heading">
                  <h3 className="">Contact Us</h3>
                  <p className="text-body-1 cl-text-2">
                    You can also call customer service on (+01) 1234 8888
                  </p>
                </div>
                <div className="form-content">
                  <div className="tf-grid-layout sm-col-2 gap-16">
                    <fieldset>
                      <input type="text" placeholder="Your Name*" required />
                    </fieldset>
                    <fieldset>
                      <input type="text" placeholder="Your Email*" required />
                    </fieldset>
                  </div>
                  <div className="tf-grid-layout sm-col-2 gap-16">
                    <fieldset>
                      <input type="number" placeholder="Phone" required />
                    </fieldset>
                    <fieldset>
                      <input type="text" placeholder="Subject" required />
                    </fieldset>
                  </div>
                  <textarea
                    placeholder="Your Message*"
                    required
                    defaultValue={""}
                  />
                </div>
                <div className="submit">
                  <button type="submit" className="tf-btn animate-btn">
                    Send message
                  </button>
                </div>
              </PreventDefaultForm>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Cta;
