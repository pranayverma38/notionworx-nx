import sharedCatalog from "@/data/inventory/notionworx/product-addons.shared.generated.json";
import { cloneProductAddOnGroups } from "@/lib/product-addons";
import type { ProductAddOnGroup } from "@/types/productAddons";

type SharedAddOnCatalog = {
  groups?: Record<string, ProductAddOnGroup>;
  products?: Record<string, string[]>;
};

const sharedAddOnCatalog = sharedCatalog as SharedAddOnCatalog;

export function getSharedProductAddOnKeysByHandle(
  handle?: string | null,
): string[] | undefined {
  if (!handle) {
    return undefined;
  }

  const keys = sharedAddOnCatalog.products?.[handle];
  return keys?.length ? [...keys] : undefined;
}

export function getSharedProductAddOnGroupsByKeys(
  keys?: string[] | null,
): ProductAddOnGroup[] | undefined {
  if (!keys?.length) {
    return undefined;
  }

  const groups = keys
    .map((key) => sharedAddOnCatalog.groups?.[key])
    .filter((group): group is ProductAddOnGroup => Boolean(group));

  return groups.length ? cloneProductAddOnGroups(groups) : undefined;
}

export function getSharedProductAddOnGroupsByHandle(
  handle?: string | null,
): ProductAddOnGroup[] | undefined {
  return getSharedProductAddOnGroupsByKeys(
    getSharedProductAddOnKeysByHandle(handle),
  );
}
