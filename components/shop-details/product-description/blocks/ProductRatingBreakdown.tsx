const STAR_ROWS = [
  { stars: 5, width: "60%", percent: "60%" },
  { stars: 4, width: "20%", percent: "20%" },
  { stars: 3, width: "10%", percent: "10%" },
  { stars: 2, width: "7%", percent: "7%" },
  { stars: 1, width: "3%", percent: "3%" },
] as const;

export function ProductRatingBreakdown() {
  return (
    <div className="rating-progress-list">
      {STAR_ROWS.map(({ stars, width, percent }) => (
        <div key={stars} className="rate-progress-star fw-medium">
          <span className="number-star">{stars}</span>
          <i className="icon icon-Star fs-20 cl-text-yellow" />
          <div
            className="progress"
            role="progressbar"
            aria-label="Rating distribution"
            aria-valuenow={0}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="progress-bar" style={{ width }} />
          </div>
          <span className="number-percent">{percent}</span>
        </div>
      ))}
    </div>
  );
}

export function ProductRatingSummary() {
  return (
    <div className="rating-ratio">
      <p className="text-display fw-medium">4.8</p>
      <div className="star-wrap normal d-flex align-items-center">
        <i className="icon icon-Star fs-24" />
        <i className="icon icon-Star fs-24" />
        <i className="icon icon-Star fs-24" />
        <i className="icon icon-Star fs-24" />
        <i className="icon icon-Star fs-24" />
      </div>
      <p className="rate-number">(1,968 Ratings)</p>
    </div>
  );
}
