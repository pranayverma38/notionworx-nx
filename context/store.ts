"use client";

import { create } from "zustand";
import { persist, type StorageValue } from "zustand/middleware";

import { ProductCardItem } from "@/types/productCard";
import { products } from "@/data/products/products";

export type Product = ProductCardItem;
export type CartProduct = Product & {
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
};
export type ProductId = number | string;

interface StoreState {
  cartProducts: CartProduct[];
  compareItem: Product[];
  quickViewItem: Product;
  quickAddItem: ProductId;
  totalPrice: number;
  activeCartProduct: CartProduct | null;
  setCartProducts: (
    value: CartProduct[] | ((prev: CartProduct[]) => CartProduct[]),
  ) => void;
  setQuickViewItem: (item: Product) => void;
  setQuickAddItem: (id: ProductId) => void;
  setCompareItem: (value: Product[] | ((prev: Product[]) => Product[])) => void;
  setActiveCartProduct: (item: CartProduct | null) => void;
  isAddedToCartProducts: (id: ProductId) => boolean;
  addProductToCart: (item: Product, qty?: number) => void;
  updateQuantity: (id: ProductId, qty: number) => void;
  quantityInCart: (id: ProductId) => number;
  addToCompareItem: (item: Product) => void;
  removeFromCompareItem: (id: ProductId) => void;
  isAddedToCompareItem: (id: ProductId) => boolean;
}

const getTotalPrice = (cart: CartProduct[]) =>
  cart.reduce((acc, product) => acc + product.quantity * product.price, 0);

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cartProducts: [],
      compareItem: [],
      quickViewItem: products[0],
      quickAddItem: 1,
      totalPrice: 0,
      activeCartProduct: null,

      setCartProducts: (value) =>
        set((state) => {
          const next =
            typeof value === "function" ? value(state.cartProducts) : value;
          return { cartProducts: next, totalPrice: getTotalPrice(next) };
        }),

      setQuickViewItem: (item) => set({ quickViewItem: item }),
      setQuickAddItem: (id) => set({ quickAddItem: id }),
      setCompareItem: (value) =>
        set((state) => ({
          compareItem:
            typeof value === "function" ? value(state.compareItem) : value,
        })),
      setActiveCartProduct: (item) => set({ activeCartProduct: item }),

      isAddedToCartProducts: (id) => {
        const cart = get().cartProducts;
        return cart.some((elm) => elm.id === id);
      },

      addProductToCart: (item, qty = 1) => {
        const { cartProducts, isAddedToCartProducts } = get();
        if (isAddedToCartProducts(item.id)) return;
        const cartItem: CartProduct = {
          ...item,
          quantity: qty,
        };
        const next = [...cartProducts, cartItem];
        set({ cartProducts: next, totalPrice: getTotalPrice(next) });
      },

      updateQuantity: (id, qty) => {
        const { cartProducts, isAddedToCartProducts } = get();
        if (!isAddedToCartProducts(id) || qty < 1) return;
        const items = cartProducts.map((item) =>
          item.id === id ? { ...item, quantity: qty } : item,
        );
        set({ cartProducts: items, totalPrice: getTotalPrice(items) });
      },

      quantityInCart: (id) => {
        const item = get().cartProducts.find((elm) => elm.id === id);
        return item ? item.quantity : 0;
      },

      addToCompareItem: (item) => {
        const { compareItem } = get();
        if (compareItem.some((elm) => elm.id === item.id)) return;
        set({ compareItem: [...compareItem, item] });
      },

      removeFromCompareItem: (id) => {
        set((state) => ({
          compareItem: state.compareItem.filter((elm) => elm.id !== id),
        }));
      },

      isAddedToCompareItem: (id) =>
        get().compareItem.some((elm) => elm.id === id),
    }),
    {
      name: "amerce-store",
      partialize: (state) => ({
        cartProducts: state.cartProducts,
        totalPrice: state.totalPrice,
      }),
      storage: {
        getItem: (
          name,
        ): StorageValue<{
          cartProducts: CartProduct[];
          totalPrice: number;
        }> | null => {
          if (typeof window === "undefined") return null;
          const str = window.localStorage.getItem(name);
          if (str) {
            try {
              const parsed = JSON.parse(str) as StorageValue<{
                cartProducts: CartProduct[];
                totalPrice: number;
              }>;
              if (
                parsed?.state?.cartProducts &&
                parsed.state.totalPrice == null
              ) {
                parsed.state.totalPrice = getTotalPrice(
                  parsed.state.cartProducts,
                );
              }
              return parsed;
            } catch {
              return null;
            }
          }
          return null;
        },
        setItem: (
          name,
          value: StorageValue<{
            cartProducts: CartProduct[];
            totalPrice: number;
          }>,
        ) => {
          if (typeof window !== "undefined") {
            window.localStorage.setItem(name, JSON.stringify(value));
          }
        },
        removeItem: (name) => {
          if (typeof window !== "undefined") {
            window.localStorage.removeItem(name);
          }
        },
      },
    },
  ),
);

function getContextSnapshot(state: StoreState) {
  return {
    cartProducts: state.cartProducts,
    setCartProducts: state.setCartProducts,
    totalPrice: state.totalPrice,
    addProductToCart: state.addProductToCart,
    isAddedToCartProducts: state.isAddedToCartProducts,
    quickViewItem: state.quickViewItem,
    setQuickViewItem: state.setQuickViewItem,
    quickAddItem: state.quickAddItem,
    setQuickAddItem: state.setQuickAddItem,
    addToCompareItem: state.addToCompareItem,
    isAddedToCompareItem: state.isAddedToCompareItem,
    removeFromCompareItem: state.removeFromCompareItem,
    compareItem: state.compareItem,
    setCompareItem: state.setCompareItem,
    updateQuantity: state.updateQuantity,
    quantityInCart: state.quantityInCart,
    activeCartProduct: state.activeCartProduct,
    setActiveCartProduct: state.setActiveCartProduct,
  };
}

type ContextSnapshot = ReturnType<typeof getContextSnapshot>;

let cachedState: StoreState | null = null;
let cachedSnapshot: ContextSnapshot | null = null;

function getStableContextSnapshot(state: StoreState): ContextSnapshot {
  if (state === cachedState && cachedSnapshot !== null) {
    return cachedSnapshot;
  }
  cachedState = state;
  cachedSnapshot = getContextSnapshot(state);
  return cachedSnapshot;
}

/** Same API as the old useContextElement() for drop-in replacement in existing components. */
export function useContextElement() {
  return useStore(getStableContextSnapshot);
}
