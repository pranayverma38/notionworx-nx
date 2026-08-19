import Link from "next/link";
import Image from "next/image";

function Section404() {
  return (
    <>
      <section className="section-404 flat-spacing">
        <div className="container">
          <div className="row">
            <div className="col-md-8 offset-md-2 col-sm-10 offset-sm-1">
              <div className="image">
                <Image
                  loading="lazy"
                  width={930}
                  height={579}
                  src="/assets/images/section/404.svg"
                  alt="Image"
                />
              </div>
            </div>
            <div className="col-12">
              <div className="wrap">
                <div className="content">
                  <h2 className="title">Something’s Missing</h2>
                  <p className="sub-title cl-text-2">
                    This page is missing or you assembled the link incorrectly
                  </p>
                </div>
                <div className="group-btn">
                  <Link href={`/`} className="tf-btn animate-btn">
                    Back to home page
                  </Link>
                  <Link href={`/shop-default`} className="tf-btn btn-stroke">
                    Product list
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Section404;
