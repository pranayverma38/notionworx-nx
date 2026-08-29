"use client";

import Image from "next/image";
import { useMemo, type CSSProperties } from "react";

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
  const hasConditionalOptions = addOnGroups.some((group) =>
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
    <div id="product-addons-form" style={{ display: "grid", gap: 20 }}>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "baseline",
          }}
        >
          <div>
            <h5 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>
              Accessories &amp; Upgrades
            </h5>
            <p
              style={{
                margin: "6px 0 0",
                color: "#6b7280",
                fontSize: "0.82rem",
                lineHeight: 1.55,
              }}
            >
              Add-on quantities apply per configured product unit.
            </p>
          </div>
          <div
            style={{
              fontSize: "0.88rem",
              fontWeight: 600,
              color: addOnSelectionSubtotal > 0 ? "var(--primary)" : "#111827",
            }}
          >
            {addOnSelectionSubtotal > 0
              ? `+${formatPrice(addOnSelectionSubtotal)} per unit`
              : "No add-ons selected"}
          </div>
        </div>
      </div>

      {addOnGroups.map((group) => (
        <section
          key={group.id}
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            padding: 16,
            background: "#fff",
            display: "grid",
            gap: 16,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <h6 style={{ margin: 0, fontSize: "0.98rem", fontWeight: 700 }}>
                {group.title}
              </h6>
              <span
                style={{
                  color: "#6b7280",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {group.selectionMode === "multiple"
                  ? "Multiple selections allowed"
                  : "Single selection"}
              </span>
            </div>
            {group.description ? (
              <p
                style={{
                  margin: "8px 0 0",
                  color: "#6b7280",
                  fontSize: "0.82rem",
                  lineHeight: 1.5,
                }}
              >
                {group.description}
              </p>
            ) : null}
          </div>

          {(group.subgroups ?? []).map((subgroup) => (
            <div key={`${group.id}:${subgroup.id}`} style={{ display: "grid", gap: 12 }}>
              <div>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <h6
                    style={{
                      margin: 0,
                      fontSize: "0.9rem",
                      fontWeight: 700,
                    }}
                  >
                    {subgroup.title}
                  </h6>
                  <span
                    style={{
                      color: "#6b7280",
                      fontSize: "0.74rem",
                    }}
                  >
                    {subgroup.selectionMode === "multiple"
                      ? "Choose one or more"
                      : "Choose up to one"}
                  </span>
                </div>
                {subgroup.description ? (
                  <p
                    style={{
                      margin: "6px 0 0",
                      color: "#6b7280",
                      fontSize: "0.8rem",
                      lineHeight: 1.5,
                    }}
                  >
                    {subgroup.description}
                  </p>
                ) : null}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 12,
                }}
              >
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
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 12,
              }}
            >
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
        <p
          style={{
            margin: 0,
            color: "#6b7280",
            fontSize: "0.78rem",
            lineHeight: 1.5,
          }}
        >
          Options marked <strong>Conditional on source</strong> were hidden by
          default or gated by other selections on the original site. They are
          shown here so the crawl coverage remains complete.
        </p>
      ) : null}
    </div>
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
  const titleParts = [
    option.hoverTitle || option.title,
    option.hoverDescription,
    isConditional ? "Conditional on source" : undefined,
  ].filter(Boolean);

  return (
    <div
      style={{
        border: `1px solid ${isSelected ? "var(--primary)" : "#e5e7eb"}`,
        borderRadius: 14,
        padding: 12,
        background: isSelected ? "rgba(255, 111, 97, 0.04)" : "#fff",
        display: "grid",
        gap: 12,
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={isSelected}
        title={titleParts.join(" | ")}
        style={{
          border: "none",
          background: "transparent",
          padding: 0,
          textAlign: "left",
          display: "grid",
          gap: 12,
          cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              overflow: "hidden",
              flexShrink: 0,
              background: "#f9fafb",
              position: "relative",
              display: "grid",
              placeItems: "center",
            }}
          >
            {option.image ? (
              <Image
                src={option.image}
                alt={option.title}
                fill
                sizes="64px"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <span
                style={{
                  color: "#6b7280",
                  fontSize: "0.72rem",
                  textAlign: "center",
                  padding: 8,
                  lineHeight: 1.25,
                }}
              >
                {subgroup?.title || group.title}
              </span>
            )}
          </div>
          <div style={{ minWidth: 0, display: "grid", gap: 6 }}>
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "flex-start",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  color: "#111827",
                  lineHeight: 1.35,
                }}
              >
                {option.title}
              </span>
              {isConditional ? (
                <span
                  style={{
                    borderRadius: 999,
                    padding: "2px 8px",
                    background: "#fff7ed",
                    color: "#c2410c",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    lineHeight: 1.35,
                  }}
                >
                  Conditional on source
                </span>
              ) : null}
            </div>
            <span
              style={{
                fontSize: "0.76rem",
                color: "#6b7280",
                lineHeight: 1.45,
              }}
            >
              {option.hoverDescription}
            </span>
            <span
              style={{
                fontSize: "0.88rem",
                fontWeight: 700,
                color: "var(--primary)",
              }}
            >
              {option.price.label || `(+ ${formatPrice(option.price.surcharge)})`}
            </span>
          </div>
        </div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: "0.8rem",
            fontWeight: 700,
            color: isSelected ? "var(--primary)" : "#111827",
          }}
        >
          <span
            aria-hidden
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              border: `1px solid ${isSelected ? "var(--primary)" : "#cbd5e1"}`,
              background: isSelected ? "var(--primary)" : "#fff",
              display: "inline-grid",
              placeItems: "center",
              color: "#fff",
              fontSize: "0.7rem",
            }}
          >
            {isSelected ? "✓" : ""}
          </span>
          {isSelected ? "Selected" : "Select option"}
        </span>
      </button>

      {isSelected ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              color: "#6b7280",
              fontSize: "0.78rem",
              lineHeight: 1.4,
            }}
          >
            Quantity per configured unit
          </span>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              border: "1px solid #d1d5db",
              borderRadius: 999,
              overflow: "hidden",
            }}
          >
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onQuantityChange(Math.max(1, quantity - 1));
              }}
              style={quantityButtonStyle}
              aria-label={`Decrease ${option.title} quantity`}
            >
              -
            </button>
            <span
              style={{
                minWidth: 40,
                textAlign: "center",
                fontSize: "0.82rem",
                fontWeight: 700,
              }}
            >
              {quantity}
            </span>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onQuantityChange(quantity + 1);
              }}
              style={quantityButtonStyle}
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

function flattenGroupOptions(group: ProductAddOnGroup): ProductAddOnOption[] {
  return [
    ...(group.items ?? []),
    ...(group.subgroups ?? []).flatMap((subgroup) => subgroup.items),
  ];
}

const quantityButtonStyle: CSSProperties = {
  border: "none",
  background: "#fff",
  width: 32,
  height: 32,
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: 700,
};
