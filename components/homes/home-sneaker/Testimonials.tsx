import Image from "next/image";
import TfSwiper from "@/components/ui/TfSwiper";
import { testimonialSneakerSlides } from "@/data/testimonials";

function Testimonials() {
  return (
    <section className="container-full">
      <div className="bg-main flat-spacing radius-20">
        <div className="container">
          <div className="sect-heading text-center wow fadeInUp">
            <h3 className="s-title mb-8">What Customers Are Saying</h3>
            <p className="s-desc text-body-1 cl-text-2">
              Honest reviews from real users who love our sport shoes
            </p>
          </div>
          <TfSwiper
            preview={2}
            tablet={2}
            mobileSm={1}
            mobile={1}
            spaceLg={30}
            spaceMd={20}
            space={15}
            pagination={1}
            paginationSm={2}
            paginationMd={2}
            paginationLg={2}
            paginationClassName="sw-line-default style-2 tf-sw-pagination mt-xl-40"
          >
            {testimonialSneakerSlides.map((slide, index) => (
              <div
                key={`sneaker-${slide.authorImg}-${index}`}
                className="testimonial-v05 wow fadeInLeft"
              >
                {slide.authorImg != null && (
                  <div className="tes-image">
                    <Image
                      src={`${slide.authorImg}`}
                      alt={slide.authorAlt ?? "Image"}
                      width={345}
                      height={380}
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="tes-content">
                  <div className="star-wrap d-flex align-items-center mb-16">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className="icon icon-Star cl-text-main fs-24"
                        aria-hidden
                      />
                    ))}
                  </div>
                  <p className="tes_text text-body-1 mb-16">
                    &quot;{slide.quote}&quot;
                  </p>
                  <h5 className="tes_name mt-auto">{slide.authorName}</h5>
                </div>
              </div>
            ))}
          </TfSwiper>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
