import Link from "next/link";

function PageTitle() {
  return (
    <>
      <section className="section-page-title text-center flat-spacing-2">
        <div className="container">
          <div className="main-page-title">
            <div className="breadcrumbs">
              <Link href={`/`} className="text-caption-01 cl-text-3 link">
                Home
              </Link>
              <i className="icon icon-CaretRightThin cl-text-3" />
              <p className="text-caption-01">Order Tracking</p>
            </div>
            <h3>Order Tracking</h3>
            <p className="text-body-1 cl-text-2">
              To track your order, please enter your order ID in the box below
              and press the &quot;Track&quot; button.
              <br className="d-none d-lg-block" />
              The ID has been sent to you on your receipt and in the
              confirmation email you received.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default PageTitle;
