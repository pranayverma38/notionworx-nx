type Props =
  | {
      variant: "buttons";
      isReviewFormOpen?: boolean;
      onWriteReview?: () => void;
      onCancelReview?: () => void;
    }
  | {
      variant: "link";
      href?: string;
      isReviewFormOpen?: boolean;
      onWriteReview?: () => void;
      /** Ignored for `link` (parent may pass when sharing props with `buttons`). */
      onCancelReview?: () => void;
    };

export function ProductReviewRatingActions(props: Props) {
  if (props.variant === "link") {
    return (
      <a
        href={props.href ?? "#"}
        className="action tf-btn animate-btn"
        onClick={(e) => {
          e.preventDefault();
          props.onWriteReview?.();
        }}
      >
        Write a review
      </a>
    );
  }

  return (
    <div>
      <button
        type="button"
        className="action btn-comment-review btn-cancel-review tf-btn animate-btn"
        onClick={props.onCancelReview}
      >
        Cancel Review
      </button>
      <button
        type="button"
        className="action btn-comment-review btn-write-review tf-btn animate-btn"
        onClick={props.onWriteReview}
      >
        Write a review
      </button>
    </div>
  );
}
