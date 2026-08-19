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
              <p className="text-caption-01">Contact Us</p>
            </div>
            <h3>Contact Us</h3>
            <p className="text-body-1 cl-text-2">
              Get in touch with us for inquiries, support, or collaboration
              we’re here to help you.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default PageTitle;
