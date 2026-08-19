import { storefrontProducts } from "@/data/inventory/notionworx/storefront.generated";
import type { ProductCardItem } from "@/types/productCard";
import type { ShopProduct } from "@/types/shopFilter";

const storefrontCatalog = storefrontProducts as unknown as ProductCardItem[];

function cloneProduct(product: ProductCardItem): ProductCardItem {
  return {
    ...product,
    images: product.images?.map((image) => ({ ...image })),
    colors: product.colors?.map((color) => ({ ...color })),
    sizes: product.sizes ? [...product.sizes] : undefined,
    filterBrands: product.filterBrands ? [...product.filterBrands] : undefined,
    filterCategory: product.filterCategory ? [...product.filterCategory] : undefined,
    filterColor: product.filterColor ? [...product.filterColor] : undefined,
    filterSizes: product.filterSizes ? [...product.filterSizes] : undefined,
    tags: product.tags ? [...product.tags] : undefined,
    services: product.services ? [...product.services] : undefined,
  };
}

function cloneRange(
  start: number,
  count: number,
  overrides?: (
    product: ProductCardItem,
    index: number,
  ) => Partial<ProductCardItem>,
): ProductCardItem[] {
  return storefrontCatalog.slice(start, start + count).map((product, index) => {
    const cloned = cloneProduct(product);
    return {
      ...cloned,
      ...(overrides ? overrides(cloned, index) : {}),
    };
  });
}

function asShopProducts(items: ProductCardItem[]): ShopProduct[] {
  return items as ShopProduct[];
}

export const products: ProductCardItem[] = storefrontCatalog.map(cloneProduct);

export const shopDefaultProducts: ShopProduct[] = asShopProducts(products);

export const topPicksProducts = cloneRange(0, 8, (product, index) => ({
  badge: index < 2 ? "NEW" : product.badge,
}));

export const topPicsProducts = cloneRange(8, 12, (_product, index) => ({
  filterTabIds:
    index % 3 === 0
      ? ["related"]
      : index % 3 === 1
        ? ["related", "recently"]
        : ["recently"],
}));

export const lookbookPinProducts = cloneRange(20, 8);
export const bundleBabyPinProducts = cloneRange(28, 4);
export const miniPopupProduct = cloneRange(32, 1)[0] ?? products[0];
export const stickyBarProduct = cloneRange(33, 1)[0] ?? products[0];

export const bestChoiceSportProducts = cloneRange(34, 8);
export const bannerProductSingleItems = cloneRange(42, 10);

export const productsSneaker = cloneRange(52, 8);
export const featuredSneakerProducts = cloneRange(60, 8);
export const bannerStepSneakerProducts = cloneRange(68, 4);

export const topTrendPodProducts = cloneRange(72, 8);
export const productTabPodProducts = cloneRange(80, 8, (product, index) => ({
  filterTabIds: [index % 2 === 0 ? "featured" : "latest"],
}));

export const topPickPetProducts = cloneRange(88, 8);
export const featuredPetProducts = cloneRange(96, 8);

export const popularOrganicProducts = cloneRange(104, 8);
export const favoriteOrganicProducts = cloneRange(112, 8);

export const productsOfficeEquipment = cloneRange(120, 8);
export const productTabOfficeProducts = cloneRange(128, 8, (_product, index) => ({
  filterTabIds: [index % 2 === 0 ? "best-seller" : "new-arrivals"],
}));

export const topPickMentalProducts = cloneRange(136, 8);
export const featuredMentalProducts = cloneRange(144, 8);

export const newArrivalsJewelryProducts = cloneRange(152, 8);
export const bestSaleJewelryProducts = cloneRange(160, 8);

export const topPickHeadphoneProducts = cloneRange(168, 8);
export const collectionHeadphoneProducts = cloneRange(176, 4);
export const trendingFindsGardenProducts = cloneRange(176, 8);
export const bestSaleGardenProducts = cloneRange(184, 8);

export const topSellerFurnitureProducts = cloneRange(192, 8);
export const productsFurniture = cloneRange(200, 8);

export const todayFashionProducts = cloneRange(16, 8);
export const bannerHighlightFashionProducts = cloneRange(24, 4);

export const productsFashion2 = cloneRange(40, 8);
export const productFeatureFashion2Products = cloneRange(48, 6);

export const gearBundleProducts = cloneRange(64, 8);

export const bestSellerElectronicsHeadphone = cloneRange(72, 6, () => ({
  filterTabIds: ["headphone"],
}));

export const bestSellerElectronicsMouse = cloneRange(78, 6, (_product, index) => ({
  filterTabIds:
    index % 2 === 0 ? ["mouse"] : ["keyboard", "mousepad", "cables", "networking"],
}));

export const topPicksDecorProducts = cloneRange(84, 8);
export const topPicksCosmeticProducts = cloneRange(92, 8);
export const newArrivalDecorProducts = cloneRange(88, 8);

export const topPicksConstruction2Products = cloneRange(100, 8);
export const topPicksConstructionProducts = cloneRange(108, 8);
export const bannerProductSingleConstruction = cloneRange(116, 1)[0] ?? products[0];
export const arrivalConstructionProduct = bannerProductSingleConstruction;

export const productCountdownBagProducts = cloneRange(124, 8);
export const bestChoiceBagProducts = cloneRange(132, 8);

export const babyHighlightsNewProducts = cloneRange(140, 8);
export const favoriteBabyProducts = cloneRange(148, 8);

export const featured2AutoProducts = cloneRange(156, 8);
export const featuredAutoProducts = cloneRange(164, 8);
export const bestDealsAutoProducts = cloneRange(172, 8);
