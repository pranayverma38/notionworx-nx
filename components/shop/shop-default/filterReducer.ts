import type { FilterAction, FilterState, ShopProduct } from "@/types/shopFilter";

export const staticInitialState: Omit<
  FilterState,
  "defaultPriceRange" | "filtered" | "sorted" | "price" | "itemPerPage"
> = {
  colors: [],
  sizes: [],
  tags: [],
  activeFilterOnSale: false,
  availability: "all",
  brands: [],
  categories: [],
  ratings: [],
  services: [],
  sortingOption: "Sort by (Default)",
  currentPage: 1,
};

function productInStock(product: ShopProduct): boolean {
  if (product.isStockOut === true) return false;
  if (product.inStock === false) return false;
  return true;
}

function productOutOfStock(product: ShopProduct): boolean {
  return product.isStockOut === true || product.inStock === false;
}

function matchesAllFilters(product: ShopProduct, state: FilterState): boolean {
  if (
    state.brands.length &&
    !state.brands.some((b) => product.filterBrands?.includes(b))
  ) {
    return false;
  }

  if (
    state.categories.length &&
    !state.categories.some((c) => product.filterCategory?.includes(c))
  ) {
    return false;
  }

  if (state.tags.length && !state.tags.some((t) => product.tags?.includes(t))) {
    return false;
  }

  if (
    state.colors.length &&
    !state.colors.some((color) => product.filterColor?.includes(color))
  ) {
    return false;
  }

  if (state.sizes.length) {
    const ps = product.filterSizes;
    if (!ps?.length || !state.sizes.some((s) => ps.includes(s))) {
      return false;
    }
  }

  const effectiveMin = state.price[0];
  const effectiveMax = state.price[1];
  if (product.price < effectiveMin || product.price > effectiveMax) {
    return false;
  }

  if (
    state.ratings.length &&
    !state.ratings.some((minRating) => (product.rating ?? 0) >= minRating)
  ) {
    return false;
  }

  if (
    state.services.length &&
    !state.services.some((s) => product.services?.includes(s))
  ) {
    return false;
  }

  if (
    state.activeFilterOnSale &&
    (product.priceOld == null || product.priceOld <= product.price)
  ) {
    return false;
  }

  if (state.availability === "inStock" && !productInStock(product)) {
    return false;
  }
  if (state.availability === "outStock" && !productOutOfStock(product)) {
    return false;
  }

  return true;
}

export function filterReducer(
  state: FilterState,
  action: FilterAction,
): FilterState {
  switch (action.type) {
    case "SET_PRICE":
      return { ...state, price: action.payload };

    case "SET_COLORS":
      return { ...state, colors: action.payload };
    case "SET_TAGS":
      return { ...state, tags: action.payload };
    case "SET_SIZES":
      return { ...state, sizes: action.payload };

    case "SET_BRANDS":
      return { ...state, brands: action.payload };

    case "SET_CATEGORIES":
      return { ...state, categories: action.payload };

    case "SET_RATINGS":
      return { ...state, ratings: action.payload };

    case "SET_SERVICES":
      return { ...state, services: action.payload };

    case "SET_AVAILABILITY":
      return { ...state, availability: action.payload };

    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };

    case "SET_ITEM_PER_PAGE":
      return { ...state, itemPerPage: action.payload, currentPage: 1 };

    case "FILTER_PRODUCTS": {
      const productsToFilter = [...action.payload];
      const filtered = productsToFilter.filter((product) =>
        matchesAllFilters(product, state),
      );
      return { ...state, filtered, currentPage: 1 };
    }

    case "SET_SORTING_OPTION":
      return { ...state, sortingOption: action.payload };

    case "SORT_PRODUCTS": {
      const sorted = [...state.filtered];
      switch (state.sortingOption) {
        case "Price Ascending":
          sorted.sort((a, b) => a.price - b.price);
          break;
        case "Price Descending":
          sorted.sort((a, b) => b.price - a.price);
          break;
        case "Title Ascending":
          sorted.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "Title Descending":
          sorted.sort((a, b) => b.name.localeCompare(a.name));
          break;
        default:
          break;
      }
      return { ...state, sorted, currentPage: 1 };
    }

    case "TOGGLE_FILTER_ON_SALE":
      return { ...state, activeFilterOnSale: !state.activeFilterOnSale };

    case "CLEAR_FILTER":
      return {
        ...state,
        price: [...state.defaultPriceRange] as [number, number],
        colors: [],
        sizes: [],
        tags: [],
        activeFilterOnSale: false,
        availability: "all",
        brands: [],
        categories: [],
        ratings: [],
        services: [],
        sortingOption: "Sort by (Default)",
        currentPage: 1,
      };

    default:
      return state;
  }
}
