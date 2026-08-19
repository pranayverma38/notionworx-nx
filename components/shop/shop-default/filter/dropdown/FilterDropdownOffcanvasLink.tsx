/** Bootstrap offcanvas trigger paired with the dropdown filter bar (theme markup). */
export function FilterDropdownOffcanvasLink() {
  return (
    <a
      href="#filterShop"
      className="tf-btn-filter border-0 px-0 min-w-unset bg-transparent text-reset text-decoration-none"
      data-bs-toggle="offcanvas"
    >
      <span className="icon icon-filter" />
      <span className="text">Show Filters</span>
    </a>
  );
}
