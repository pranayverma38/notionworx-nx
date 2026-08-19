"use client";

import { useEffect, useMemo, useState } from "react";
import { products } from "@/data/products/products";
import ProductCard from "@/components/ui/ProductCard";
import TfSwiper from "@/components/ui/TfSwiper";

export default function Search({
  registerModalElement,
}: {
  registerModalElement?: (el: HTMLElement | null) => void;
}) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query.trim().toLowerCase());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [query]);

  const featuredKeywords = [
    "Dresses",
    "Dresses women",
    "Dresses midi",
    "Dress summer",
  ];

  const filteredProducts = useMemo(() => {
    if (!debouncedQuery) return products.slice(0, 8);
    return products
      .filter((product) => {
        const name = product.name?.toLowerCase() ?? "";
        const category = product.category?.toLowerCase() ?? "";
        return (
          name.includes(debouncedQuery) || category.includes(debouncedQuery)
        );
      })
      .slice(0, 8);
  }, [debouncedQuery]);

  return (
    <div
      ref={registerModalElement}
      className="modal modalCentered fade modal-search"
      id="search"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="d-flex align-items-center justify-content-between gap-10">
            <h3>Search</h3>
            <span
              className="icon-close-popup flex-shrink-0"
              data-bs-dismiss="modal"
            >
              <i className="icon-X2" />
            </span>
          </div>
          <form
            className="form-search-nav style-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <fieldset>
              <input
                type="text"
                placeholder="Searching..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
              />
            </fieldset>
            <button type="submit" className="btn-action">
              <i className="icon icon-MagnifyingGlass" />
            </button>
          </form>
          <div className="search-feature">
            <p className="h5 mb-16">Feature Keywords Today</p>
            <div className="tf-list-tag">
              {featuredKeywords.map((keyword) => (
                <button
                  key={keyword}
                  type="button"
                  className="link-tag border-0 bg-transparent"
                  onClick={() => setQuery(keyword)}
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
          <div className="recently-view">
            <p className="h5 mb-16">
              {debouncedQuery ? "Search Results" : "Recently Viewed Products"}
            </p>
            {filteredProducts.length > 0 ? (
              <TfSwiper
                className="mb-24"
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
                {filteredProducts.map((product, index) => (
                  <ProductCard key={`${product.id}-${index}`} product={product} />
                ))}
              </TfSwiper>
            ) : (
              <p className="cl-text-2 mb-24">No products found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
