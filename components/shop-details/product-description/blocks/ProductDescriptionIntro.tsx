import type { ProductCardItem } from "@/types/productCard";

type IntroProps = {
  gridClassName?: string;
  /** `h5` for tab / accordion-v2 layouts; `div` with `.h6` for sidebar accordion. */
  titleTag?: "h5" | "div";
  product?: ProductCardItem;
};

export function ProductDescriptionIntro({
  gridClassName = "tab-content_desc tf-grid-layout md-col-2",
  titleTag = "h5",
  product,
}: IntroProps) {
  const descriptionText =
    product?.description ?? "Review the migrated catalog details for this product.";
  const lines = descriptionText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const introParagraphs = lines.slice(0, 2);
  const detailLines = lines.slice(2, 7);

  const primaryTitle =
    titleTag === "h5" ? (
      <h5 className="desc_title">{product?.name ?? "Product Overview"}</h5>
    ) : (
      <div className="h6 desc_title">{product?.name ?? "Product Overview"}</div>
    );

  const secondaryTitle =
    titleTag === "h5" ? (
      <h5 className="desc_title">Key Details</h5>
    ) : (
      <div className="h6 desc_title">Key Details</div>
    );

  return (
    <div className={gridClassName}>
      <div className="box-desc">
        {primaryTitle}
        <div className="desc_info">
          {(introParagraphs.length ? introParagraphs : [descriptionText]).map(
            (paragraph) => (
              <p key={paragraph} className="cl-text-2">
                {paragraph}
              </p>
            ),
          )}
        </div>
      </div>
      <div className="box-desc">
        {secondaryTitle}
        <ul className="list">
          {(detailLines.length
            ? detailLines
            : [
                product?.category ? `Category: ${product.category}` : null,
                product?.sku ? `SKU: ${product.sku}` : null,
                product?.inStock === false ? "Status: Out of stock" : "Status: Available",
              ].filter(Boolean)
          ).map((line) => (
            <li key={line} className="cl-text-2">
              - {line}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
