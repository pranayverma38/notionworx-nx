"use client";

import { useState } from "react";

export type ProductReviewFormFieldIds = {
  review: string;
  email: string;
  name: string;
  message: string;
  save: string;
};

type Props = {
  /** Built-in ids: `${idPrefix}review`, etc. Ignored if `fieldIds` is set. */
  idPrefix?: string;
  fieldIds?: ProductReviewFormFieldIds;
  formGridClassName: string;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  /** Sidebar accordion omits `write-review-wrap`. */
  writeBoxClassName?: string;
};

export function ProductReviewForm({
  idPrefix = "",
  fieldIds: fieldIdsProp,
  formGridClassName,
  onSubmit,
  writeBoxClassName = "box-write-comment write-review-wrap",
}: Props) {
  const [selectedRating, setSelectedRating] = useState(0);
  const fieldIds: ProductReviewFormFieldIds = fieldIdsProp ?? {
    review: `${idPrefix}review`,
    email: `${idPrefix}email`,
    name: `${idPrefix}name`,
    message: `${idPrefix}message`,
    save: `${idPrefix}save`,
  };
  const {
    review: reviewId,
    email: emailId,
    name: nameId,
    message: messageId,
    save: saveId,
  } = fieldIds;

  return (
    <div className={writeBoxClassName}>
      <div className="head">
        <h5>Write a review:</h5>
        <div className="star-wrap rate-click d-flex align-items-center">
          {Array.from({ length: 5 }).map((_, index) => {
            const ratingValue = index + 1;
            const isActive = ratingValue <= selectedRating;
            return (
              <button
                key={ratingValue}
                type="button"
                className="border-0 bg-transparent p-0 d-inline-flex"
                aria-label={`Rate ${ratingValue} star${ratingValue > 1 ? "s" : ""}`}
                onClick={() => setSelectedRating(ratingValue)}
              >
                <i className={`icon icon-Star${isActive ? " active" : ""}`} />
              </button>
            );
          })}
        </div>
      </div>
      <form
        className="form-rating"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.(e);
        }}
      >
        <div className="form-content mb-24">
          <div className={formGridClassName}>
            <div className="tf-grid-layout">
              <fieldset className="tf-field">
                <label htmlFor={reviewId} className="tf-lable fw-medium">
                  Review Title
                </label>
                <input
                  type="text"
                  id={reviewId}
                  placeholder="Give your review a title"
                  required
                />
              </fieldset>
              <fieldset className="tf-field">
                <label htmlFor={emailId} className="tf-lable fw-medium">
                  Your Email <span className="text-primary">*</span>
                </label>
                <input
                  type="email"
                  id={emailId}
                  placeholder="Your email (private)"
                  required
                />
              </fieldset>
              <fieldset className="tf-field">
                <label htmlFor={nameId} className="tf-lable fw-medium">
                  Your Name <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  id={nameId}
                  placeholder="You Name (Public)"
                  required
                />
              </fieldset>
            </div>
            <fieldset className="tf-field d-flex flex-column">
              <label htmlFor={messageId} className="tf-lable fw-medium">
                Review
              </label>
              <textarea
                name="message"
                id={messageId}
                placeholder="Write your comment here"
                className="h-md-100"
                defaultValue=""
              />
            </fieldset>
          </div>
          <div className="checkbox-wrap">
            <input className="tf-check" type="checkbox" id={saveId} />
            <label htmlFor={saveId} className="cl-text-2">
              Save my name, email, and website in this browser for the next time
              I comment.
            </label>
          </div>
        </div>
        <button type="submit" className="tf-btn animate-btn">
          Submit Review
        </button>
      </form>
    </div>
  );
}
