import Image from "next/image";
import TfSwiper from "@/components/ui/TfSwiper";
import { testimonialGardenSlides } from "@/data/testimonials";
import QuickViewButton from "@/components/common/QuickViewButton";

function Testimonials() {
  return (
    <section className="flat-spacing pt-0">
      <div className="container">
        <div className="sect-heading type-2 text-center wow fadeInUp">
          <h3 className="s-title">What Our Customers Say</h3>
          <p className="s-desc text-body-1 cl-text-2">
            Real stories from people who love our products.
          </p>
        </div>
        <TfSwiper
          preview={3}
          tablet={2}
          mobileSm={2}
          mobile={1}
          spaceLg={30}
          spaceMd={20}
          space={10}
          pagination={1}
          paginationSm={2}
          paginationMd={2}
          paginationLg={3}
          paginationClassName="sw-line-default style-2 tf-sw-pagination"
        >
          {testimonialGardenSlides.map((slide) => (
            <div key={slide.authorImg ?? slide.authorName} className="testimonial-v03 hover-img4">
              <div className="img-style4">
                {slide.authorImg != null && (
                  <Image
                    src={`${slide.authorImg}`}
                    alt={slide.authorAlt ?? "testimonial"}
                    width={450}
                    height={312}
                    loading="lazy"
                  />
                )}
                <ul className="tes-action_list">
                  <li>
                    <QuickViewButton />
                  </li>
                </ul>
              </div>
              <div className="content">
                <div className="star-wrap d-flex align-items-center mb-12">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="icon icon-Star fs-24" aria-hidden />
                  ))}
                </div>
                <div className="tes_author mb-8">
                  <div className="h6 author-name">{slide.authorName}</div>
                  {slide.verifiedLabel != null && (
                    <div className="author-verified">
                      <i className="icon icon-CheckCircle1" aria-hidden />
                      <span className="cl-text-2">{slide.verifiedLabel}</span>
                    </div>
                  )}
                </div>
                <div className="h6 text-capitalize">
                  &quot;{slide.quote}&quot;
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
