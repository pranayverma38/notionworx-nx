import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { testimonialBabySlides } from "@/data/testimonials";
import { formatPrice } from "@/utils/formatPrice";

function Testimonials() {
  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="sect-heading type-2 has-col-right wow fadeInUp">
          <div>
            <h3 className="s-title">Loved By Happy Parents</h3>
            <p className="s-desc cl-text-2 text-body-1">
              Real stories from moms and dads who trust us with their
              baby&apos;s care.
            </p>
          </div>
          <div className="col-right">
            <Link
              href="/shop-default"
              className="tf-btn-line-2 py-4 style-primary"
            >
              <span className="fw-semibold"> View All Products </span>
            </Link>
          </div>
        </div>
        <TfSwiper
          preview={4}
          tablet={3}
          mobileSm={2}
          mobile={1}
          spaceLg={20}
          spaceMd={15}
          space={10}
          pagination={2}
          paginationSm={1}
          paginationMd={3}
          paginationLg={4}
        >
          {testimonialBabySlides.map((slide, index) => (
            <div
              key={slide.authorImg}
              className="testimonial-v01 style-2 type-2 wow fadeInLeft"
              data-wow-delay={index > 0 ? `${index * 0.1}s` : undefined}
            >
              <div className="tes-content">
                <div className="tes_avatar">
                  <Image
                    src={`${slide.authorImg}`}
                    alt={slide.authorAlt || "Image"}
                    width={60}
                    height={60}
                    loading="lazy"
                  />
                </div>
                <div className="star-wrap d-flex align-items-center">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="icon icon-Star fs-24" aria-hidden />
                  ))}
                </div>
                <div className="tes_author">
                  <h6 className="author-name">{slide.authorName}</h6>
                  <div className="author-verified">
                    <i className="icon icon-CheckCircle1" aria-hidden />
                    <span className="text cl-text-2"> Verified Buyer </span>
                  </div>
                </div>
                <p className="tes_text h6 fw-medium">{slide.quote}</p>
                <div className="tes_product">
                  <div className="product-image">
                    {slide.product && (
                      <Image
                        src={`${slide.product.img}`}
                        alt=""
                        width={60}
                        height={60}
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="product-infor">
                    <Link
                      href={`/product-detail/${slide.product?.id}`}
                      className="prd_name link fw-medium lh-24 text-line-clamp-1"
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
