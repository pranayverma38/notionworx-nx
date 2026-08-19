import Link from "next/link";

export default function PageTitle() {
  return (
    <section className="section-page-title text-center flat-spacing-2 pb-0">
      <div className="container">
        <div className="main-page-title">
          <div className="breadcrumbs">
            <Link href="/" className="text-caption-01 cl-text-3 link">
              Home
            </Link>
            <i className="icon icon-CaretRightThin cl-text-3" />
            <p className="text-caption-01">Check Out</p>
          </div>
          <h3>Check Out</h3>
          <p className="text-body-1 cl-text-2">
            Review your order details carefully and complete your purchase
            securely and
            <br className="d-none d-lg-block" />
            easily for a smooth shopping experience.
          </p>
        </div>
      </div>
    </section>
  );
}
