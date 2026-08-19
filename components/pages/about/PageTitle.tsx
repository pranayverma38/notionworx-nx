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
              With over 15 years of experience, we craft timeless collections
              that transcend
              <br className="d-none d-lg-block" />
              trends and inspire lasting elegance.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default PageTitle;
