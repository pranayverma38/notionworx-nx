import { products } from "@/data/products/products";
import ProductCard from "@/components/ui/ProductCard";
import TfSwiper from "@/components/ui/TfSwiper";

function Recent({ query = "" }: { query?: string }) {
  const normalizedQuery = query.trim().toLowerCase();
  const filteredProducts = normalizedQuery
    ? products.filter((product) => {
        const name = product.name?.toLowerCase() ?? "";
        const category = product.category?.toLowerCase() ?? "";
        return (
          name.includes(normalizedQuery) || category.includes(normalizedQuery)
        );
      })
    : products;
  const displayProducts = filteredProducts.slice(0, 8);

  return (
    <section className="flat-spacing pt-0">
      <div className="container">
        <div className="sect-heading type-2 text-center">
          <h4 className="s-title">
            {normalizedQuery ? "Search Results" : "Product Recent"}
          </h4>
        </div>
        {displayProducts.length > 0 ? (
          <TfSwiper
            preview={4}
            tablet={3}
            mobileSm={2}
            mobile={2}
            spaceLg={30}
            spaceMd={20}
            space={10}
            paginationLg={4}
            paginationMd={3}
            paginationSm={2}
            pagination={2}
            paginationClassName="sw-dot-default tf-sw-pagination"
          >
            {displayProducts.map((product, index) => (
              <ProductCard key={`${product.id}-${index}`} product={product} />
            ))}
          </TfSwiper>
        ) : (
          <p className="text-center cl-text-2">No products found.</p>
        )}
      </div>
    </section>
  );
}

export default Recent;
