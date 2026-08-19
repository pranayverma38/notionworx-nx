/** Grid column preset class suffixes (`tf-grid-layout tf-col-*`). */
export type GridCols = "tf-col-2" | "tf-col-3" | "tf-col-4";

/** Keep column choice within what the viewport can show (theme breakpoints 768 / 992). */
export function clampGridColsForWidth(
  width: number,
  current: GridCols,
): GridCols {
  if (width < 768) {
    if (current === "tf-col-3" || current === "tf-col-4") return "tf-col-2";
    return current;
  }
  if (width < 992) {
    if (current === "tf-col-4") return "tf-col-3";
    return current;
  }
  return current;
}
