import Link from "next/link";

export default function PageTileSingle({
  title,
  prevId,
  nextId,
}: {
  title: string;
  prevId?: string;
  nextId?: string;
}) {
  return (
    <>
      <div className="section-page-title-single flat-spacing-3">
        <div className="container">
          <div className="main-page-title">
            <div className="breadcrumbs">
              <Link href={`/`} className="text-caption-01 cl-text-3 link">
                Home
              </Link>
              <i className="icon icon-CaretRightThin cl-text-3" />
              <Link href={`/blog`} className="text-caption-01 cl-text-3 link">
                Blog
              </Link>
              <i className="icon icon-CaretRightThin cl-text-3" />
              <p className="text-caption-01 text-line-clamp-2 mb-0">{title}</p>
            </div>
            <div className="nav-post-list">
              {prevId ? (
                <Link
                  href={`/blog-single/${prevId}`}
                  className="link nav-post-item nav-post-prev"
                  aria-label="Previous post"
                >
                  <i className="icon icon-CaretLeft" />
                </Link>
              ) : (
                <span className="nav-post-item nav-post-prev opacity-25">
                  <i className="icon icon-CaretLeft" />
                </span>
              )}
              <Link href={`/blog`} className="link nav-all-post nav-post-link">
                <i className="icon icon-SquaresFour" />
              </Link>
              {nextId ? (
                <Link
                  href={`/blog-single/${nextId}`}
                  className="link nav-post-item nav-post-next"
                  aria-label="Next post"
                >
                  <i className="icon icon-CaretRightThin" />
                </Link>
              ) : (
                <span className="nav-post-item nav-post-next opacity-25">
                  <i className="icon icon-CaretRightThin" />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
