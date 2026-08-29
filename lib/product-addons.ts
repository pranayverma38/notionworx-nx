import type { ProductCardItem } from "@/types/productCard";
import type {
  ProductAddOnGroup,
  ProductAddOnOption,
  ProductAddOnSelection,
} from "@/types/productAddons";

export interface FlattenedProductAddOnOption extends ProductAddOnOption {
  groupId: string;
  groupTitle: string;
  subgroupId?: string;
  subgroupTitle?: string;
}

export interface ProductConfigurationKeyInput {
  productId: number | string;
  selectedColor?: string;
  selectedSize?: string;
  addOnSelections?: ProductAddOnSelection[];
}

export interface SelectedProductAddOnOption extends FlattenedProductAddOnOption {
  quantity: number;
  lineSurcharge: number;
}

function cloneAddOnOption(option: ProductAddOnOption): ProductAddOnOption {
  return {
    ...option,
    price: { ...option.price },
    ...(option.metadata ? { metadata: { ...option.metadata } } : {}),
  };
}

function isConditionalAddOnOption(option: ProductAddOnOption): boolean {
  return (
    option.metadata?.conditional === "true" ||
    option.metadata?.hiddenByDefault === "true" ||
    /\bconditional on source\b/i.test(option.hoverDescription ?? "")
  );
}

function cleanAddOnDescription(description?: string): string | undefined {
  const normalized = String(description ?? "").trim();

  if (!normalized) {
    return undefined;
  }

  return /shown conditionally on the source site|items marked conditional were hidden by default or gated by other source options|rendered as a dropdown on the source site/i.test(
    normalized,
  )
    ? undefined
    : normalized;
}

function sanitizeProductAddOnGroups(
  groups?: ProductAddOnGroup[],
): ProductAddOnGroup[] | undefined {
  if (!groups?.length) {
    return undefined;
  }

  const sanitizedGroups = groups.flatMap((group) => {
    const sanitizedItems = (group.items ?? []).flatMap((item) => {
      const nextItem = isConditionalAddOnOption(item) ? null : cloneAddOnOption(item);
      return nextItem ? [nextItem] : [];
    });
    const sanitizedSubgroups = (group.subgroups ?? []).flatMap((subgroup) => {
      const sanitizedSubgroupItems = subgroup.items.flatMap((item) => {
        const nextItem = isConditionalAddOnOption(item) ? null : cloneAddOnOption(item);
        return nextItem ? [nextItem] : [];
      });

      if (!sanitizedSubgroupItems.length) {
        return [];
      }

      const { description: _subgroupDescription, items: _subgroupItems, ...subgroupRest } =
        subgroup;
      const description = cleanAddOnDescription(subgroup.description);

      return [
        {
          ...subgroupRest,
          ...(description ? { description } : {}),
          items: sanitizedSubgroupItems,
        },
      ];
    });

    if (!sanitizedItems.length && !sanitizedSubgroups.length) {
      return [];
    }

    const { description: _groupDescription, items: _groupItems, subgroups: _groupSubgroups, ...groupRest } =
      group;
    const description = cleanAddOnDescription(group.description);

    return [
      {
        ...groupRest,
        ...(description ? { description } : {}),
        ...(sanitizedSubgroups.length ? { subgroups: sanitizedSubgroups } : {}),
        ...(sanitizedItems.length ? { items: sanitizedItems } : {}),
      },
    ];
  });

  return sanitizedGroups.length ? sanitizedGroups : undefined;
}

/** Deep clone add-on group data so catalog clones stay mutation-safe. */
export function cloneProductAddOnGroups(
  groups?: ProductAddOnGroup[],
): ProductAddOnGroup[] | undefined {
  return sanitizeProductAddOnGroups(groups);
}

/** Returns add-on groups for a product, optionally filtered by type. */
export function getProductAddOnGroups(
  product: Pick<ProductCardItem, "addOnGroups">,
  kind?: ProductAddOnGroup["kind"],
): ProductAddOnGroup[] {
  const groups = sanitizeProductAddOnGroups(product.addOnGroups);

  if (!groups?.length) {
    return [];
  }

  return kind ? groups.filter((group) => group.kind === kind) : groups;
}

/** Flattens group/subgroup structures for pricing and cart utilities. */
export function flattenProductAddOnOptions(
  groups?: ProductAddOnGroup[],
): FlattenedProductAddOnOption[] {
  const sanitizedGroups = sanitizeProductAddOnGroups(groups);

  if (!sanitizedGroups?.length) {
    return [];
  }

  return sanitizedGroups.flatMap((group) => {
    const groupItems = (group.items ?? []).map((item) => ({
      ...cloneAddOnOption(item),
      groupId: group.id,
      groupTitle: group.title,
    }));
    const subgroupItems = (group.subgroups ?? []).flatMap((subgroup) =>
      subgroup.items.map((item) => ({
        ...cloneAddOnOption(item),
        groupId: group.id,
        groupTitle: group.title,
        subgroupId: subgroup.id,
        subgroupTitle: subgroup.title,
      })),
    );

    return [...groupItems, ...subgroupItems];
  });
}

