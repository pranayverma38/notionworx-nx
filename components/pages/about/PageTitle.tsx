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
              <p className="text-caption-01">About Us</p>
            </div>
            <h3>About Us</h3>
            <p className="text-body-1 cl-text-2">
              Notion Worx helps brands show up consistently across custom
              canopies, displays, flags, apparel, and event-ready
              <br className="d-none d-lg-block" />
              merchandising.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default PageTitle;
