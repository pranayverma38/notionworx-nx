import type { ProductCardItem } from "@/types/productCard";

export function ProductShortDescription({
  product,
}: {
  product?: ProductCardItem;
}) {
  return (
    <p className="product-infor-desc cl-text-2 mb-12">
      {product.description ?? "Review the details for this catalog item."}
    </p>
  );
}
