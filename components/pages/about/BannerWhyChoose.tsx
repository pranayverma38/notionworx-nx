import Image from "next/image";

function BannerWhyChoose() {
  return (
    <>
      <section className="themesFlat">
        <div className="container">
          <div className="banner-why-choose">
            <div className="bn-image">
              <Image
                loading="lazy"
                width={640}
                height={480}
                src="/assets/images/section/s-contact-2.jpg"
                alt="Image"
              />
            </div>
            <div className="bn-content">
              <h3 className="mb-12">
                Offering Rare And Beautiful Items Worldwide
              </h3>
              <div className="" id="accordion-v2">
                <div className="accordion-item_v2">
                  <div
                    className="accordion-action lh-24 fw-medium"
                    data-bs-target="#faq-1"
                    data-bs-toggle="collapse"
                    aria-expanded="true"
                    aria-controls="faq-1"
                    role="button"
                  >
                    <span>Introduction</span>
                    <span className="icon ic-accordion-custom cl-2" />
                  </div>
                  <div
                    id="faq-1"
                    className="collapse show"
                    data-bs-parent="#accordion-v2"
                  >
                    <p className="faq-content cl-text-2">
                      Welcome to Amerce Store, your premier destination for
                      fashion-forward clothing accessories. We pride ourselves
                      on offering a curated selection of rare beautiful items
                      sourced both locally and globally. Our mission is to bring
                      you the latest trends &amp; timeless styles, ensuring
                      every piece reflects quality and elegance.
                    </p>
                  </div>
                </div>
                <div className="accordion-item_v2">
                  <div
                    className="accordion-action collapsed lh-24 fw-medium"
                    data-bs-target="#faq-2"
                    data-bs-toggle="collapse"
                    aria-expanded="true"
                    aria-controls="faq-2"
                    role="button"
                  >
                    <span>Our Vision</span>
                    <span className="icon ic-accordion-custom cl-2" />
                  </div>
                  <div
                    id="faq-2"
                    className="collapse"
                    data-bs-parent="#accordion-v2"
                  >
                    <p className="faq-content cl-text-2">
                      Welcome to Amerce Store, your premier destination for
                      fashion-forward clothing accessories. We pride ourselves
                      on offering a curated selection of rare beautiful items
                      sourced both locally and globally. Our mission is to bring
                      you the latest trends &amp; timeless styles, ensuring
                      every piece reflects quality and elegance.
                    </p>
                  </div>
                </div>
                <div className="accordion-item_v2">
                  <div
                    className="accordion-action collapsed lh-24 fw-medium"
                    data-bs-target="#faq-3"
                    data-bs-toggle="collapse"
                    aria-expanded="true"
                    aria-controls="faq-3"
                    role="button"
                  >
                    <span>What Sets Us Apart</span>
                    <span className="icon ic-accordion-custom cl-2" />
                  </div>
                  <div
                    id="faq-3"
                    className="collapse"
                    data-bs-parent="#accordion-v2"
                  >
                    <p className="faq-content cl-text-2">
                      Welcome to Amerce Store, your premier destination for
                      fashion-forward clothing accessories. We pride ourselves
                      on offering a curated selection of rare beautiful items
                      sourced both locally and globally. Our mission is to bring
                      you the latest trends &amp; timeless styles, ensuring
                      every piece reflects quality and elegance.
                    </p>
                  </div>
                </div>
                <div className="accordion-item_v2">
                  <div
                    className="accordion-action collapsed lh-24 fw-medium"
                    data-bs-target="#faq-4"
                    data-bs-toggle="collapse"
                    aria-expanded="true"
                    aria-controls="faq-4"
                    role="button"
                  >
                    <span>Our Commitment</span>
                    <span className="icon ic-accordion-custom cl-2" />
                  </div>
                  <div
                    id="faq-4"
                    className="collapse"
                    data-bs-parent="#accordion-v2"
                  >
                    <p className="faq-content cl-text-2">
                      Welcome to Amerce Store, your premier destination for
                      fashion-forward clothing accessories. We pride ourselves
                      on offering a curated selection of rare beautiful items
                      sourced both locally and globally. Our mission is to bring
                      you the latest trends &amp; timeless styles, ensuring
                      every piece reflects quality and elegance.
                    </p>
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

export default BannerWhyChoose;
