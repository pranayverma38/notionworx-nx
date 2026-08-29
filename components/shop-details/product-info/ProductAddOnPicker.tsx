"use client";

import Image from "next/image";
import { useMemo } from "react";

import { useProduct } from "@/context/ProductContext";
import type {
  ProductAddOnGroup,
  ProductAddOnOption,
  ProductAddOnSelection,
  ProductAddOnSubgroup,
} from "@/types/productAddons";
import { formatPrice } from "@/utils/formatPrice";

export function ProductAddOnPicker() {
  const {
    addOnGroups,
    addOnSelections,
    setAddOnSelections,
    addOnSelectionSubtotal,
  } = useProduct();
  const frameTypeGroups = useMemo(
    () => addOnGroups.filter(isFrameTypeSelectorGroup),
    [addOnGroups],
  );
  const standardGroups = useMemo(
    () => addOnGroups.filter((group) => !isFrameTypeSelectorGroup(group)),
    [addOnGroups],
  );

  const selectedKeys = useMemo(
    () =>
      new Set(
        addOnSelections.map((selection) =>
          buildSelectionKey(
            selection.groupId,
            selection.addOnId,
            selection.subgroupId,
          ),
        ),
      ),
    [addOnSelections],
  );
  const hasConditionalOptions = standardGroups.some((group) =>
    flattenGroupOptions(group).some(
      (option) =>
        option.metadata?.conditional === "true" ||
        option.metadata?.hiddenByDefault === "true",
    ),
  );

  if (!addOnGroups.length) {
    return null;
  }

  return (
    <div id="product-addons-form" className="product-addons">
      {frameTypeGroups.map((group) => (
        <FrameTypeSelector
          key={group.id}
          group={group}
          selectedKeys={selectedKeys}
          onSelect={(option) =>
            setAddOnSelections((previousSelections) =>
              selectSingleOption(previousSelections, group, option),
            )
          }
        />
      ))}

      {standardGroups.length ? (
        <div className="product-addons__header">
          <div className="product-addons__header-copy">
            <h5 className="product-addons__title">Accessories &amp; Upgrades</h5>
            <p className="product-addons__subtitle">
              Add-on quantities apply per configured product unit.
            </p>
          </div>
          <div
            className={`product-addons__subtotal${
              addOnSelectionSubtotal > 0 ? " is-active" : ""
            }`}
          >
              {addOnSelectionSubtotal > 0
                ? `+${formatPrice(addOnSelectionSubtotal)} per unit`
                : "No add-ons selected"}
          </div>
        </div>
      ) : null}

      {standardGroups.map((group) => (
        <section key={group.id} className="product-addons__group">
          <div className="product-addons__group-header">
            <div>
              <h6 className="product-addons__group-title">{group.title}</h6>
              {group.description ? (
                <p className="product-addons__group-description">
                  {group.description}
                </p>
              ) : null}
            </div>
            <span className="product-addons__group-mode">
                {group.selectionMode === "multiple"
                  ? "Multiple selections allowed"
                  : "Single selection"}
            </span>
          </div>

          {(group.subgroups ?? []).map((subgroup) => (
            <div key={`${group.id}:${subgroup.id}`} className="product-addons__subgroup">
              <div className="product-addons__subgroup-header">
                <h6 className="product-addons__subgroup-title">{subgroup.title}</h6>
                <span className="product-addons__subgroup-hint">
                    {subgroup.selectionMode === "multiple"
                      ? "Choose one or more"
                      : "Choose up to one"}
                </span>
                {subgroup.description ? (
                  <p className="product-addons__subgroup-description">
                    {subgroup.description}
                  </p>
                ) : null}
              </div>

              <div className="product-addons__options-grid">
                {subgroup.items.map((option) => {
                  const selection = findSelection(
                    addOnSelections,
                    group.id,
                    option.id,
                    subgroup.id,
                  );
                  const isSelected = selectedKeys.has(
                    buildSelectionKey(group.id, option.id, subgroup.id),
                  );

                  return (
                    <AddOnOptionCard
                      key={`${group.id}:${subgroup.id}:${option.id}`}
                      group={group}
                      subgroup={subgroup}
                      option={option}
                      isSelected={isSelected}
                      quantity={selection?.quantity ?? 1}
                      onToggle={() =>
                        setAddOnSelections((previousSelections) =>
                          toggleSelection(previousSelections, group, option, subgroup),
                        )
                      }
                      onQuantityChange={(nextQuantity) =>
                        setAddOnSelections((previousSelections) =>
                          updateSelectionQuantity(
                            previousSelections,
                            group.id,
                            option.id,
                            subgroup.id,
                            nextQuantity,
                          ),
                        )
                      }
                    />
                  );
                })}
              </div>
            </div>
          ))}

          {(group.items ?? []).length ? (
            <div className="product-addons__options-grid">
              {group.items?.map((option) => {
                const selection = findSelection(addOnSelections, group.id, option.id);
                const isSelected = selectedKeys.has(
                  buildSelectionKey(group.id, option.id),
                );

                return (
                  <AddOnOptionCard
                    key={`${group.id}:${option.id}`}
                    group={group}
                    option={option}
                    isSelected={isSelected}
                    quantity={selection?.quantity ?? 1}
                    onToggle={() =>
                      setAddOnSelections((previousSelections) =>
                        toggleSelection(previousSelections, group, option),
                      )
                    }
                    onQuantityChange={(nextQuantity) =>
                      setAddOnSelections((previousSelections) =>
                        updateSelectionQuantity(
                          previousSelections,
                          group.id,
                          option.id,
                          undefined,
                          nextQuantity,
                        ),
                      )
                    }
                  />
                );
              })}
            </div>
          ) : null}
        </section>
      ))}

      {hasConditionalOptions ? (
        <p className="product-addons__footnote">
          Options marked <strong>Conditional on source</strong> were hidden by
          default or gated by other selections on the original site. They are
          shown here so the crawl coverage remains complete.
        </p>
      ) : null}
    </div>
  );
}

