"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

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

  if (!addOnGroups.length) {
    return null;
  }

  return (
    <div id="product-addons-form" className="product-addons">
      {addOnGroups.length ? (
        <div className="product-addons__header">
          <div className="product-addons__header-copy">
            <p className="product-addons__eyebrow">Finish your setup</p>
            <h5 className="product-addons__title">Accessories &amp; upgrades, one smart step at a time.</h5>
            <p className="product-addons__subtitle">
              We&apos;ll guide you through the extras that match this product before it goes into the cart.
            </p>
          </div>
          <div
            className={`product-addons__subtotal${
              addOnSelectionSubtotal > 0 ? " is-active" : ""
            }`}
          >
            {addOnSelectionSubtotal > 0
              ? `+${formatPrice(addOnSelectionSubtotal)} per unit`
              : "Base setup only"}
          </div>
        </div>
      ) : null}

      {addOnGroups.map((group) => (
        <section key={group.id} className="product-addons__group">
          <div className="product-addons__group-header">
            <div>
              <p className="product-addons__group-kicker">
                {group.kind === "upgrade" ? "Recommended upgrades" : "Helpful extras"}
              </p>
              <h6 className="product-addons__group-title">{group.title}</h6>
              {group.description ? (
                <p className="product-addons__group-description">
                  {group.description}
                </p>
              ) : (
                <p className="product-addons__group-description">
                  {getGroupDescription(group)}
                </p>
              )}
            </div>
            <span className="product-addons__group-mode">
              {getGroupSelectionSummary(group, addOnSelections)}
            </span>
          </div>

          {(group.subgroups ?? []).map((subgroup, index) => {
            const prefersFlatGrid =
              subgroup.selectionMode === "multiple" && subgroup.items.length > 1;

            if (prefersFlatGrid) {
              return (
                <div
                  key={`${group.id}:${subgroup.id}`}
                  className="product-addons__subgroup"
                >
                  <div className="product-addons__subgroup-header">
                    <h6 className="product-addons__subgroup-title">{subgroup.title}</h6>
                    <span className="product-addons__subgroup-hint">
                      Choose one or more
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
              );
            }

            return (
              <GuidedAddOnConfigurator
                key={`${group.id}:${subgroup.id}`}
                group={group}
                subgroup={subgroup}
                title={subgroup.title}
                description={subgroup.description}
                options={subgroup.items}
                stepNumber={index + 1}
              />
            );
          })}

          {(group.items ?? []).length ? (
            group.selectionMode === "multiple" && group.items.length > 1 ? (
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
            ) : (
              <GuidedAddOnConfigurator
                group={group}
                title={group.title}
                options={group.items ?? []}
                stepNumber={(group.subgroups?.length ?? 0) + 1}
              />
            )
          ) : null}
        </section>
      ))}
    </div>
  );
}

type GuidedOption = {
  option: ProductAddOnOption;
  sizeKey?: string;
  sizeLabel?: string;
  choiceLabel: string;
  choiceHint: string;
};

type GuidedConfiguratorModel =
  | {
      kind: "size-and-choice";
      sizes: Array<{ key: string; label: string }>;
      choicesBySize: Map<string, GuidedOption[]>;
      allChoices: GuidedOption[];
    }
  | {
      kind: "choice-only";
      allChoices: GuidedOption[];
    };

