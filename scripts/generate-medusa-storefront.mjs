import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const outputPath = path.join(
  repoRoot,
  "data/inventory/notionworx/storefront.generated.ts",
);
const manifestPath = path.join(
  repoRoot,
  "data/inventory/notionworx/manifest.json",
);

function readJson(absolutePath) {
  return JSON.parse(readFileSync(absolutePath, "utf8"));
}

function getRequiredEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required to generate the Medusa storefront snapshot.`);
  }
  return value;
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeImageUrl(value) {
  const normalized = normalizeString(value);
  return normalized || undefined;
}

function readInventoryCategoryImage(metadata) {
  const inventoryDataPath = readMetadataString(metadata, ["inventory_data_path"]);
  if (!inventoryDataPath) {
    return undefined;
  }

  const absolutePath = path.join(repoRoot, inventoryDataPath.replace(/^\/+/, ""));
  try {
    const inventoryCategory = readJson(absolutePath);
    return normalizeImageUrl(inventoryCategory?.image?.localPath);
  } catch {
    return undefined;
  }
}

function readMetadataRecord(metadata, key) {
  const value = metadata?.[key];
  return value && typeof value === "object" && !Array.isArray(value) ? value : undefined;
}

function readMetadataRecordArray(metadata, key) {
  const value = metadata?.[key];
  return Array.isArray(value)
    ? value.filter((entry) => entry && typeof entry === "object" && !Array.isArray(entry))
    : [];
}

function readMetadataString(metadata, keys) {
  for (const key of keys) {
    const value = metadata?.[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
}

function readMetadataStringArray(metadata, keys) {
  for (const key of keys) {
    const value = metadata?.[key];
    if (Array.isArray(value)) {
      return value
        .filter((entry) => typeof entry === "string")
        .map((entry) => entry.trim())
        .filter(Boolean);
    }
  }
  return [];
}

function readMetadataBoolean(metadata, keys) {
  for (const key of keys) {
    const value = metadata?.[key];
    if (typeof value === "boolean") {
      return value;
    }
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (normalized === "true") {
        return true;
      }
      if (normalized === "false") {
        return false;
      }
    }
  }
  return undefined;
}

function readMetadataRecordArrayByKeys(metadata, keys) {
  for (const key of keys) {
    const value = metadata?.[key];
    if (Array.isArray(value)) {
      return value.filter((entry) => entry && typeof entry === "object" && !Array.isArray(entry));
    }
  }
  return [];
}

function buildFallbackAddOnLinksFromProductIds(metadata, addOnProductsById) {
  const buildLinksForKind = (kind, keys) =>
    readMetadataStringArray(metadata, keys).flatMap((productId) => {
      const linkedProduct = addOnProductsById.get(productId);
      if (!linkedProduct) {
        return [];
      }

      const linkedMetadata = linkedProduct.metadata ?? {};
      const subgroupTitle =
        readMetadataStringArray(linkedMetadata, [
          "source_add_on_subgroup_titles",
          "sourceAddOnSubgroupTitles",
        ])[0] || undefined;
      const optionId =
        readMetadataString(linkedMetadata, [
          "source_add_on_option_id",
          "sourceAddOnOptionId",
        ]) ||
        normalizeString(linkedProduct.handle) ||
        productId;

      return [
        {
          kind,
          group_id: kind === "upgrade" ? "upgrades" : "accessories",
          group_title: kind === "upgrade" ? "Upgrades" : "Accessories",
          subgroup_title: subgroupTitle,
          add_on_id: optionId,
          title: normalizeString(linkedProduct.title) || undefined,
          handle: normalizeString(linkedProduct.handle) || undefined,
          sku: normalizeString(linkedProduct?.variants?.[0]?.sku) || undefined,
          medusa_product_id: productId,
          medusa_variant_id: normalizeString(linkedProduct?.variants?.[0]?.id) || undefined,
          allows_quantity: readMetadataBoolean(linkedMetadata, [
            "source_add_on_allows_quantity",
            "sourceAddOnAllowsQuantity",
          ]),
          min_quantity: readMetadataNumber(linkedMetadata, [
            "source_add_on_min_quantity",
            "sourceAddOnMinQuantity",
          ]),
          step: readMetadataNumber(linkedMetadata, [
            "source_add_on_step",
            "sourceAddOnStep",
          ]),
          surcharge: readMetadataNumber(linkedMetadata, [
            "source_add_on_price_surcharge",
            "sourceAddOnPriceSurcharge",
          ]),
        },
      ];
    });

  return [
    ...buildLinksForKind("accessory", [
      "source_accessory_product_ids",
      "sourceAccessoryProductIds",
    ]),
    ...buildLinksForKind("upgrade", [
      "source_upgrade_product_ids",
      "sourceUpgradeProductIds",
    ]),
  ];
}

function firstNonEmptyArray(...candidates) {
  for (const candidate of candidates) {
    if (Array.isArray(candidate) && candidate.length > 0) {
      return candidate;
    }
  }
  return [];
}

function readMetadataNumber(metadata, keys) {
  for (const key of keys) {
    const value = metadata?.[key];
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === "string" && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }
  return undefined;
}

function readPriceAmount(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value > 1000 ? value / 100 : value;
  }
  return undefined;
}

function firstDefined(values) {
  return values.find((value) => value != null);
}

function buildAddOnProductLinkKey(groupId, addOnId, subgroupId) {
  return `${groupId}::${subgroupId || ""}::${addOnId}`;
}

function readAddOnLinkString(record, keys) {
  for (const key of keys) {
    const value = record?.[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
}

function readAddOnLinkNumber(record, keys) {
  for (const key of keys) {
    const value = record?.[key];
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === "string" && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }
  return undefined;
}

function readAddOnLinkBoolean(record, keys) {
  for (const key of keys) {
    const value = record?.[key];
    if (typeof value === "boolean") {
      return value;
    }
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (normalized === "true") {
        return true;
      }
      if (normalized === "false") {
        return false;
      }
    }
  }
  return undefined;
}

function normalizeAddOnSelectionMode(value) {
  const normalized = normalizeString(value).toLowerCase();
  return normalized === "single" || normalized === "multiple" ? normalized : undefined;
}

function isStandaloneAddOnProduct(product) {
  const metadata = product?.metadata ?? {};
  return (
    readMetadataBoolean(metadata, ["is_add_on_product", "isAddOnProduct"]) === true ||
    readMetadataString(metadata, ["source"]) === "notionworx-shared-addon" ||
    Boolean(readMetadataString(metadata, ["source_add_on_option_id", "sourceAddOnOptionId"]))
  );
}

function resolveLinkedAddOnProduct(link, addOnProductsById, addOnProductsByHandle) {
  const medusaProductId = readAddOnLinkString(link, ["medusa_product_id", "medusaProductId"]);
  if (medusaProductId && addOnProductsById.has(medusaProductId)) {
    return addOnProductsById.get(medusaProductId);
  }
  const handle = readAddOnLinkString(link, ["handle"]);
  if (handle && addOnProductsByHandle.has(handle)) {
    return addOnProductsByHandle.get(handle);
  }
  return undefined;
}

function buildAddOnOptionFromLink(link, addOnProductsById, addOnProductsByHandle) {
  const linkedProduct = resolveLinkedAddOnProduct(link, addOnProductsById, addOnProductsByHandle);
  const linkedMetadata = linkedProduct?.metadata ?? {};
  const linkedVariant = linkedProduct?.variants?.[0];
  const linkedMedusaProductId =
    normalizeString(linkedProduct?.id) ||
    readAddOnLinkString(link, ["medusa_product_id", "medusaProductId"]);
  const linkedMedusaVariantId =
    normalizeString(linkedVariant?.id) ||
    readAddOnLinkString(link, ["medusa_variant_id", "medusaVariantId"]);
  const handle = normalizeString(linkedProduct?.handle) || readAddOnLinkString(link, ["handle"]);
  const title = normalizeString(linkedProduct?.title) || readAddOnLinkString(link, ["title"]);
  const addOnId = readAddOnLinkString(link, ["add_on_id", "addOnId"]) || handle;
  if (!addOnId || !title) {
    return null;
  }

  const price =
    readPriceAmount(linkedVariant?.prices?.[0]?.amount) ||
    readAddOnLinkNumber(link, ["surcharge"]) ||
    readMetadataNumber(linkedMetadata, [
      "source_add_on_price_surcharge",
      "sourceAddOnPriceSurcharge",
    ]);
  if (typeof price !== "number") {
    return null;
  }

  const subgroupTitle = readAddOnLinkString(link, ["subgroup_title", "subgroupTitle"]);
  const groupTitle = readAddOnLinkString(link, ["group_title", "groupTitle"]);
  const hoverDescription =
    readAddOnLinkString(link, ["hover_description", "hoverDescription"]) ||
    [subgroupTitle || groupTitle, `(+ $${price.toFixed(2)})`].filter(Boolean).join(" · ");
  const linkedSourceProductId = readAddOnLinkNumber(link, [
    "linked_source_product_id",
    "linkedSourceProductId",
  ]);
  const linkedStorefrontProductId = readAddOnLinkNumber(link, [
    "linked_storefront_product_id",
    "linkedStorefrontProductId",
  ]);
  const allowsQuantity =
    readAddOnLinkBoolean(link, ["allows_quantity", "allowsQuantity"]) ??
    readMetadataBoolean(linkedMetadata, [
      "source_add_on_allows_quantity",
      "sourceAddOnAllowsQuantity",
    ]);
  const minQuantity =
    readAddOnLinkNumber(link, ["min_quantity", "minQuantity"]) ??
    readMetadataNumber(linkedMetadata, ["source_add_on_min_quantity", "sourceAddOnMinQuantity"]);
  const maxQuantity = readAddOnLinkNumber(link, ["max_quantity", "maxQuantity"]);
  const step =
    readAddOnLinkNumber(link, ["step"]) ??
    readMetadataNumber(linkedMetadata, ["source_add_on_step", "sourceAddOnStep"]);

  return {
    id: addOnId,
    kind:
      normalizeString(readAddOnLinkString(link, ["kind"])).toLowerCase() === "upgrade"
        ? "upgrade"
        : "accessory",
    title,
    ...(handle ? { handle } : {}),
    ...(linkedMedusaProductId ? { linkedMedusaProductId } : {}),
    ...(linkedMedusaVariantId ? { linkedMedusaVariantId } : {}),
    ...(typeof linkedSourceProductId === "number" ? { linkedSourceProductId } : {}),
    ...(typeof linkedStorefrontProductId === "number"
      ? { linkedStorefrontProductId }
      : {}),
    ...(normalizeString(linkedVariant?.sku) ? { sku: normalizeString(linkedVariant?.sku) } : {}),
    ...(normalizeImageUrl(linkedProduct?.thumbnail) ? { image: normalizeImageUrl(linkedProduct?.thumbnail) } : {}),
    ...(hoverDescription ? { hoverDescription } : {}),
    price: {
      surcharge: price,
      label: `(+ $${price.toFixed(2)})`,
    },
    ...(typeof allowsQuantity === "boolean" ? { allowsQuantity } : {}),
    ...(typeof minQuantity === "number" ? { minQuantity } : {}),
    ...(typeof maxQuantity === "number" ? { maxQuantity } : {}),
    ...(typeof step === "number" ? { step } : {}),
  };
}

function buildAddOnGroupsFromLinks(metadata, addOnProductsById, addOnProductsByHandle) {
  const explicitLinks = readMetadataRecordArrayByKeys(metadata, [
    "source_add_on_product_links",
    "sourceAddOnProductLinks",
  ]);
  const links =
    explicitLinks.length > 0
      ? explicitLinks
      : buildFallbackAddOnLinksFromProductIds(metadata, addOnProductsById);
  if (!links.length) {
    return undefined;
  }

  const groups = new Map();
  for (const link of links) {
    const kind =
      normalizeString(readAddOnLinkString(link, ["kind"])).toLowerCase() === "upgrade"
        ? "upgrade"
        : "accessory";
    const groupId = readAddOnLinkString(link, ["group_id", "groupId"]) || kind;
    const groupTitle =
      readAddOnLinkString(link, ["group_title", "groupTitle"]) ||
      (kind === "upgrade" ? "Upgrades" : "Accessories");
    const groupKey = `${kind}:${groupId}`;
    const option = buildAddOnOptionFromLink(link, addOnProductsById, addOnProductsByHandle);
    if (!option) {
      continue;
    }

    if (!groups.has(groupKey)) {
      groups.set(groupKey, {
        id: groupId,
        kind,
        title: groupTitle,
        displayStyle: "grid",
        ...(normalizeAddOnSelectionMode(
          readAddOnLinkString(link, ["group_selection_mode", "groupSelectionMode"]),
        )
          ? {
              selectionMode: normalizeAddOnSelectionMode(
                readAddOnLinkString(link, ["group_selection_mode", "groupSelectionMode"]),
              ),
            }
          : {}),
        ...(typeof readAddOnLinkNumber(link, ["group_max_selections", "groupMaxSelections"]) ===
        "number"
          ? {
              maxSelections: readAddOnLinkNumber(link, [
                "group_max_selections",
                "groupMaxSelections",
              ]),
            }
          : {}),
        items: [],
        subgroups: [],
        _subgroupsByKey: new Map(),
      });
    }

    const group = groups.get(groupKey);
    const subgroupId = readAddOnLinkString(link, ["subgroup_id", "subgroupId"]);
    const subgroupTitle = readAddOnLinkString(link, ["subgroup_title", "subgroupTitle"]);
    if (subgroupId || subgroupTitle) {
      const subgroupKey = subgroupId || subgroupTitle || option.id;
      if (!group._subgroupsByKey.has(subgroupKey)) {
        const subgroup = {
          id: subgroupId || subgroupKey,
          title: subgroupTitle || groupTitle,
          ...(normalizeAddOnSelectionMode(
            readAddOnLinkString(link, ["subgroup_selection_mode", "subgroupSelectionMode"]),
          )
            ? {
                selectionMode: normalizeAddOnSelectionMode(
                  readAddOnLinkString(link, ["subgroup_selection_mode", "subgroupSelectionMode"]),
                ),
              }
            : {}),
          ...(typeof readAddOnLinkNumber(link, [
            "subgroup_max_selections",
            "subgroupMaxSelections",
          ]) === "number"
            ? {
                maxSelections: readAddOnLinkNumber(link, [
                  "subgroup_max_selections",
                  "subgroupMaxSelections",
                ]),
              }
            : {}),
          items: [],
        };
        group._subgroupsByKey.set(subgroupKey, subgroup);
        group.subgroups.push(subgroup);
      }
      group._subgroupsByKey.get(subgroupKey).items.push(option);
      continue;
    }

    group.items.push(option);
  }

  return [...groups.values()]
    .map(({ _subgroupsByKey, ...group }) => ({
      ...group,
      ...(group.items.length ? { items: group.items } : {}),
      ...(group.subgroups.length ? { subgroups: group.subgroups } : {}),
    }))
    .filter((group) => (group.items?.length || 0) > 0 || (group.subgroups?.length || 0) > 0);
}

function isDefaultVariantValue(value) {
  const normalized = normalizeString(value).toLowerCase();
  return (
    !normalized ||
    normalized === "default option" ||
    normalized === "default title" ||
    normalized === "default variant" ||
    normalized === "title"
  );
}

function buildSizeVariants(metadata, variants) {
  const sourceVariants =
    readMetadataRecordArray(metadata, "source_variants") ||
    readMetadataRecordArray(variants?.[0]?.metadata, "source_variants");

  if (sourceVariants.length > 0) {
    const entries = sourceVariants
      .map((variant, index) => {
        const title = normalizeString(variant.title);
        const price = readPriceAmount(variant.price);
        const compareAtPrice = readPriceAmount(variant.compareAtPrice);
        if (!title || typeof price !== "number") {
          return null;
        }
        return {
          value: title,
          price,
          ...(typeof compareAtPrice === "number" && compareAtPrice > price
            ? { compareAtPrice }
            : {}),
          ...(index === 0 ? { active: true } : {}),
        };
      })
      .filter(Boolean);
    if (entries.length === 1 && isDefaultVariantValue(entries[0]?.value)) {
      return [];
    }
    return entries;
  }

  const options =
    readMetadataRecordArray(metadata, "source_options") ||
    readMetadataRecordArray(variants?.[0]?.metadata, "source_options");
  const option = options.find((entry) => Array.isArray(entry.values) && entry.values.length > 0);

  if (!option) {
    return [];
  }

  const values = option.values
    .filter((entry) => typeof entry === "string" && entry.trim())
    .map((entry) => entry.trim());

  if (values.length === 0 || (values.length === 1 && isDefaultVariantValue(values[0]))) {
    return [];
  }

  const fallbackPrice = readMetadataNumber(readMetadataRecord(metadata, "source_price"), ["min"]);
  return values.map((value, index) => ({
    value,
    ...(typeof fallbackPrice === "number" ? { price: fallbackPrice } : {}),
    ...(index === 0 ? { active: true } : {}),
  }));
}

function buildProduct(product, addOnProductsById, addOnProductsByHandle, orderIndexByHandle) {
  const metadata = product.metadata ?? {};
  const handle =
    readMetadataString(metadata, ["source_handle", "sourceHandle"]) ??
    normalizeString(product.handle);
  if (!handle) {
    return null;
  }

  const sourcePrice = readMetadataRecord(metadata, "source_price");
  const sizeVariants = buildSizeVariants(metadata, product.variants ?? []);
  const sizes = sizeVariants.map((variant) => variant.value);
  const primaryVariant = product.variants?.[0];
  const productTags = Array.isArray(product.tags)
    ? product.tags
        .map((tag) =>
          typeof tag === "string" ? tag : normalizeString(tag?.value),
        )
        .filter(Boolean)
    : [];
  const sourceCategoryTitles = [
    ...readMetadataRecordArray(metadata, "source_categories")
      .map((category) => normalizeString(category?.title))
      .filter(Boolean),
    ...readMetadataStringArray(metadata, ["source_category_titles"]),
  ];
  const medusaCategoryTitles = Array.isArray(product.categories)
    ? product.categories
        .map((category) => normalizeString(category?.name))
        .filter(Boolean)
    : [];
  const filterCategory = firstNonEmptyArray(
    sourceCategoryTitles,
    medusaCategoryTitles,
    [normalizeString(product.collection?.title)].filter(Boolean),
  );
  const images = (product.images ?? [])
    .map((image) => normalizeImageUrl(image?.url))
    .filter(Boolean)
    .map((src) => ({ src }));
  const primaryImage =
    images[0]?.src ??
    normalizeImageUrl(product.thumbnail) ??
    "/assets/images/shop/product-placeholder.jpg";
  const imageUrls = primaryImage && images.length === 0 ? [{ src: primaryImage }] : images;
  const price = firstDefined([
    readMetadataNumber(sourcePrice, ["min"]),
    typeof sizeVariants[0]?.price === "number" ? sizeVariants[0].price : undefined,
    readPriceAmount(primaryVariant?.prices?.[0]?.amount),
  ]) ?? 0;
  const priceOld = firstDefined([
    readMetadataNumber(sourcePrice, ["compareAtPrice", "compare_at_price", "max"]),
    typeof sizeVariants[0]?.compareAtPrice === "number"
      ? sizeVariants[0].compareAtPrice
      : undefined,
  ]);
  const descriptionText =
    readMetadataString(metadata, ["description_text", "descriptionText"]) ??
    normalizeString(product.description);
  const addOnGroups = buildAddOnGroupsFromLinks(
    metadata,
    addOnProductsById,
    addOnProductsByHandle,
  );
  const sourceVariants =
    readMetadataRecordArray(metadata, "source_variants") ||
    readMetadataRecordArray(primaryVariant?.metadata, "source_variants");
  const sku =
    (
      sourceVariants
        .map((variant) => normalizeString(variant.sku))
        .find((value) => value && value.toLowerCase() !== "none") ??
      normalizeString(primaryVariant?.sku)
    ) || undefined;
  const inStock =
    sourceVariants.length > 0
      ? sourceVariants.some((variant) => variant.available !== false)
      : true;
  const orderIndex = orderIndexByHandle.get(handle) ?? Number.MAX_SAFE_INTEGER;

  return {
    id:
      readMetadataNumber(metadata, ["source_product_id", "sourceProductId"]) ??
      orderIndex + 1,
    sourceProductId: readMetadataNumber(metadata, [
      "source_product_id",
      "sourceProductId",
    ]),
    sourceHandle: handle,
    sourceSlug:
      readMetadataString(metadata, ["source_slug", "sourceSlug"]) ?? handle,
    img: primaryImage,
    ...(imageUrls[1]?.src ? { imgHover: imageUrls[1].src } : {}),
    images: imageUrls,
    name: normalizeString(product.title) || handle,
    price,
    ...(typeof priceOld === "number" && priceOld > price ? { priceOld } : {}),
    ...(sizes.length > 0 ? { sizes } : {}),
    ...(sizeVariants.length > 0 ? { sizeVariants } : {}),
    ...(readMetadataString(metadata, ["source_variant_label", "sourceVariantLabel"])
      ? {
          variantLabel: readMetadataString(metadata, [
            "source_variant_label",
            "sourceVariantLabel",
          ]),
        }
      : {}),
    cardVariant: "",
    filterBrands: [
      readMetadataString(metadata, ["source_vendor", "sourceVendor"]) ?? "Notion Worx",
    ],
    filterCategory,
    filterColor: [],
    filterSizes: sizes,
    tags: firstNonEmptyArray(
      readMetadataStringArray(metadata, ["source_tags", "tags"]),
      productTags,
    ),
    rating: 0,
    inStock,
    isStockOut: !inStock,
    services: [],
    category: filterCategory[0] ?? normalizeString(product.collection?.title),
    description: descriptionText,
    ...(readMetadataString(metadata, ["description_html", "descriptionHtml"])
      ? {
          descriptionHtml: readMetadataString(metadata, [
            "description_html",
            "descriptionHtml",
          ]),
        }
      : {}),
    ...(descriptionText ? { descriptionText } : {}),
    ...(readMetadataString(metadata, ["dimensions_html", "dimensionsHtml"])
      ? {
          dimensionsHtml: readMetadataString(metadata, [
            "dimensions_html",
            "dimensionsHtml",
          ]),
        }
      : {}),
    ...(readMetadataString(metadata, ["dimensions_text", "dimensionsText"])
      ? {
          dimensionsText: readMetadataString(metadata, [
            "dimensions_text",
            "dimensionsText",
          ]),
        }
      : {}),
    ...(readMetadataString(metadata, ["warranty_html", "warrantyHtml"])
      ? {
          warrantyHtml: readMetadataString(metadata, [
            "warranty_html",
            "warrantyHtml",
          ]),
        }
      : {}),
    ...(readMetadataString(metadata, ["warranty_text", "warrantyText"])
      ? {
          warrantyText: readMetadataString(metadata, [
            "warranty_text",
            "warrantyText",
          ]),
        }
      : {}),
    ...(readMetadataString(metadata, ["how_to_order_html", "howToOrderHtml"])
      ? {
          howToOrderHtml: readMetadataString(metadata, [
            "how_to_order_html",
            "howToOrderHtml",
          ]),
        }
      : {}),
    ...(readMetadataString(metadata, ["how_to_order_text", "howToOrderText"])
      ? {
          howToOrderText: readMetadataString(metadata, [
            "how_to_order_text",
            "howToOrderText",
          ]),
        }
      : {}),
    ...(sku ? { sku } : {}),
    ...(addOnGroups?.length ? { addOnGroups } : {}),
    badgeLabel: filterCategory[0] ?? undefined,
    badgeSubtext: `${imageUrls.length} product image${imageUrls.length === 1 ? "" : "s"} available`,
  };
}

function productMatchesCategory(product, category, categoryTitle) {
  const metadata = product.metadata ?? {};
  const categoryHandle = normalizeString(category.handle);
  const normalizedCategoryTitle = normalizeString(categoryTitle);

  const sourceCategoryRecords = readMetadataRecordArray(metadata, "source_categories");
  const sourceCategoryHandles = sourceCategoryRecords
    .map((category) => normalizeString(category?.handle))
    .filter(Boolean);
  if (sourceCategoryHandles.includes(categoryHandle)) {
    return true;
  }

  const sourceCategoryTitles = new Set([
    ...sourceCategoryRecords
      .map((category) => normalizeString(category?.title))
      .filter(Boolean),
    ...readMetadataStringArray(metadata, ["source_category_titles"]),
  ]);
  if (sourceCategoryTitles.has(normalizedCategoryTitle)) {
    return true;
  }

  const medusaCategoryHandles = Array.isArray(product.categories)
    ? product.categories
        .map((category) => normalizeString(category?.handle))
        .filter(Boolean)
    : [];
  if (medusaCategoryHandles.includes(categoryHandle)) {
    return true;
  }

  const medusaCategoryTitles = Array.isArray(product.categories)
    ? product.categories
        .map((category) => normalizeString(category?.name))
        .filter(Boolean)
    : [];
  return medusaCategoryTitles.includes(normalizedCategoryTitle);
}

async function fetchPaginated(pathname, headers, key) {
  const baseUrl = getRequiredEnv("MEDUSA_BACKEND_URL").replace(/\/+$/, "");
  const records = [];
  let offset = 0;
  const limit = 250;

  while (true) {
    const separator = pathname.includes("?") ? "&" : "?";
    const response = await fetch(
      `${baseUrl}${pathname}${separator}limit=${limit}&offset=${offset}`,
      { headers },
    );

    if (!response.ok) {
      throw new Error(`${pathname} failed with ${response.status}`);
    }

    const payload = await response.json();
    const page = Array.isArray(payload[key]) ? payload[key] : [];
    if (page.length === 0) {
      break;
    }

    records.push(...page);
    offset += page.length;

    if (typeof payload.count === "number" && offset >= payload.count) {
      break;
    }
  }

  return records;
}

async function main() {
  const adminApiKey = getRequiredEnv("MEDUSA_ADMIN_API_KEY");
  const productCategories = await fetchPaginated(
    "/admin/product-categories",
    {
      Authorization: `Basic ${adminApiKey}`,
      Accept: "application/json",
    },
    "product_categories",
  );
  const products = await fetchPaginated(
    "/admin/products?fields=*categories",
    {
      Authorization: `Basic ${adminApiKey}`,
      Accept: "application/json",
    },
    "products",
  );

  const manifest = readJson(manifestPath);
  const addOnProducts = products.filter((product) => isStandaloneAddOnProduct(product));
  const addOnProductsById = new Map(
    addOnProducts
      .filter((product) => normalizeString(product.id))
      .map((product) => [normalizeString(product.id), product]),
  );
  const addOnProductsByHandle = new Map(
    addOnProducts
      .filter((product) => normalizeString(product.handle))
      .map((product) => [normalizeString(product.handle), product]),
  );
  const orderIndexByHandle = new Map(
    (manifest.products ?? [])
      .filter((record) => typeof record.handle === "string" && record.handle.trim())
      .map((record, index) => [record.handle.trim(), index]),
  );

  const storefrontProducts = products
    .filter((product) => !isStandaloneAddOnProduct(product))
    .map((product) =>
      buildProduct(product, addOnProductsById, addOnProductsByHandle, orderIndexByHandle),
    )
    .filter(Boolean)
    .sort((left, right) => {
      const leftIndex = orderIndexByHandle.get(left.sourceHandle) ?? Number.MAX_SAFE_INTEGER;
      const rightIndex = orderIndexByHandle.get(right.sourceHandle) ?? Number.MAX_SAFE_INTEGER;
      if (leftIndex !== rightIndex) {
        return leftIndex - rightIndex;
      }
      return left.name.localeCompare(right.name);
    });
  const storefrontProductsByHandle = new Map(
    storefrontProducts.map((product) => [product.sourceHandle, product]),
  );

  const storefrontCategories = productCategories
    .map((category) => {
      const title =
        readMetadataString(category.metadata, ["source_title", "title"]) ??
        normalizeString(category.name);
      if (!title) {
        return null;
      }

      const categoryProducts = products.filter((product) =>
        productMatchesCategory(product, category, title),
      );
      const matchingProductImage = categoryProducts
        .map((product) => storefrontProductsByHandle.get(normalizeString(product.handle)))
        .find(Boolean)?.img;
      const sourceImageUrl = readMetadataString(category.metadata, [
        "source_image_url",
        "image_url",
        "thumbnail",
      ]);
      const localSourceImage = sourceImageUrl?.includes("/assets/")
        ? sourceImageUrl.slice(sourceImageUrl.indexOf("/assets/"))
        : undefined;
      const img =
        matchingProductImage ??
        readInventoryCategoryImage(category.metadata) ??
        localSourceImage ??
        sourceImageUrl;

      return {
        name: title,
        img,
        quantity: `${categoryProducts.length} Product${categoryProducts.length === 1 ? "" : "s"}`,
        href: `/shop-default?category=${encodeURIComponent(title)}`,
      };
    })
    .filter((category) => category && category.img)
    .filter((category) => Number.parseInt(category.quantity, 10) > 0)
    .sort((left, right) => {
      const leftCount = Number.parseInt(left.quantity, 10) || 0;
      const rightCount = Number.parseInt(right.quantity, 10) || 0;
      return rightCount - leftCount;
    });

  const fileContents = `/* This file is generated by scripts/generate-medusa-storefront.mjs. */

export const storefrontProducts = ${JSON.stringify(storefrontProducts, null, 2)} as const;

export const storefrontCategories = ${JSON.stringify(storefrontCategories, null, 2)} as const;

export const storefrontCollectionGalleries = [] as const;
`;

  writeFileSync(outputPath, fileContents);
  console.log(
    `Generated Medusa storefront adapter with ${storefrontProducts.length} products and ${storefrontCategories.length} product categories.`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
