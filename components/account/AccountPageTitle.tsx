import Link from "next/link";

type AccountPageTitleProps = {
  /** Breadcrumb + heading (default: My Account) */
  heading?: string;
  /** Optional subtitle; default matches former account pages */
  description?: string;
};

export default function AccountPageTitle({
  heading = "My Account",
  description = "Manage your profile, track orders, and easily update your personal details anytime,",
}: AccountPageTitleProps) {
  return (
    <section className="section-page-title text-center flat-spacing-2 pb-0">
      <div className="container">
        <div className="main-page-title">
          <div className="breadcrumbs">
            <Link href="/" className="text-caption-01 cl-text-3 link">
              Home
            </Link>
            <i className="icon icon-CaretRightThin cl-text-3" />
            <p className="text-caption-01">{heading}</p>
          </div>
          <h3>{heading}</h3>
          <p className="text-body-1 cl-text-2">
            {description}
            <br className="d-none d-lg-block" />
            all in one convenient place.
          </p>
        </div>
      </div>
    </section>
  );
}
