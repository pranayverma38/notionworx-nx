import Image from "next/image";

export type ReviewAuthorNameElement = "p" | "h6" | "div";

function ReviewAuthorName({
  as,
  children,
}: {
  as: ReviewAuthorNameElement;
  children: React.ReactNode;
}) {
  if (as === "p") {
    return <p className="h6 author__name">{children}</p>;
  }
  if (as === "h6") {
    return <h6 className="author__name">{children}</h6>;
  }
  return <div className="h6 author__name">{children}</div>;
}

type Props = {
  authorNameElement: ReviewAuthorNameElement;
  /** `defaultValue` for tab layout; omit for controlled default in accordion-v2 */
  sortSelectDefaultValue?: string;
  /** Sidebar accordion uses `box-comment` only (no cancel-review-wrap). */
  rootClassName?: string;
};

export function ProductReviewComments({
  authorNameElement,
  sortSelectDefaultValue = "1",
  rootClassName = "box-comment cancel-review-wrap",
}: Props) {
  return (
    <div className={rootClassName}>
      <div className="head">
        <h4>03 Comments</h4>
        <div className="sort-by">
          <span className="text-caption-01">Sort by:</span>{" "}
          <div className="select-wrap select-sort-comment">
            <select className="select-2" defaultValue={sortSelectDefaultValue}>
              <option value="1">Most Recent</option>
              <option value="2">Last Week</option>
              <option value="3">Today</option>
            </select>
            <i className="icon icon-CaretDown" />
          </div>
        </div>
      </div>
      <div className="wg-comment">
        <div className="comment-list">
          <div className="box-comment">
            <div className="comment_info">
              <div className="info_image">
                <Image
                  loading="lazy"
                  width={60}
                  height={60}
                  src="/assets/images/avatar/avatar-2.jpg"
                  alt=""
                />
              </div>
              <div className="info_author">
                <ReviewAuthorName as={authorNameElement}>
                  Great print quality and sturdy event setup
                </ReviewAuthorName>
                <p className="author_date text-caption-01 cl-text-3">
                  1 days ago
                </p>
              </div>
            </div>
            <p className="comment_text text-body-1">
              The graphics came out crisp, the hardware felt durable, and the
              setup was straightforward for our event team.
            </p>
            <div className="comment_reply">
              <div className="comment_info">
                <div className="info_image">
                  <Image
                    loading="lazy"
                    width={60}
                    height={60}
                    src="/assets/images/avatar/avatar-1.jpg"
                    alt=""
                  />
                </div>
                <div className="info_author">
                  <ReviewAuthorName as={authorNameElement}>
                    Reply from Notion Worx
                  </ReviewAuthorName>
                  <p className="author_date text-caption-01 cl-text-3">
                    1 days ago
                  </p>
                </div>
              </div>
              <p className="comment_text text-body-1">
                Thanks for the feedback. We are glad the order arrived in good
                shape and worked well for your event setup.
              </p>
            </div>
          </div>
          <div className="box-comment">
            <div className="comment_info">
              <div className="info_image">
                <Image
                  loading="lazy"
                  width={60}
                  height={60}
                  src="/assets/images/avatar/avatar-3.jpg"
                  alt=""
                />
              </div>
              <div className="info_author">
                <ReviewAuthorName as={authorNameElement}>
                  Reliable ordering experience for branded displays
                </ReviewAuthorName>
                <p className="author_date text-caption-01 cl-text-3">
                  1 days ago
                </p>
              </div>
            </div>
            <p className="comment_text text-body-1">
              Great experience overall. The product matched the listing, shipped
              on time, and looked event-ready out of the box.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
