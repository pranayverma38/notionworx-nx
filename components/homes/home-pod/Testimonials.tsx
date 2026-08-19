import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { testimonialPodSlides } from "@/data/testimonials";
import { formatPrice } from "@/utils/formatPrice";

function Testimonials() {
  return (
    <section className="flat-spacing pb-0">
      <div className="container">
        <div className="sect-heading type-2 text-center wow fadeInUp">
          <h3 className="s-title">Customer Say!</h3>
          <p className="s-desc text-body-1 cl-text-2">
            Our customers adore our products, and we constantly aim to delight
            them.
          </p>
        </div>
        <div className="tf-btn-swiper-main pst-nav-action">
          <TfSwiper
            preview={2}
            tablet={2}
            mobileSm={1}
            mobile={1}
            spaceLg={60}
            spaceMd={30}
            space={15}
            pagination={1}
            paginationSm={2}
            paginationMd={2}
            paginationLg={2}
            useExternalNav
            paginationClassName="sw-line-default style-2 tf-sw-pagination d-xxxl-none"
          >
            {testimonialPodSlides.map((slide, index) => (
              <div
                key={`pod-${slide.authorImg}-${index}`}
                className="testimonial-v01 style-1 type-2 wow fadeInUp"
                data-wow-delay={index > 0 ? `${index * 0.1}s` : undefined}
              >
                {slide.authorImg != null && (
                  <div className="tes-image">
                    <Image
                      src={`${slide.authorImg}`}
                      alt={slide.authorAlt ?? "Image"}
                      width={285}
                      height={380}
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="tes-content">
                  <div className="star-wrap d-flex align-items-center">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="icon icon-Star fs-24" aria-hidden />
                    ))}
                  </div>
                  <p className="tes_text text-body-1 flex-unset">
                    &quot;{slide.quote}&quot;
                  </p>
                  <div className="tes_author mb-xl-auto">
                    <h6 className="author-name">{slide.authorName}</h6>
                    <div className="br-line" />
                    {slide.verifiedLabel != null && (
                      <div className="author-verified">
                        <i className="icon icon-CheckCircle1" aria-hidden />
                        <span className="cl-text-2">{slide.verifiedLabel}</span>
                      </div>
                    )}
                  </div>
                  {slide.product != null && (
                    <div className="tes_product">
                      <div className="product-image flex-shrink-0">
                        <Image
                          className="aspect-ratio-1 object-fit-cover"
                          src={`${slide.product.img}`}
                          alt={slide.product.name}
                          width={88}
                          height={88}
                          loading="lazy"
                        />
                      </div>
                      <div className="product-infor">
                        <Link
                          href={`/product-detail/${slide.product.id}`}
                          className="link fw-medium lh-24 text-line-clamp-2"
                        >
                          {slide.product.name}
                        </Link>
                        <div className="price-wrap prd_price">
                          <span className="price-new text-primary fw-semibold">
                            {formatPrice(slide.product.price)}
                          </span>
                          {slide.product.priceOld != null && (
                            <span className="price-old text-caption-01 cl-text-3">
                              {formatPrice(slide.product.priceOld)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </TfSwiper>
          <div className="group-nav-action pst-3 d-xxxl-flex">
            <div className="tf-sw-nav-2 nav-prev-swiper">
              <i className="icon icon-ArrowLeft" aria-hidden />
            </div>
            <div className="tf-sw-nav-2 nav-next-swiper">
              <i className="icon icon-ArrowRight" aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
