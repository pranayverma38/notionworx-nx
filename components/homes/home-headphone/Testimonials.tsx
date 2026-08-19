import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { testimonialHeadphoneSlides } from "@/data/testimonials";
import { formatPrice } from "@/utils/formatPrice";

function Testimonials() {
  return (
    <div className="container-full">
      <div className="section-testimonials position-relative">
        <div className="banner">
          <Image
            src="/assets/images/testimonial/tes-21.jpg"
            alt="testimonial"
            width={1770}
            height={600}
            loading="lazy"
          />
        </div>
        <div className="wrap-tes">
          <TfSwiper
            loop
            delay={3000}
            space={15}
            paginationClassName="sw-line-default tf-sw-pagination"
          >
            {testimonialHeadphoneSlides.map((slide) => (
              <div
                key={slide.authorName + (slide.product?.img ?? "")}
                className="testimonial-v01 style-7 style-def wow fadeInLeft"
              >
                <div className="tes-content">
                  <div className="star-wrap d-flex align-items-center justify-content-center">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="icon icon-Star fs-24" aria-hidden />
                    ))}
                  </div>
                  <div className="tes_author justify-content-center">
                    <h5 className="author-name text-white">{slide.authorName}</h5>
                    <div className="br-line" />
                    {slide.verifiedLabel != null && (
                      <div className="author-verified">
                        <i className="icon icon-CheckCircle1" aria-hidden />
                        <span className="text-white">{slide.verifiedLabel}</span>
                      </div>
                    )}
                  </div>
                  <p className="tes_text h4 text-white text-capitalize fw-normal">
                    {slide.quote}
                  </p>
                  {slide.product != null && (
                    <div className="tes_product text-start">
                      <div className="product-image">
                        <Image
                          className="aspect-ratio-1 object-fit-cover"
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
                        <div className="price-wrap">
                          <span className="price-new text-primary fw-semibold">
                            {formatPrice(slide.product.price)}
                          </span>
                          {slide.product.priceOld != null && (
                            <span className="price-old cl-text-3">
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
        </div>
      </div>
    </div>
  );
}

export default Testimonials;
