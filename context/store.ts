"use client";

import { create } from "zustand";
import { persist, type StorageValue } from "zustand/middleware";

import { products } from "@/data/products/products";
import {
  buildProductConfigurationKey,
  filterValidProductAddOnSelections,
  getConfiguredProductUnitPrice,
  getProductConfigurationIdentity,
} from "@/lib/product-addons";
import { resolveConfiguredBasePrice } from "@/lib/product-variants";
import {
  fetchCartFromServer,
  removeCartItem,
  syncLocalCartToServer,
  updateCartItemQuantity,
  upsertCartItem,
} from "@/lib/supabase/cart";
import type { ProductCardItem } from "@/types/productCard";
import type { ProductAddOnSelection } from "@/types/productAddons";

// userId stored separately so cart helpers never need to call getUser()
let _currentUserId: string | null = null;
export function setCurrentUserId(id: string | null) {
  _currentUserId = id;
}

export type Product = ProductCardItem;
export interface CartProductSelectionInput {
  selectedColor?: string;
  selectedSize?: string;
  addOnSelections?: ProductAddOnSelection[];
}

export type CartProduct = Product & {
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  addOnSelections?: ProductAddOnSelection[];
  configurationKey: string;
  basePrice: number;
};
export type ProductId = number | string;

interface StoreState {
  cartProducts: CartProduct[];
  compareItem: Product[];
  quickViewItem: Product;
  quickAddItem: ProductId;
  totalPrice: number;
  cartOwnerId: string | null;
  activeCartProduct: CartProduct | null;
  isLoggedIn: boolean;
  setCartProducts: (
    value: CartProduct[] | ((prev: CartProduct[]) => CartProduct[]),
  ) => void;
  setQuickViewItem: (item: Product) => void;
  setQuickAddItem: (id: ProductId) => void;
  setCompareItem: (value: Product[] | ((prev: Product[]) => Product[])) => void;
  setActiveCartProduct: (item: CartProduct | null) => void;
  isAddedToCartProducts: (id: ProductId) => boolean;
  addProductToCart: (
    item: Product,
    qty?: number,
    selection?: CartProductSelectionInput,
  ) => void;
  updateQuantity: (id: ProductId, qty: number) => void;
  quantityInCart: (id: ProductId) => number;
  addToCompareItem: (item: Product) => void;
  removeFromCompareItem: (id: ProductId) => void;
  isAddedToCompareItem: (id: ProductId) => boolean;
  removeFromCart: (id: ProductId) => void;
  /** Call on login: merges guest carts and reconciles same-user persisted carts. */
  loadServerCart: (userId: string) => Promise<void>;
  /** Call on logout: clears local cart */
  clearLocalCart: () => void;
  setIsLoggedIn: (v: boolean) => void;
}

const getTotalPrice = (cart: CartProduct[]) =>
  cart.reduce((acc, product) => acc + product.quantity * product.price, 0);

