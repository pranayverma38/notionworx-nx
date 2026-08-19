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
              <p className="text-caption-01">Project Support</p>
            </div>
            <h3>Project Support</h3>
            <p className="text-body-1 cl-text-2">
              Explore the core collections now driving the migrated Notion Worx
              storefront and quickly find
              <br className="d-none d-lg-block" />
              the product family that best fits your next event or promotion.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default PageTitle;
