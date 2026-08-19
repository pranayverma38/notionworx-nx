import Link from "next/link";

function PageTitle() {
  return (
    <>
      <section className="section-page-title text-center flat-spacing-2 pb-0">
        <div className="container">
          <div className="main-page-title">
            <div className="breadcrumbs">
              <Link href={`/`} className="text-caption-01 cl-text-3 link">
                Home
              </Link>
              <i className="icon icon-CaretRightThin cl-text-3" />
              <p className="text-caption-01">Compare Products</p>
            </div>
            <h3>Compare Products</h3>
            <p className="text-body-1 cl-text-2">
              Compare your favorite products side by side to find the best match
              for your
              <br className="d-none d-lg-block" />
              needs, style, and everyday lifestyle.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default PageTitle;
