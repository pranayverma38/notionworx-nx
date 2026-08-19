import Link from "next/link";
import Image from "next/image";
import React from "react";

function InfiniteSlide() {
  return (
    <>
      <div className="bg-main-2">
        <div className="infiniteSlide-cls wow fadeInUp">
          <div className="infiniteslide_wrap">
            <div className="infiniteSlide infinite-slider infiniteSlide-wrapper">
              {Array.from({ length: 4 }).map((_, index) => (
                <React.Fragment key={index}>
                  <div className="infiniteSlide-item">
                    <Link href={`/shop-default`} className="cls-wrap">
                      <h4>Modern Minimalism</h4>
                      <div className="img-cls">
                        <Image
                          loading="lazy"
                          width={80}
                          height={80}
                          src="/assets/images/collection/cls-34.jpg"
                          alt="Image"
                        />
                      </div>
                    </Link>
                  </div>
                  <div className="infiniteSlide-item">
                    <Link href={`/shop-default`} className="cls-wrap">
                      <h4>Artisan Craftsmanship</h4>
                      <div className="img-cls">
                        <Image
                          loading="lazy"
                          width={80}
                          height={80}
                          src="/assets/images/collection/cls-35.jpg"
                          alt="Image"
                        />
                      </div>
                    </Link>
                  </div>
                  <div className="infiniteSlide-item">
                    <Link href={`/shop-default`} className="cls-wrap">
                      <h4>Sustainable Luxury</h4>
                      <div className="img-cls">
                        <Image
                          loading="lazy"
                          width={80}
                          height={80}
                          src="/assets/images/collection/cls-36.jpg"
                          alt="Image"
                        />
                      </div>
                    </Link>
                  </div>
                  <div className="infiniteSlide-item">
                    <Link href={`/shop-default`} className="cls-wrap">
                      <h4>Luxe and Livable</h4>
                      <div className="img-cls">
                        <Image
                          loading="lazy"
                          width={80}
                          height={80}
                          src="/assets/images/collection/cls-37.jpg"
                          alt="Image"
                        />
                      </div>
                    </Link>
                  </div>
                  <div className="infiniteSlide-item">
                    <Link href={`/shop-default`} className="cls-wrap">
                      <h4>Confidence in Every Step</h4>
                      <div className="img-cls">
                        <Image
                          loading="lazy"
                          width={80}
                          height={80}
                          src="/assets/images/collection/cls-38.jpg"
                          alt="Image"
                        />
                      </div>
                    </Link>
                  </div>
                  <div className="infiniteSlide-item">
                    <Link href={`/shop-default`} className="cls-wrap">
                      <h4>Curated Confidence</h4>
                      <div className="img-cls">
                        <Image
                          loading="lazy"
                          width={80}
                          height={80}
                          src="/assets/images/collection/cls-3.jpg"
                          alt="Image"
                        />
                      </div>
                    </Link>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default InfiniteSlide;
