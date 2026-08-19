import Image from "next/image";
import TfSwiper from "@/components/ui/TfSwiper";
import { testimonialFashionSlides } from "@/data/testimonials";

function Testimonials() {
  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="sect-heading type-2 text-center wow fadeInUp mb-44">
          <h3 className="s-title">What Our Customers Say</h3>
          <p className="s-desc text-body-1 cl-text-2">
            Real feedback from those who train, move, and live in our gear.
          </p>
        </div>
        <TfSwiper
          preview={4}
          tablet={3}
          mobileSm={2}
          mobile={2}
          spaceLg={30}
          spaceMd={20}
          space={10}
          pagination={2}
          paginationSm={2}
          paginationMd={3}
          paginationLg={4}
          paginationClassName="sw-dot-default tf-sw-pagination"
          className="wrap-sw-over"
        >
          {testimonialFashionSlides.map((slide, index) => (
            <div
              key={slide.authorImg}
              className="testimonial-v01 hover-img4 style-6"
              data-wow-delay={index > 0 ? `${index * 0.1}s` : undefined}
            >
              <div className="img-style4">
                <Image
                  src={`${slide.authorImg}`}
                  alt={slide.authorAlt ?? "Image"}
                  width={330}
                  height={330}
                  loading="lazy"
                />
              </div>
              <div>
                <div className="star-wrap d-flex align-items-center mb-12">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="icon icon-Star fs-20" aria-hidden />
                  ))}
                </div>
                <p className="text-body-1 mb-12">&quot;{slide.quote}&quot;</p>
                <div className="text-caption-01 d-flex gap-4">
                  {slide.authorName}
                  {slide.role != null && (
                    <>
                      <span className="cl-text-3">/</span>
                      <span className="cl-text-3">{slide.role}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </TfSwiper>
      </div>
    </section>
  );
}

export default Testimonials;
