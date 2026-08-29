"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import {
  getConfiguredProductUnitPrice,
  getProductAddOnSelectionSubtotal,
  normalizeProductAddOnSelections,
} from "@/lib/product-addons";
import type { ProductSingleImage } from "@/types/productCard";
import type { ProductAddOnGroup, ProductAddOnSelection } from "@/types/productAddons";

export interface ColorOption {
  label: string;
  swatchClass: string;
  img: string;
}

export interface SizeOption {
  value: string;
  price?: string;
  active?: boolean;
}

interface ProductContextType {
  // Zoom
  pane: HTMLElement | null;
  registerPane: (el: HTMLElement | null) => void;
  isZooming: boolean;
  setIsZooming: (zooming: boolean) => void;

  // Variants
  currentColor: string;
  setCurrentColor: (color: string) => void;
  currentSize: string;
  setCurrentSize: (size: string) => void;
  quantity: number;
  setQuantity: (q: number) => void;

  // Attached add-ons
  addOnGroups: ProductAddOnGroup[];
  addOnSelections: ProductAddOnSelection[];
  setAddOnSelections: Dispatch<SetStateAction<ProductAddOnSelection[]>>;
  addOnSelectionSubtotal: number;
  basePrice?: number;
  configuredUnitPrice?: number;

  // Static Data
  extraImages: ProductSingleImage[];
  sizes: SizeOption[];
  variantLabel: string;
  colors: ColorOption[];
  thumbnailPosition: "bottom" | "left" | "right";
  zoomType: "default" | "inner" | "magnifying" | "none";
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export interface ProductProviderProps {
  children: React.ReactNode;
  initialColor?: string;
  initialSize?: string;
  initialQuantity?: number;
  extraImages: ProductSingleImage[];
  sizes: SizeOption[];
  variantLabel?: string;
  colors: ColorOption[];
  thumbnailPosition?: "bottom" | "left" | "right";
  zoomType?: "default" | "inner" | "magnifying" | "none";
  basePrice?: number;
  addOnGroups?: ProductAddOnGroup[];
}

export const ProductProvider: React.FC<ProductProviderProps> = ({
  children,
  initialColor = "green",
  initialSize = "",
  initialQuantity = 1,
  extraImages,
  sizes,
  variantLabel = "Size",
  colors,
  thumbnailPosition = "left",
  zoomType = "default",
  basePrice,
  addOnGroups = [],
}) => {
  const [pane, setPane] = useState<HTMLElement | null>(null);
  const [isZooming, setIsZooming] = useState(false);
  const [currentColor, setCurrentColor] = useState(initialColor);
  const [currentSize, setCurrentSize] = useState(
    initialSize || (sizes.length > 0 ? sizes[0].value : ""),
  );
  const [quantity, setQuantity] = useState(initialQuantity);
  const [addOnSelections, setAddOnSelections] = useState<ProductAddOnSelection[]>(
    () => getInitialAddOnSelections(addOnGroups),
  );

  const registerPane = useCallback((el: HTMLElement | null) => {
    setPane(el);
  }, []);

  const addOnSelectionSubtotal = useMemo(
    () => getProductAddOnSelectionSubtotal(addOnGroups, addOnSelections),
    [addOnGroups, addOnSelections],
  );
  const configuredUnitPrice = useMemo(
    () =>
      typeof basePrice === "number"
        ? getConfiguredProductUnitPrice(basePrice, addOnGroups, addOnSelections)
        : undefined,
    [addOnGroups, addOnSelections, basePrice],
  );

  return (
    <ProductContext.Provider
      value={{
        pane,
        registerPane,
        isZooming,
        setIsZooming,
        currentColor,
        setCurrentColor,
        currentSize,
        setCurrentSize,
        quantity,
        setQuantity,
        addOnGroups,
        addOnSelections,
        setAddOnSelections,
        addOnSelectionSubtotal,
        basePrice,
        configuredUnitPrice,
        extraImages,
        sizes,
        variantLabel,
        colors,
        thumbnailPosition,
        zoomType,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
};

/** Safe when `StickyProduct` renders outside `ProductProvider` (falls back to local qty/size). */
export function useProductOptional() {
  return useContext(ProductContext);
}

function getInitialAddOnSelections(
  addOnGroups: ProductAddOnGroup[],
): ProductAddOnSelection[] {
  return normalizeProductAddOnSelections(
    addOnGroups.flatMap((group) => {
      const directSelections = (group.items ?? [])
        .filter((item) => item.defaultSelected)
        .map((item) => ({
          groupId: group.id,
          addOnId: item.id,
          quantity: item.minQuantity ?? 1,
        }));
      const subgroupSelections = (group.subgroups ?? []).flatMap((subgroup) =>
        subgroup.items
          .filter((item) => item.defaultSelected)
          .map((item) => ({
            groupId: group.id,
            subgroupId: subgroup.id,
            addOnId: item.id,
            quantity: item.minQuantity ?? 1,
          })),
      );

      return [...directSelections, ...subgroupSelections];
    }),
  );
}
