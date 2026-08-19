import Image from "next/image";

import { testimonialSlides } from "@/data/testimonials";
import TfSwiper from "@/components/ui/TfSwiper";

function Testimonial() {
  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="sect-heading type-2 text-center">
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
          paginationLg={2}
          paginationMd={2}
          paginationSm={2}
          pagination={1}
          paginationClassName="sw-line-default style-2 tf-sw-pagination"
        >
          {testimonialSlides.map((item, index) => (
            <div key={index} className="testimonial-v01 style-1 style-def">
              <div className="tes-image">
                <Image
                  loading="lazy"
                  width={285}
                  height={380}
                  src={item.authorImg}
                  alt={item.authorName}
                />
              </div>
              <div className="tes-content">
                <div className="star-wrap d-flex align-items-center">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="icon icon-Star fs-24 text-primary" />
                  ))}
                </div>
                <div className="tes_author">
                  <p className="author-name h5 fw-medium">{item.authorName}</p>
                  <div className="br-line" />
                  <div className="author-verified">
                    <i className="icon icon-CheckCircle1" />
                    <span className="cl-text-2">Verified Buyer</span>
                  </div>
                </div>
                <p className="tes_text h6">{item.quote}</p>
                {item.product && (
                  <div className="tes_product">
                    <div className="product-image">
                      {item.product.img && (
                        <Image
                          className="aspect-ratio-1 object-fit-cover"
                          loading="lazy"
                          width={60}
                          height={60}
                          src={item.product.img}
                          alt={item.product.name}
                        />
                      )}
                    </div>
                    <div className="product-infor">
                      <a href="#" className="link fw-medium lh-24">
                        {item.product.name}
                      </a>
                      <p className="prd_price fw-semibold text-primary">
                        ${item.product.price.toFixed(2)}
                      </p>
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

export default Testimonial;
