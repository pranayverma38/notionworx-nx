import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { testimonialMentalSlides } from "@/data/testimonials";
import { formatPrice } from "@/utils/formatPrice";

function Testimonials() {
  return (
    <section className="flat-spacing pt-0">
      <div className="container">
        <div className="sect-heading type-2 text-center wow fadeInUp">
          <h3 className="s-title">Customer Say!</h3>
          <p className="s-desc text-body-1 cl-text-2">
            Our customers adore our products, and we constantly aim to delight
            them.
          </p>
        </div>
        <TfSwiper
          preview={2}
          tablet={2}
          mobileSm={1}
          mobile={1}
          spaceLg={30}
          spaceMd={15}
          space={10}
          pagination={1}
          paginationSm={2}
          paginationMd={2}
          paginationLg={2}
          paginationClassName="sw-line-default style-2 tf-sw-pagination"
        >
          {testimonialMentalSlides.map((slide, index) => (
            <div
              key={`mental-${slide.product?.img ?? slide.authorName}-${index}`}
              className="testimonial-v01 style-2 wow fadeInUp"
            >
              <div className="tes-content">
                <div className="star-wrap d-flex align-items-center">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="icon icon-Star fs-24" aria-hidden />
                  ))}
                </div>
                <div className="tes_author">
                  <h5 className="author-name">{slide.authorName}</h5>
                  <div className="br-line" />
                  {slide.verifiedLabel != null && (
                    <div className="author-verified">
                      <i className="icon icon-CheckCircle1" aria-hidden />
                      <span className="cl-text-2"> {slide.verifiedLabel} </span>
                    </div>
                  )}
                </div>
                <p className="tes_text h6 fw-medium text-capitalize">
                  &quot;{slide.quote}&quot;
                </p>
                {slide.product != null && (
                  <div className="tes_product">
                    <div className="product-image">
                      <Image
                        src={`${slide.product.img}`}
                        alt={slide.product.name}
                        width={60}
                        height={60}
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
            </div>
          ))}
        </TfSwiper>
      </div>
    </section>
  );
}

export default Testimonials;