function resolvePersistedCartOwner(
  isLoggedIn: boolean,
  cartOwnerId: string | null,
) {
  if (isLoggedIn && _currentUserId) {
    return _currentUserId;
  }

  return cartOwnerId;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cartProducts: [],
      compareItem: [],
      quickViewItem: products[0],
      quickAddItem: 1,
      totalPrice: 0,
      cartOwnerId: null,
      activeCartProduct: null,
      isLoggedIn: false,

      setIsLoggedIn: (v) => set({ isLoggedIn: v }),

      setCartProducts: (value) =>
        set((state) => {
          const next =
            typeof value === "function" ? value(state.cartProducts) : value;
          const normalizedNext = normalizeCartProducts(next);
          return {
            cartProducts: normalizedNext,
            totalPrice: getTotalPrice(normalizedNext),
          };
        }),

      setQuickViewItem: (item) => set({ quickViewItem: item }),
      setQuickAddItem: (id) => set({ quickAddItem: id }),
      setCompareItem: (value) =>
        set((state) => ({
          compareItem:
            typeof value === "function" ? value(state.compareItem) : value,
        })),
      setActiveCartProduct: (item) => set({ activeCartProduct: item }),

      isAddedToCartProducts: (id) =>
        get().cartProducts.some(
          (item) => item.id === id || item.configurationKey === String(id),
        ),

      addProductToCart: (item, qty = 1, selection) => {
        const { cartProducts, cartOwnerId, isLoggedIn } = get();
        const cartItem = normalizeCartProduct(item, qty, selection);

        if (
          cartProducts.some(
            (existingItem) =>
              existingItem.configurationKey === cartItem.configurationKey,
          )
        ) {
          return;
        }

        const next = [...cartProducts, cartItem];
        set({
          cartProducts: next,
          cartOwnerId: resolvePersistedCartOwner(isLoggedIn, cartOwnerId),
          totalPrice: getTotalPrice(next),
        });
        if (isLoggedIn && _currentUserId) {
          upsertCartItem(_currentUserId, cartItem).catch(console.error);
        }
      },

      updateQuantity: (id, qty) => {
        const { cartProducts, cartOwnerId, isLoggedIn } = get();
        const cartItem = resolveCartProduct(cartProducts, id);
        if (!cartItem || qty < 1) return;

        const items = cartProducts.map((item) =>
          item.configurationKey === cartItem.configurationKey
            ? normalizeCartProduct(item, qty)
            : item,
        );
        set({
          cartProducts: items,
          cartOwnerId: resolvePersistedCartOwner(isLoggedIn, cartOwnerId),
          totalPrice: getTotalPrice(items),
        });
        if (isLoggedIn && _currentUserId) {
          updateCartItemQuantity(
            _currentUserId,
            cartItem.configurationKey,
            qty,
          ).catch(console.error);
        }
      },

      quantityInCart: (id) => {
        const exactMatch = get().cartProducts.find(
          (item) => item.configurationKey === String(id),
        );
        if (exactMatch) {
          return exactMatch.quantity;
        }

        return get()
          .cartProducts.filter((item) => item.id === id)
          .reduce((sum, item) => sum + item.quantity, 0);
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

      removeFromCart: (id) => {
        const { cartProducts, cartOwnerId, isLoggedIn } = get();
        const cartItem = resolveCartProduct(cartProducts, id);
        if (!cartItem) return;

        const next = cartProducts.filter(
          (item) => item.configurationKey !== cartItem.configurationKey,
        );
        set({
          cartProducts: next,
          cartOwnerId: resolvePersistedCartOwner(isLoggedIn, cartOwnerId),
          totalPrice: getTotalPrice(next),
        });
        if (isLoggedIn && _currentUserId) {
          removeCartItem(_currentUserId, cartItem.configurationKey).catch(
            console.error,
          );
        }
      },

      loadServerCart: async (userId: string) => {
        const { cartProducts, cartOwnerId } = get();
        const hasSameUserCart = cartOwnerId === userId;
        const hasGuestCart = cartOwnerId === null && cartProducts.length > 0;

        // Treat the same user's persisted cart as authoritative so removals
        // are not resurrected by stale rows after a fast refresh.
        if (hasSameUserCart) {
          await syncLocalCartToServer(userId, cartProducts, {
            mode: "replace",
          }).catch(console.error);
        } else if (hasGuestCart) {
          await syncLocalCartToServer(userId, cartProducts, {
            mode: "merge",
          }).catch(console.error);
        }

        const serverCart = await fetchCartFromServer(userId).catch(
          () => [] as CartProduct[],
        );
        const normalizedServerCart = normalizeCartProducts(serverCart);
        set({
          cartProducts: normalizedServerCart,
          cartOwnerId: userId,
          totalPrice: getTotalPrice(normalizedServerCart),
        });
      },

      clearLocalCart: () => {
        set({
          cartProducts: [],
          cartOwnerId: null,
          totalPrice: 0,
          isLoggedIn: false,
        });
      },
    }),
    {
      name: "amerce-store",
      partialize: (state) => ({
        cartProducts: state.cartProducts,
        cartOwnerId: state.cartOwnerId,
        totalPrice: state.totalPrice,
      }),
      storage: {
        getItem: (
          name,
        ): StorageValue<{
          cartProducts: CartProduct[];
          cartOwnerId: string | null;
          totalPrice: number;
        }> | null => {
          if (typeof window === "undefined") return null;
          const str = window.localStorage.getItem(name);
          if (!str) return null;
          try {
            const parsed = JSON.parse(str) as StorageValue<{
              cartProducts: CartProduct[];
              cartOwnerId: string | null;
              totalPrice: number;
            }>;
            if (parsed?.state?.cartProducts) {
              parsed.state.cartProducts = normalizeCartProducts(
                parsed.state.cartProducts,
              );
              parsed.state.totalPrice = getTotalPrice(parsed.state.cartProducts);
            }
            if (parsed?.state && parsed.state.cartOwnerId === undefined) {
              parsed.state.cartOwnerId = null;
            }
            return parsed;
          } catch {
            return null;
          }
        },
        setItem: (
          name,
          value: StorageValue<{
            cartProducts: CartProduct[];
            cartOwnerId: string | null;
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
    isLoggedIn: state.isLoggedIn,
    setIsLoggedIn: state.setIsLoggedIn,
    loadServerCart: state.loadServerCart,
    clearLocalCart: state.clearLocalCart,
    removeFromCart: state.removeFromCart,
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

export function useContextElement() {
  return useStore(getStableContextSnapshot);
}

function normalizeCartProducts(items: CartProduct[]): CartProduct[] {
  return items.map((item) => normalizeCartProduct(item, item.quantity));
}

function normalizeCartProduct(
  item: Product | CartProduct,
  qty: number,
  selection?: CartProductSelectionInput,
): CartProduct {
  const cartItem = item as Partial<CartProduct>;
  const selectedColor = selection?.selectedColor ?? cartItem.selectedColor;
  const selectedSize = selection?.selectedSize ?? cartItem.selectedSize;
  const addOnSelections = filterValidProductAddOnSelections(
    item.addOnGroups,
    selection?.addOnSelections ?? cartItem.addOnSelections,
  );
  const basePrice =
    typeof cartItem.basePrice === "number"
      ? cartItem.basePrice
      : resolveConfiguredBasePrice(item.price, item.sizeVariants, selectedSize);
  const configurationKey =
    cartItem.configurationKey ||
    buildProductConfigurationKey({
      productId: getProductConfigurationIdentity(item),
      selectedColor,
      selectedSize,
      addOnSelections,
    });

  return {
    ...item,
    quantity: Math.max(1, Math.floor(qty)),
    price: getConfiguredProductUnitPrice(basePrice, item.addOnGroups, addOnSelections),
    basePrice,
    configurationKey,
    selectedColor: selectedColor || undefined,
    selectedSize: selectedSize || undefined,
    addOnSelections: addOnSelections.length ? addOnSelections : undefined,
  };
}

function resolveCartProduct(
  cartProducts: CartProduct[],
  id: ProductId,
): CartProduct | undefined {
  return (
    cartProducts.find((item) => item.configurationKey === String(id)) ||
    cartProducts.find((item) => item.id === id)
  );
}
