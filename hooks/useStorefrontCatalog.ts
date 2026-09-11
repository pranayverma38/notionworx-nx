"use client";

import { useEffect, useState } from "react";

import type { ProductCardItem } from "@/types/productCard";

type StorefrontCatalogResponse = {
  products?: ProductCardItem[];
};

let catalogCache: ProductCardItem[] | null = null;
let catalogRequest: Promise<ProductCardItem[]> | null = null;

async function fetchStorefrontCatalog(): Promise<ProductCardItem[]> {
  if (catalogCache) {
    return catalogCache;
  }

  if (!catalogRequest) {
    catalogRequest = fetch("/api/storefront/products")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Catalog request failed with ${response.status}`);
        }

        const payload = (await response.json()) as StorefrontCatalogResponse;
        const nextProducts = Array.isArray(payload.products)
          ? payload.products
          : [];
        catalogCache = nextProducts;
        return nextProducts;
      })
      .finally(() => {
        catalogRequest = null;
      });
  }

  return catalogRequest;
}

export function useStorefrontCatalog() {
  const [products, setProducts] = useState<ProductCardItem[]>(
    () => catalogCache ?? [],
  );
  const [isLoading, setIsLoading] = useState<boolean>(() => catalogCache == null);

  useEffect(() => {
    let isMounted = true;

    if (catalogCache) {
      setProducts(catalogCache);
      setIsLoading(false);
      return () => {
        isMounted = false;
      };
    }

    setIsLoading(true);
    fetchStorefrontCatalog()
      .then((nextProducts) => {
        if (!isMounted) {
          return;
        }

        setProducts(nextProducts);
        setIsLoading(false);
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setProducts([]);
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    products,
    isLoading,
  };
}
