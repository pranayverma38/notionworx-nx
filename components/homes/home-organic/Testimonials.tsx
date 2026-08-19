import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { testimonialOrganicSlides } from "@/data/testimonials";
import { formatPrice } from "@/utils/formatPrice";

function Testimonials() {
  return (
    <section className="flat-spacing">
      <div className="container-2">
        <div className="sect-heading text-center wow fadeInUp">
          <h3 className="s-title">Loved By Our Customers</h3>
          <p className="s-desc cl-text-2">
            Real stories from people who trust and love our organic products
            every day.
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
          paginationClassName="sw-dot-default tf-sw-pagination"
        >
          {testimonialOrganicSlides.map((slide, index) => (
            <div
              key={`organic-${slide.authorName}-${slide.product?.img ?? index}`}
              className="testimonial-v01 style-def style-4 type-2 wow fadeInLeft"
              data-wow-delay={index > 0 ? `${index * 0.1}s` : undefined}
            >
              {slide.authorImg != null && (
                <div className="tes-image">
                  <Image
                    src={`${slide.authorImg}`}
                    alt={slide.authorAlt ?? "Image"}
                    width={410}
                    height={273}
                    loading="lazy"
                  />
                </div>
              )}
              <div className="tes-content">
                <div className="star-wrap d-flex align-items-center">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="icon icon-Star fs-16" aria-hidden />
                  ))}
                </div>
                <p className="tes_text cl-text-2">&quot;{slide.quote}&quot;</p>
                <div className="tes_author">
                  <p className="author-name lh-24 fw-medium">{slide.authorName}</p>
                  <div className="author-verified">
                    <i className="icon icon-CheckCircle fs-20" aria-hidden />
                  </div>
                </div>
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
                        <span className="price-new fw-semibold">
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
