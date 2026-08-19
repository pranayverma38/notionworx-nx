"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { ProductSingleImage } from "@/types/productCard";

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

  // Static Data
  extraImages: ProductSingleImage[];
  sizes: SizeOption[];
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
  colors: ColorOption[];
  thumbnailPosition?: "bottom" | "left" | "right";
  zoomType?: "default" | "inner" | "magnifying" | "none";
}

export const ProductProvider: React.FC<ProductProviderProps> = ({
  children,
  initialColor = "green",
  initialSize = "",
  initialQuantity = 1,
  extraImages,
  sizes,
  colors,
  thumbnailPosition = "left",
  zoomType = "default",
}) => {
  const [pane, setPane] = useState<HTMLElement | null>(null);
  const [isZooming, setIsZooming] = useState(false);
  const [currentColor, setCurrentColor] = useState(initialColor);
  const [currentSize, setCurrentSize] = useState(
    initialSize || (sizes.length > 0 ? sizes[0].value : ""),
  );
  const [quantity, setQuantity] = useState(initialQuantity);

  const registerPane = useCallback((el: HTMLElement | null) => {
    setPane(el);
  }, []);

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
        extraImages,
        sizes,
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
