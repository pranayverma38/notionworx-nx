import type { ReactNode } from "react";

import Link from "next/link";

type PageTitleHeaderProps = {
  breadcrumbLabel: ReactNode;
  title: ReactNode;
  description: ReactNode;
  hideDetailsOnMobile?: boolean;
};

export default function PageTitleHeader({
  breadcrumbLabel,
  title,
  description,
  hideDetailsOnMobile = true,
}: PageTitleHeaderProps) {
  return (
    <section className="section-page-title flat-spacing-2 pb-0">
      <div className="container">
        <div className="main-page-title">
          <div className="breadcrumbs justify-content-start text-start">
            <Link href="/" className="text-caption-01 cl-text-3 link">
              Home
            </Link>
            <i className="icon icon-CaretRightThin cl-text-3" />
            <p className="text-caption-01">{breadcrumbLabel}</p>
          </div>

          <div
            className={`row align-items-end gy-16${
              hideDetailsOnMobile ? " d-none d-md-flex" : ""
            }`}
          >
            <div className="col-md-4 col-xl-3">
              <h3
                className="mb-0 text-start"
                style={{ fontSize: "clamp(2rem, 3vw, 2.75rem)", lineHeight: 1.05 }}
              >
                {title}
              </h3>
            </div>
            <div className="col-md-8 col-xl-9">
              <p
                className="cl-text-2 mb-0 text-start text-md-end"
                style={{
                  maxWidth: "760px",
                  marginLeft: "auto",
                  fontSize: "clamp(0.92rem, 1.2vw, 1.05rem)",
                  lineHeight: 1.55,
                }}
              >
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
