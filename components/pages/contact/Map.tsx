import Image from "next/image";
import Link from "next/link";

export default function Map() {
  return (
    <div className="section-map flat-spacing-2 pb-0">
      <div className="container">
        <div className="wg-map overflow-hidden">
          <div className="row g-0 align-items-stretch">
            <div className="col-lg-7">
              <Image
                src="/assets/images/notionworx-inventory/custom-food-booths-canopy-tents/custom-food-booth-canopy-tent-16-10/01.png"
                alt="Notion Worx contact hero"
                width={960}
                height={540}
                loading="lazy"
              />
            </div>
            <div className="col-lg-5">
              <div className="p-4 p-lg-5 d-flex h-100 flex-column justify-content-center">
                <p className="text-caption-01 text-primary mb-8">
                  Contact The Team
                </p>
                <h4 className="mb-12">
                  Planning a branded event, trade show booth, or team apparel run?
                </h4>
                <p className="cl-text-2 mb-20">
                  Use the contact form below to tell us which product family you
                  are exploring, what size or quantity you need, and whether you
                  want help with artwork setup.
                </p>
                <div className="d-flex flex-column gap-12">
                  <Link href="/collection" className="tf-btn animate-btn">
                    Browse collections
                  </Link>
                  <Link href="/shop-default" className="tf-btn btn-line">
                    Shop all products
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