function GuidedAddOnConfigurator({
  group,
  subgroup,
  title,
  description,
  options,
  stepNumber,
}: {
  group: ProductAddOnGroup;
  subgroup?: ProductAddOnSubgroup;
  title: string;
  description?: string;
  options: ProductAddOnOption[];
  stepNumber: number;
}) {
  const { addOnSelections, setAddOnSelections } = useProduct();
  const [preferredSizeKey, setPreferredSizeKey] = useState<string>("");
  const model = useMemo(() => buildGuidedConfiguratorModel(title, options), [options, title]);
  const currentSelection = useMemo(
    () =>
      options
        .map((option) => findSelection(addOnSelections, group.id, option.id, subgroup?.id))
        .find(Boolean),
    [addOnSelections, group.id, options, subgroup?.id],
  );
  const selectedChoice = useMemo(
    () =>
      model.allChoices.find(
        (choice) => choice.option.id === currentSelection?.addOnId,
      ),
    [currentSelection?.addOnId, model.allChoices],
  );
  const resolvedSizeKey =
    model.kind === "size-and-choice"
      ? selectedChoice?.sizeKey ??
        (model.sizes.some((size) => size.key === preferredSizeKey)
          ? preferredSizeKey
          : model.sizes[0]?.key ?? "")
      : undefined;
  const visibleChoices =
    model.kind === "size-and-choice"
      ? model.choicesBySize.get(resolvedSizeKey ?? "") ?? []
      : model.allChoices;
  const selectedQuantity = currentSelection?.quantity ?? 1;
  const selectedChoiceLabel =
    selectedChoice?.choiceLabel ?? selectedChoice?.option.title ?? "";

  return (
    <div className="product-addons__journey">
      <div className="product-addons__journey-step">
        <div className="product-addons__journey-body">
          <div className="product-addons__journey-topbar">
            <span className="product-addons__journey-step-badge">
              Step {stepNumber}
            </span>
            {selectedChoice ? (
              <div className="product-addons__journey-selection-pill">
                <span className="product-addons__journey-selection-label">
                  Selected
                </span>
                <span className="product-addons__journey-selection-value">
                  {model.kind === "size-and-choice" && selectedChoice.sizeLabel
                    ? `${selectedChoice.sizeLabel} · ${selectedChoiceLabel}`
                    : selectedChoiceLabel}
                  {selectedQuantity > 1 ? ` · Qty ${selectedQuantity}` : ""}
                </span>
              </div>
            ) : null}
          </div>
          <div className="product-addons__journey-heading">
            <div className="product-addons__journey-heading-main">
              <h6 className="product-addons__journey-title">{title}</h6>
              <p className="product-addons__journey-copy">
                {description?.trim() || getConfiguratorIntroCopy(title, options.length)}
              </p>
            </div>
          </div>

          {model.kind === "size-and-choice" ? (
            <div className="product-addons__journey-panel">
              <div className="product-addons__journey-label-row">
                <span className="product-addons__journey-label">Step 1</span>
                <p className="product-addons__journey-prompt">
                  {getSizePromptCopy(title)}
                </p>
              </div>
              <div className="product-addons__choice-strip" role="list">
                {model.sizes.map((size) => {
                  const isActive = resolvedSizeKey === size.key;

                  return (
                    <button
                      key={size.key}
                      type="button"
                      className={`product-addons__choice-chip${isActive ? " is-active" : ""}`}
                      onClick={() => {
                        setPreferredSizeKey(size.key);
                        if (selectedChoice?.sizeKey && selectedChoice.sizeKey !== size.key) {
                          setAddOnSelections((previousSelections) =>
                            clearSelection(previousSelections, group.id, subgroup?.id),
                          );
                        }
                      }}
                      aria-pressed={isActive}
                    >
                      {size.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="product-addons__journey-panel">
            <div className="product-addons__journey-label-row">
              <span className="product-addons__journey-label">
                {model.kind === "size-and-choice" ? "Step 2" : "Step 1"}
              </span>
              <p className="product-addons__journey-prompt">
                {getChoicePromptCopy(title)}
              </p>
            </div>
            <div className="product-addons__journey-grid">
              {visibleChoices.map((choice) => (
                <GuidedOptionCard
                  key={`${group.id}:${subgroup?.id ?? "direct"}:${choice.option.id}`}
                  option={choice.option}
                  label={choice.choiceLabel}
                  hint={choice.choiceHint}
                  isSelected={selectedChoice?.option.id === choice.option.id}
                  onSelect={() =>
                    setAddOnSelections((previousSelections) =>
                      selectSingleSelection(
                        previousSelections,
                        group,
                        choice.option,
                        subgroup,
                      ),
                    )
                  }
                />
              ))}
            </div>
          </div>

          {selectedChoice ? (
            <div className="product-addons__journey-footer">
              {selectedChoice.option.allowsQuantity !== false ? (
                <div className="product-addons__journey-quantity">
                  <div className="product-addons__journey-label-row">
                    <span className="product-addons__journey-label">
                      {model.kind === "size-and-choice" ? "Step 3" : "Step 2"}
                    </span>
                    <p className="product-addons__journey-prompt">
                      {getQuantityPromptCopy(title)}
                    </p>
                  </div>
                  <div className="product-addon-card__quantity-stepper">
                    <button
                      type="button"
                      onClick={() =>
                        setAddOnSelections((previousSelections) =>
                          updateSelectionQuantity(
                            previousSelections,
                            group.id,
                            selectedChoice.option.id,
                            subgroup?.id,
                            Math.max(1, selectedQuantity - 1),
                          ),
                        )
                      }
                      className="product-addon-card__quantity-button"
                      aria-label={`Decrease ${selectedChoice.option.title} quantity`}
                    >
                      -
                    </button>
                    <span className="product-addon-card__quantity-value">
                      {selectedQuantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setAddOnSelections((previousSelections) =>
                          updateSelectionQuantity(
                            previousSelections,
                            group.id,
                            selectedChoice.option.id,
                            subgroup?.id,
                            selectedQuantity + 1,
                          ),
                        )
                      }
                      className="product-addon-card__quantity-button"
                      aria-label={`Increase ${selectedChoice.option.title} quantity`}
                    >
                      +
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function GuidedOptionCard({
  option,
  label,
  hint,
  isSelected,
  onSelect,
}: {
  option: ProductAddOnOption;
  label: string;
  hint: string;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [isImageOpen, setIsImageOpen] = useState(false);

  return (
    <div className={`product-addon-card product-addon-card--guided${isSelected ? " is-selected" : ""}`}>
      <div className="product-addon-card__media">
        {isSelected ? (
          <span className="product-addon-card__selected-badge" aria-hidden>
            ✓
          </span>
        ) : null}
        {option.image ? (
          <button
            type="button"
            className="product-addon-card__image-button"
            onClick={() => setIsImageOpen(true)}
            aria-label={`Open ${option.title} image`}
          >
            <div className="product-addon-card__image">
              <Image
                src={option.image}
                alt={option.title}
                fill
                sizes="72px"
                style={{ objectFit: "cover" }}
              />
            </div>
          </button>
        ) : (
          <div className="product-addon-card__image">
            <span className="product-addon-card__image-fallback">
              {label}
            </span>
          </div>
        )}
        <button
          type="button"
          onClick={onSelect}
          aria-pressed={isSelected}
          className="product-addon-card__toggle"
        >
          <div className="product-addon-card__content">
            <div className="product-addon-card__body">
              <div className="product-addon-card__title-row">
                <span className="product-addon-card__title">{label}</span>
              </div>
              <p className="product-addon-card__meta">{hint}</p>
            </div>
            <div className="product-addon-card__footer">
              <span className="product-addon-card__unit-price">
                {option.price.label ||
                  (option.price.surcharge > 0
                    ? `(+ ${formatPrice(option.price.surcharge)})`
                    : "Included")}
              </span>
            </div>
          </div>
        </button>
      </div>

      {isImageOpen ? (
        <div
          className="product-addons__info-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`${option.title} image preview`}
        >
          <button
            type="button"
            className="product-addons__info-backdrop"
            aria-label={`Close ${option.title} image preview`}
            onClick={() => setIsImageOpen(false)}
          />
          <div className="product-addons__info-dialog product-addons__media-dialog">
            <div className="product-addons__info-dialog-header">
              <h5 className="product-addons__info-title">{option.title}</h5>
              <button
                type="button"
                className="product-addons__info-close"
                aria-label={`Close ${option.title} image preview`}
                onClick={() => setIsImageOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="product-addons__info-image-wrap">
              <Image
                src={option.image}
                alt={option.title}
                width={1200}
                height={1200}
                className="product-addons__info-image"
                style={{ width: "100%", height: "auto", objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function getGroupDescription(group: ProductAddOnGroup): string {
  if (group.kind === "upgrade") {
    return "A few thoughtful upgrades can make the finished setup work even harder.";
  }

  return "Choose the finishing touches that help this display feel complete from day one.";
}

function getGroupSelectionSummary(
  group: ProductAddOnGroup,
  selections: ProductAddOnSelection[],
): string {
  const subgroupIds = new Set((group.subgroups ?? []).map((subgroup) => subgroup.id));
  const matchingSelections = selections.filter((selection) => {
    if (selection.groupId !== group.id) {
      return false;
    }

    return subgroupIds.size > 0
      ? subgroupIds.has(selection.subgroupId ?? "")
      : !selection.subgroupId;
  });

  if (!matchingSelections.length) {
    return "Nothing selected yet";
  }

  return `${matchingSelections.length} ${matchingSelections.length === 1 ? "pick" : "picks"} ready`;
}

function buildGuidedConfiguratorModel(
  title: string,
  options: ProductAddOnOption[],
): GuidedConfiguratorModel {
  const parsedChoices = options.map((option) => parseGuidedOption(title, option));
  const sizedChoices = parsedChoices.filter(
    (choice) => choice.sizeKey && choice.sizeLabel,
  );

  if (sizedChoices.length === parsedChoices.length) {
    const sizeMap = new Map<string, GuidedOption[]>();

    for (const choice of sizedChoices) {
      const key = choice.sizeKey ?? "";
      const existing = sizeMap.get(key) ?? [];
      existing.push(choice);
      sizeMap.set(key, existing);
    }

    if (sizeMap.size >= 2) {
      return {
        kind: "size-and-choice",
        sizes: [...sizeMap.entries()].map(([key, entries]) => ({
          key,
          label: entries[0]?.sizeLabel ?? key,
        })),
        choicesBySize: sizeMap,
        allChoices: parsedChoices,
      };
    }
  }

  return {
    kind: "choice-only",
    allChoices: parsedChoices,
  };
}

function parseGuidedOption(
  sectionTitle: string,
  option: ProductAddOnOption,
): GuidedOption {
  const sizeData = extractLeadingSize(option.title);
  const withoutSize = sizeData
    ? option.title.slice(sizeData.raw.length).trim()
    : option.title.trim();
  const cleanedChoice = cleanChoiceLabel(withoutSize, sectionTitle) || option.title;

  return {
    option,
    ...(sizeData
      ? {
          sizeKey: sizeData.key,
          sizeLabel: sizeData.label,
        }
      : {}),
    choiceLabel: cleanedChoice,
    choiceHint: getOptionHint(option.title, sectionTitle),
  };
}

function extractLeadingSize(title: string) {
  const dimensionalMatch = title.match(
    /^\s*(\d+(?:\.\d+)?'\s*x\s*\d+(?:\.\d+)?'?)/i,
  );
  if (dimensionalMatch) {
    const normalized = dimensionalMatch[1].replace(/\s+/g, "");
    return {
      raw: dimensionalMatch[0],
      key: normalized.toLowerCase(),
      label: normalized,
    };
  }

  const linearMatch = title.match(/^\s*(\d+(?:\.\d+)?\s*(?:ft|feet|foot|'))\b/i);
  if (linearMatch) {
    const normalized = linearMatch[1].replace(/\s+/g, "");
    return {
      raw: linearMatch[0],
      key: normalized.toLowerCase(),
      label: normalized,
    };
  }

  return null;
}

function cleanChoiceLabel(value: string, sectionTitle: string): string {
  let normalized = value.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return "";
  }

  const sectionWords = sectionTitle
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  for (const word of sectionWords) {
    if (word.length < 4) {
      continue;
    }

    normalized = normalized.replace(
      new RegExp(`\\b${escapeRegExp(word)}\\b`, "gi"),
      "",
    );
  }

  if (/flag/i.test(sectionTitle)) {
    normalized = normalized.replace(/\bflags?\b/gi, "");
  }

  normalized = normalized
    .replace(/\bw\//gi, "with ")
    .replace(/\s{2,}/g, " ")
    .replace(/^[\s\-–,:]+|[\s\-–,:]+$/g, "")
    .trim();

  return normalized || value.trim();
}

function getConfiguratorIntroCopy(title: string, optionCount: number): string {
  if (/table cover/i.test(title)) {
    return "Pick the table size first, then the finish that best suits your display.";
  }

  if (/flag/i.test(title)) {
    return "Choose the flag size, then the setup style that feels right for your event footprint.";
  }

  if (/wall/i.test(title)) {
    return "A wall upgrade can add branding, privacy, or a little extra weather confidence.";
  }

  if (/sandbag|ballast/i.test(title)) {
    return "A simple stability add-on that keeps the setup feeling properly grounded.";
  }

  return optionCount > 1
    ? "Choose the version that fits your setup best, then confirm the quantity."
    : "A thoughtful finishing touch, if you would like to include it.";
}

function getSizePromptCopy(title: string): string {
  if (/table cover/i.test(title)) {
    return "Start with the table size.";
  }

  if (/flag/i.test(title)) {
    return "Choose the flag size.";
  }

  return "Choose the size that fits your setup.";
}

function getChoicePromptCopy(title: string): string {
  if (/table cover/i.test(title)) {
    return "Now pick the cover style.";
  }

  if (/flag/i.test(title)) {
    return "Now choose the flag style.";
  }

  if (/wall/i.test(title)) {
    return "Choose the wall option you would like to add.";
  }

  return "Choose the option you would like to include.";
}

function getQuantityPromptCopy(title: string): string {
  if (/table cover/i.test(title)) {
    return "How many table covers should we add?";
  }

  if (/flag/i.test(title)) {
    return "How many flag sets should we include?";
  }

  if (/wall/i.test(title)) {
    return "How many wall panels would you like?";
  }

  if (/sandbag|ballast/i.test(title)) {
    return "How many ballast kits do you need?";
  }

  return "How many would you like?";
}

function getOptionHint(optionTitle: string, sectionTitle: string): string {
  const normalized = optionTitle.toLowerCase();

  if (normalized.includes("stretch")) {
    return "Smooth, snug, and show-floor ready.";
  }

  if (normalized.includes("fitted")) {
    return "Tailored corners with a crisp professional look.";
  }

  if (normalized.includes("draped")) {
    return "Classic full drop styling with an easy, elegant finish.";
  }

  if (normalized.includes("mounted")) {
    return "A tidy mounted setup that keeps the footprint light.";
  }

  if (normalized.includes("stand alone")) {
    return "Ideal when the flag needs to stand proudly on its own.";
  }

  if (normalized.includes("cross base")) {
    return "A dependable choice for flat surfaces and quick placement.";
  }

  if (normalized.includes("spike base")) {
    return "Best suited for grass, soil, and other soft ground.";
  }

  if (normalized.includes("mounting kit")) {
    return "Made for neat attachment to a canopy frame or fixed surface.";
  }

  if (normalized.includes("double sided")) {
    return "Adds branding on both sides for an even more polished finish.";
  }

  if (/sandbag|ballast/i.test(normalized)) {
    return "An easy way to add ballast and a little peace of mind.";
  }

  if (/flag/i.test(sectionTitle)) {
    return "A strong visibility play for busy show floors and outdoor setups.";
  }

  if (/table cover/i.test(sectionTitle)) {
    return "Pairs cleanly with the main build and keeps the presentation cohesive.";
  }

  return "A practical finishing touch that complements the main product.";
}

function selectSingleSelection(
  selections: ProductAddOnSelection[],
  group: ProductAddOnGroup,
  option: ProductAddOnOption,
  subgroup?: ProductAddOnSubgroup,
): ProductAddOnSelection[] {
  const nextSelections = clearSelection(selections, group.id, subgroup?.id);

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

function clearSelection(
  selections: ProductAddOnSelection[],
  groupId: string,
  subgroupId?: string,
): ProductAddOnSelection[] {
  return selections.filter(
    (selection) =>
      selection.groupId !== groupId ||
      (selection.subgroupId ?? "") !== (subgroupId ?? ""),
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
  const allowsQuantity = option.allowsQuantity !== false;
  const metaText = option.hoverDescription
    ?.replace(/\s*[·-]\s*Conditional on source\b/gi, "")
    ?.replace(/\s*[·-]\s*\(\+\s*\$[\d,]+(?:\.\d{2})?\)\s*$/i, "")
    ?.trim();
  const priceLabel =
    option.price.label ||
    (option.price.surcharge > 0
      ? `(+ ${formatPrice(option.price.surcharge)})`
      : "Included");
  const titleParts = [option.hoverTitle || option.title, metaText].filter(Boolean);
  const [isImageOpen, setIsImageOpen] = useState(false);

  return (
    <div className={`product-addon-card${isSelected ? " is-selected" : ""}`}>
      <div className="product-addon-card__media">
        {isSelected ? (
          <span className="product-addon-card__selected-badge" aria-hidden>
            ✓
          </span>
        ) : null}
        {option.image ? (
          <button
            type="button"
            className="product-addon-card__image-button"
            onClick={() => setIsImageOpen(true)}
            aria-label={`Open ${option.title} image`}
          >
            <div className="product-addon-card__image">
              <Image
                src={option.image}
                alt={option.title}
                fill
                sizes="64px"
                style={{ objectFit: "cover" }}
              />
            </div>
          </button>
        ) : (
          <div className="product-addon-card__image">
            <span className="product-addon-card__image-fallback">
              {subgroup?.title || group.title}
            </span>
          </div>
        )}
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={isSelected}
          title={titleParts.join(" | ")}
          className="product-addon-card__toggle"
        >
          <div className="product-addon-card__content">
            <div className="product-addon-card__body">
              <div className="product-addon-card__title-row">
                <span className="product-addon-card__title">{option.title}</span>
              </div>
            </div>
            <div className="product-addon-card__footer">
              <span className="product-addon-card__unit-price">{priceLabel}</span>
            </div>
          </div>
        </button>
      </div>

      {isImageOpen ? (
        <div
          className="product-addons__info-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`${option.title} image preview`}
        >
          <button
            type="button"
            className="product-addons__info-backdrop"
            aria-label={`Close ${option.title} image preview`}
            onClick={() => setIsImageOpen(false)}
          />
          <div className="product-addons__info-dialog product-addons__media-dialog">
            <div className="product-addons__info-dialog-header">
              <h5 className="product-addons__info-title">{option.title}</h5>
              <button
                type="button"
                className="product-addons__info-close"
                aria-label={`Close ${option.title} image preview`}
                onClick={() => setIsImageOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="product-addons__info-image-wrap">
              <Image
                src={option.image}
                alt={option.title}
                width={1200}
                height={1200}
                className="product-addons__info-image"
                style={{ width: "100%", height: "auto", objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      ) : null}

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

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