function FrameTypeSelector({
  group,
  selectedKeys,
  onSelect,
}: {
  group: ProductAddOnGroup;
  selectedKeys: Set<string>;
  onSelect: (option: ProductAddOnOption) => void;
}) {
  const options = group.items ?? [];

  return (
    <section className="product-addons__frame-group">
      <p className="product-addons__frame-label">Frame Type</p>
      <div className="product-addons__frame-toggle" role="group" aria-label="Frame Type">
        {options.map((option) => {
          const isSelected = selectedKeys.has(
            buildSelectionKey(group.id, option.id),
          );

          return (
            <button
              key={`${group.id}:${option.id}`}
              type="button"
              className={`product-addons__frame-button${
                isSelected ? " is-active" : ""
              }`}
              onClick={() => onSelect(option)}
              aria-pressed={isSelected}
            >
              {option.title}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function AddOnOptionCard({
  group,
  option,
  subgroup,
  isSelected,
  quantity,
  onToggle,
  onQuantityChange,
}: {
  group: ProductAddOnGroup;
  option: ProductAddOnOption;
  subgroup?: ProductAddOnSubgroup;
  isSelected: boolean;
  quantity: number;
  onToggle: () => void;
  onQuantityChange: (nextQuantity: number) => void;
}) {
  const isConditional =
    option.metadata?.conditional === "true" ||
    option.metadata?.hiddenByDefault === "true";
  const allowsQuantity = option.allowsQuantity !== false;
  const metaText = option.hoverDescription
    ?.replace(/\s*[·-]\s*\(\+\s*\$[\d,]+(?:\.\d{2})?\)\s*$/i, "")
    .trim();
  const priceLabel =
    option.price.label ||
    (option.price.surcharge > 0
      ? `(+ ${formatPrice(option.price.surcharge)})`
      : "Included");
  const titleParts = [
    option.hoverTitle || option.title,
    metaText,
    isConditional ? "Conditional on source" : undefined,
  ].filter(Boolean);

  return (
    <div className={`product-addon-card${isSelected ? " is-selected" : ""}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={isSelected}
        title={titleParts.join(" | ")}
        className="product-addon-card__toggle"
      >
        <div className="product-addon-card__media">
          {isSelected ? (
            <span className="product-addon-card__selected-badge" aria-hidden>
              ✓
            </span>
          ) : null}
          <div className="product-addon-card__image">
            {option.image ? (
              <Image
                src={option.image}
                alt={option.title}
                fill
                sizes="64px"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <span className="product-addon-card__image-fallback">
                {subgroup?.title || group.title}
              </span>
            )}
          </div>
          <div className="product-addon-card__content">
            <div className="product-addon-card__body">
              <div className="product-addon-card__title-row">
                <span className="product-addon-card__title">{option.title}</span>
                {isConditional ? (
                  <span className="product-addon-card__badge">
                    Conditional on source
                  </span>
                ) : null}
              </div>
            </div>
            <div className="product-addon-card__footer">
              <span className="product-addon-card__unit-price">{priceLabel}</span>
            </div>
          </div>
        </div>
      </button>

      {isSelected && allowsQuantity ? (
        <div className="product-addon-card__quantity-row">
          <span className="product-addon-card__quantity-label">
            Quantity per configured unit
          </span>
          <div className="product-addon-card__quantity-stepper">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onQuantityChange(Math.max(1, quantity - 1));
              }}
              className="product-addon-card__quantity-button"
              aria-label={`Decrease ${option.title} quantity`}
            >
              -
            </button>
            <span className="product-addon-card__quantity-value">
              {quantity}
            </span>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onQuantityChange(quantity + 1);
              }}
              className="product-addon-card__quantity-button"
              aria-label={`Increase ${option.title} quantity`}
            >
              +
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function toggleSelection(
  selections: ProductAddOnSelection[],
  group: ProductAddOnGroup,
  option: ProductAddOnOption,
  subgroup?: ProductAddOnSubgroup,
): ProductAddOnSelection[] {
  const selectionKey = buildSelectionKey(group.id, option.id, subgroup?.id);
  const exists = selections.some(
    (selection) =>
      buildSelectionKey(
        selection.groupId,
        selection.addOnId,
        selection.subgroupId,
      ) === selectionKey,
  );

  if (exists) {
    return selections.filter(
      (selection) =>
        buildSelectionKey(
          selection.groupId,
          selection.addOnId,
          selection.subgroupId,
        ) !== selectionKey,
    );
  }

  const selectionMode = subgroup?.selectionMode ?? group.selectionMode ?? "single";
  const nextSelections =
    selectionMode === "multiple"
      ? [...selections]
      : selections.filter(
          (selection) =>
            selection.groupId !== group.id ||
            (selection.subgroupId ?? "") !== (subgroup?.id ?? ""),
        );

  return [
    ...nextSelections,
    {
      groupId: group.id,
      ...(subgroup?.id ? { subgroupId: subgroup.id } : {}),
      addOnId: option.id,
      quantity: Math.max(1, option.minQuantity ?? 1),
    },
  ];
}

function updateSelectionQuantity(
  selections: ProductAddOnSelection[],
  groupId: string,
  addOnId: string,
  subgroupId: string | undefined,
  nextQuantity: number,
): ProductAddOnSelection[] {
  return selections.map((selection) =>
    buildSelectionKey(selection.groupId, selection.addOnId, selection.subgroupId) ===
    buildSelectionKey(groupId, addOnId, subgroupId)
      ? { ...selection, quantity: Math.max(1, Math.floor(nextQuantity)) }
      : selection,
  );
}

function findSelection(
  selections: ProductAddOnSelection[],
  groupId: string,
  addOnId: string,
  subgroupId?: string,
) {
  return selections.find(
    (selection) =>
      buildSelectionKey(selection.groupId, selection.addOnId, selection.subgroupId) ===
      buildSelectionKey(groupId, addOnId, subgroupId),
  );
}

function buildSelectionKey(
  groupId: string,
  addOnId: string,
  subgroupId?: string,
) {
  return `${groupId}::${subgroupId ?? ""}::${addOnId}`;
}

function selectSingleOption(
  selections: ProductAddOnSelection[],
  group: ProductAddOnGroup,
  option: ProductAddOnOption,
  subgroup?: ProductAddOnSubgroup,
): ProductAddOnSelection[] {
  const selectionKey = buildSelectionKey(group.id, option.id, subgroup?.id);
  const exists = selections.some(
    (selection) =>
      buildSelectionKey(
        selection.groupId,
        selection.addOnId,
        selection.subgroupId,
      ) === selectionKey,
  );

  if (exists) {
    return selections;
  }

  const nextSelections = selections.filter(
    (selection) =>
      selection.groupId !== group.id ||
      (selection.subgroupId ?? "") !== (subgroup?.id ?? ""),
  );

  return [
    ...nextSelections,
    {
      groupId: group.id,
      ...(subgroup?.id ? { subgroupId: subgroup.id } : {}),
      addOnId: option.id,
      quantity: Math.max(1, option.minQuantity ?? 1),
    },
  ];
}

function isFrameTypeSelectorGroup(group: ProductAddOnGroup): boolean {
  const options = group.items ?? [];
  if (options.length !== 2 || group.selectionMode !== "single") {
    return false;
  }

  return options.every((option) => {
    const sourceFieldName = option.metadata?.sourceFieldName?.toLowerCase() ?? "";
    const hoverDescription = option.hoverDescription?.toLowerCase() ?? "";

    return (
      option.allowsQuantity === false &&
      (sourceFieldName.includes("frame type") ||
        hoverDescription.includes("frame type"))
    );
  });
}

function flattenGroupOptions(group: ProductAddOnGroup): ProductAddOnOption[] {
  return [
    ...(group.items ?? []),
    ...(group.subgroups ?? []).flatMap((subgroup) => subgroup.items),
  ];
}