/** Sums attached accessory/upgrade surcharges for one configured product. */
export function getProductAddOnSelectionSubtotal(
  groups?: ProductAddOnGroup[],
  selections?: ProductAddOnSelection[],
): number {
  if (!groups?.length || !selections?.length) {
    return 0;
  }

  const optionsByKey = new Map(
    flattenProductAddOnOptions(groups).map((option) => [
      buildAddOnOptionKey(option.groupId, option.id, option.subgroupId),
      option,
    ]),
  );

  return selections.reduce((subtotal, selection) => {
    const option = optionsByKey.get(
      buildAddOnOptionKey(
        selection.groupId,
        selection.addOnId,
        selection.subgroupId,
      ),
    );

    if (!option) {
      return subtotal;
    }

    return subtotal + option.price.surcharge * normalizeQuantity(selection.quantity);
  }, 0);
}

/** Resolves selected add-ons with display metadata for cart and UI summaries. */
export function getSelectedProductAddOnOptions(
  groups?: ProductAddOnGroup[],
  selections?: ProductAddOnSelection[],
): SelectedProductAddOnOption[] {
  if (!groups?.length || !selections?.length) {
    return [];
  }

  const optionsByKey = new Map(
    flattenProductAddOnOptions(groups).map((option) => [
      buildAddOnOptionKey(option.groupId, option.id, option.subgroupId),
      option,
    ]),
  );

  return normalizeProductAddOnSelections(selections)
    .map((selection) => {
      const option = optionsByKey.get(
        buildAddOnOptionKey(
          selection.groupId,
          selection.addOnId,
          selection.subgroupId,
        ),
      );

      if (!option) {
        return null;
      }

      return {
        ...option,
        quantity: selection.quantity,
        lineSurcharge: option.price.surcharge * selection.quantity,
      };
    })
    .filter((option): option is SelectedProductAddOnOption => Boolean(option));
}

/** Computes the unit price for a configured base product plus selected add-ons. */
export function getConfiguredProductUnitPrice(
  basePrice: number,
  groups?: ProductAddOnGroup[],
  selections?: ProductAddOnSelection[],
): number {
  return basePrice + getProductAddOnSelectionSubtotal(groups, selections);
}

/** Keeps only selections that still map to visible add-on options. */
export function filterValidProductAddOnSelections(
  groups?: ProductAddOnGroup[],
  selections?: ProductAddOnSelection[],
): ProductAddOnSelection[] {
  const normalizedSelections = normalizeProductAddOnSelections(selections);

  if (!groups?.length || !normalizedSelections.length) {
    return [];
  }

  const validSelectionKeys = new Set(
    flattenProductAddOnOptions(groups).map((option) =>
      buildAddOnOptionKey(option.groupId, option.id, option.subgroupId),
    ),
  );

  return normalizedSelections.filter((selection) =>
    validSelectionKeys.has(
      buildAddOnOptionKey(
        selection.groupId,
        selection.addOnId,
        selection.subgroupId,
      ),
    ),
  );
}

/** Stable cart identity for a product configuration, including attached add-ons. */
export function buildProductConfigurationKey({
  productId,
  selectedColor,
  selectedSize,
  addOnSelections,
}: ProductConfigurationKeyInput): string {
  const normalizedSelections = normalizeProductAddOnSelections(addOnSelections).map(
    (selection) => ({
      addOnId: selection.addOnId,
      groupId: selection.groupId,
      subgroupId: selection.subgroupId ?? null,
      quantity: selection.quantity,
    }),
  );

  return JSON.stringify({
    productId,
    selectedColor: selectedColor || null,
    selectedSize: selectedSize || null,
    addOnSelections: normalizedSelections,
  });
}

/** Returns a stable product identity for cart keys, preferring source ids. */
export function getProductConfigurationIdentity(
  product: Pick<ProductCardItem, "id" | "sourceProductId">,
): number | string {
  return product.sourceProductId ?? product.id;
}

/** Normalizes and sorts add-on selections for stable storage and comparisons. */
export function normalizeProductAddOnSelections(
  selections?: ProductAddOnSelection[],
): ProductAddOnSelection[] {
  return (selections ?? [])
    .map((selection) => ({
      addOnId: selection.addOnId,
      groupId: selection.groupId,
      ...(selection.subgroupId ? { subgroupId: selection.subgroupId } : {}),
      quantity: normalizeQuantity(selection.quantity),
    }))
    .sort((left, right) =>
      buildAddOnOptionKey(
        left.groupId,
        left.addOnId,
        left.subgroupId,
      ).localeCompare(
        buildAddOnOptionKey(
          right.groupId,
          right.addOnId,
          right.subgroupId,
        ),
      ),
    );
}

function buildAddOnOptionKey(
  groupId: string,
  addOnId: string,
  subgroupId?: string,
): string {
  return `${groupId}::${subgroupId ?? ""}::${addOnId}`;
}

function normalizeQuantity(value?: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 1;
  }

  return Math.max(1, Math.floor(value));
}
