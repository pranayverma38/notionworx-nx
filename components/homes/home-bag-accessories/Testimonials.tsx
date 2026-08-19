import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { testimonialBagAccessoriesSlides } from "@/data/testimonials";
import { formatPrice } from "@/utils/formatPrice";

function Testimonials() {
  return (
    <section className="flat-spacing">
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
          spaceLg={60}
          spaceMd={30}
          space={15}
          pagination={1}
          paginationSm={2}
          paginationMd={2}
          paginationLg={2}
          touch={false}
          paginationClassName="sw-line-default style-2 tf-sw-pagination"
        >
          {testimonialBagAccessoriesSlides.map((slide, index) => (
            <div
              key={slide.authorImg}
              className="testimonial-v01 style-1 style-def wow fadeInLeft"
            >
              <div className="tes-image">
                <Image
                  src={`${slide.authorImg}`}
                  alt={slide.authorAlt ?? "Image"}
                  width={285}
                  height={380}
                  loading="lazy"
                />
              </div>
              <div className="tes-content">
                <div className="star-wrap d-flex align-items-center">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="icon icon-Star fs-24" aria-hidden />
                  ))}
                </div>
                <div className="tes_author mb-20">
                  <p className="author-name h6">{slide.authorName}</p>
                  <div className="author-verified">
                    <i className="icon icon-CheckCircle1" aria-hidden />
                    <span className="cl-text-2">Verified Buyer</span>
                  </div>
                </div>
                <p className="tes_text h6 text-capitalize">{slide.quote}</p>
                <div className="tes_product">
                  <div
                    className={`product-image radius-8${index === 1 ? " flex-shrink-0" : ""}`}
                  >
                    {slide.product && (
                      <Image
                        src={`${slide.product.img}`}
                        alt=""
                        width={88}
                        height={88}
                        className="aspect-ratio-1 object-fit-cover"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="product-infor">
                    <Link
                      href={`/product-detail/${slide.product?.id}`}
                      className="link-underline-primary fw-medium lh-24"
                    >
                      {slide.product?.name}
                    </Link>
                    <div className="price-wrap prd_price">
                      <span className="price-new text-primary fw-semibold">
                        {slide.product?.price != null && formatPrice(slide.product.price)}
                      </span>
                      {slide.product?.priceOld != null && (
                        <span className="price-old text-caption-01 cl-text-3">
                          {formatPrice(slide.product.priceOld)}
                        </span>
                      )}
                    </div>
                  </div>
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
