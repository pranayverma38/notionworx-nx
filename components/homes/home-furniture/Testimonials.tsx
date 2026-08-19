import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { testimonialFurnitureSlides } from "@/data/testimonials";
import { formatPrice } from "@/utils/formatPrice";

function Testimonials() {
  return (
    <section className="section-testimonial-v2 tf-btn-swiper-main">
      <div className="container-full">
        <div className="wrap flat-spacing">
          <div className="container">
            <div className="sect-heading type-2 has-col-right wow fadeInUp">
              <div>
                <h3 className="s-title">What Our Customers Say</h3>
                <p className="s-desc text-body-1 cl-text-2">
                  Real stories from people who love our products.
                </p>
              </div>
              <div className="col-right d-flex gap-12">
                <div className="tf-sw-nav-2 style-large nav-prev-swiper">
                  <i className="icon icon-ArrowLeft" aria-hidden />
                </div>
                <div className="tf-sw-nav-2 style-large nav-next-swiper">
                  <i className="icon icon-ArrowRight" aria-hidden />
                </div>
              </div>
            </div>
            <TfSwiper
              preview={2}
              tablet={2}
              mobileSm={1}
              mobile={1}
              spaceLg={40}
              spaceMd={15}
              space={10}
              pagination={1}
              paginationSm={2}
              paginationMd={2}
              paginationLg={2}
              externalNavSelectors={{
                nextEl: ".tf-btn-swiper-main .nav-next-swiper",
                prevEl: ".tf-btn-swiper-main .nav-prev-swiper",
              }}
            >
              {testimonialFurnitureSlides.map((slide, index) => (
                <div
                  key={slide.authorName + (slide.product?.name ?? "") + index}
                  className="testimonial-v04 wow fadeInUp"
                >
                  <div className="star-wrap d-flex align-items-center mb-16">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="icon icon-Star fs-24" aria-hidden />
                    ))}
                  </div>
                  <div className="tes_author d-flex align-items-center gap-8 mb-24">
                    <h6 className="author-name">{slide.authorName}</h6>
                    {slide.verifiedLabel != null && (
                      <div className="author-verified d-flex align-items-center gap-4">
                        <i className="icon icon-CheckCircle1" aria-hidden />
                        <span className="cl-text-2">{slide.verifiedLabel}</span>
                      </div>
                    )}
                  </div>
                  <p className="tes_text h5 text-capitalize mb-24">
                    &quot;{slide.quote}&quot;
                  </p>
                  <div className="br-line mb-24" />
                  {slide.product != null && (
                    <div className="tes_product">
                      <div className="product-image">
                        <Image
                          src={`${slide.product.img}`}
                          alt={slide.product.name}
                          width={80}
                          height={80}
                          loading="lazy"
                        />
                      </div>
                      <div className="product-infor">
                        <Link
                          href={`/product-detail/${slide.product.id}`}
                          className="link fw-medium lh-24"
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
              ))}
            </TfSwiper>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
