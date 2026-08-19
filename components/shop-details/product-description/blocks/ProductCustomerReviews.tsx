"use client";

import { useState } from "react";
import {
  ProductRatingBreakdown,
  ProductRatingSummary,
} from "./ProductRatingBreakdown";
import { ProductReviewRatingActions } from "./ProductReviewRatingActions";
import {
  ProductReviewComments,
  type ReviewAuthorNameElement,
} from "./ProductReviewComments";
import {
  ProductReviewForm,
  type ProductReviewFormFieldIds,
} from "./ProductReviewForm";

type Props = {
  sectionClassName: string;
  ratingBoxClassName?: string;
  actions: React.ComponentProps<typeof ProductReviewRatingActions>;
  authorNameElement: ReviewAuthorNameElement;
  sortSelectDefaultValue?: string;
  commentsRootClassName?: string;
  form: {
    idPrefix?: string;
    fieldIds?: ProductReviewFormFieldIds;
    formGridClassName: string;
    onSubmit?: React.FormEventHandler<HTMLFormElement>;
    writeBoxClassName?: string;
  };
};

export function ProductCustomerReviews({
  sectionClassName,
  ratingBoxClassName = "",
  actions,
  authorNameElement,
  sortSelectDefaultValue,
  commentsRootClassName,
  form,
}: Props) {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const sectionClasses = [
    sectionClassName,
    isReviewFormOpen ? "write-review" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={sectionClasses}>
      <div
        className={["box-rating", ratingBoxClassName].filter(Boolean).join(" ")}
      >
        <ProductRatingSummary />
        <ProductRatingBreakdown />
        <ProductReviewRatingActions
          {...actions}
          isReviewFormOpen={isReviewFormOpen}
          onWriteReview={() => setIsReviewFormOpen(true)}
          onCancelReview={() => setIsReviewFormOpen(false)}
        />
      </div>
      <ProductReviewComments
        authorNameElement={authorNameElement}
        sortSelectDefaultValue={sortSelectDefaultValue}
        rootClassName={commentsRootClassName}
      />
      <ProductReviewForm {...form} />
    </div>
  );
}
