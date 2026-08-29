import "server-only";

import {
  storefrontCategories,
  storefrontProducts,
} from "@/data/inventory/notionworx/storefront.generated";

export const CHATBOT_NAME = "Worxie";
export const CATALOG_REFUSAL_MESSAGE =
  "I can only answer questions grounded in the current Notion Worx site information. I couldn't find enough matching details for that request.";

export type ChatHistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

export type CatalogMatch = {
  id: number;
  name: string;
  url: string;
  category: string;
  categories: string[];
  categoryHref: string | null;
  price: number | null;
  sku: string | null;
  sizes: string[];
  description: string;
  image: string;
  inStock: boolean;
  score: number;
  coverage: number;
};

export type GeneralKnowledgeSnippet = {
  id: string;
  source: string;
  content: string;
  tags: string[];
  score: number;
};

export type CatalogRetrievalResult =
  | {
      ok: true;
      retrievalQuery: string;
      catalogSummary: string[];
      broadCatalogIntent: boolean;
      matches: CatalogMatch[];
    }
  | {
      ok: false;
      retrievalQuery: string;
      catalogSummary: string[];
      broadCatalogIntent: boolean;
      matches: [];
      refusalMessage: string;
    };

type StorefrontCategory = {
  name: string;
  href?: string | null;
  quantity?: string;
};

type StorefrontProduct = {
  id: number;
  img: string;
  name: string;
  price?: number;
  sizes?: readonly string[];
  category?: string;
  filterCategory?: readonly string[];
  description?: string;
  sku?: string;
  inStock?: boolean;
};

type CatalogEntry = {
  id: number;
  name: string;
  url: string;
  category: string;
  categories: string[];
  categoryHref: string | null;
  price: number | null;
  sku: string | null;
  sizes: string[];
  description: string;
  image: string;
  inStock: boolean;
  nameNormalized: string;
  searchText: string;
  nameTokens: Set<string>;
  categoryTokens: Set<string>;
  sizeTokens: Set<string>;
  descriptionTokens: Set<string>;
  skuTokens: Set<string>;
};

type ScoredMatch = CatalogMatch & {
  matchedTokenCount: number;
};

type GeneralKnowledgeEntry = Omit<GeneralKnowledgeSnippet, "score"> & {
  searchText: string;
  tokenSet: Set<string>;
};

const STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "at",
  "be",
  "best",
  "can",
  "custom",
  "do",
  "for",
  "from",
  "get",
  "have",
  "i",
  "in",
  "is",
  "it",
  "kind",
  "me",
  "of",
  "on",
  "or",
  "our",
  "please",
  "price",
  "prices",
  "product",
  "products",
  "show",
  "tell",
  "the",
  "them",
  "to",
  "what",
  "which",
  "with",
  "you",
  "your",
]);

const categoryRecords = storefrontCategories as readonly StorefrontCategory[];
const productRecords = storefrontProducts as unknown as readonly StorefrontProduct[];

const CATEGORY_LINKS = new Map<string, string | null>(
  categoryRecords.map((category) => [category.name, category.href ?? null]),
);

const CATALOG_SUMMARY = categoryRecords
  .map((category) => ({
    name: category.name,
    href: category.href ?? null,
    count: parseCount(category.quantity),
  }))
  .filter((category) => category.count > 0)
  .sort((left, right) => right.count - left.count)
  .map(
    (category) =>
      `${category.name} (${category.count} product${category.count === 1 ? "" : "s"})${category.href ? ` -> ${category.href}` : ""}`,
  );

const CATALOG_ENTRIES: CatalogEntry[] = productRecords.map((product) =>
  buildCatalogEntry(product),
);

const FEATURED_CATEGORY_MATCHES: CatalogMatch[] = buildFeaturedCategoryMatches();

const GENERAL_KNOWLEDGE_ENTRIES: GeneralKnowledgeEntry[] = [
  {
    id: "about-overview",
    source: "About Us",
    content:
      "Notion Worx is a full-service design and branding company specializing in custom canopies, promotional products, apparel, and logo design, with over 800,000 products to choose from.",
    tags: [
      "about",
      "company",
      "business",
      "services",
      "branding",
      "apparel",
      "promotional",
      "products",
    ],
    searchText: "",
    tokenSet: new Set<string>(),
  },
  {
    id: "about-turnaround",
    source: "About Us",
    content:
      "Notion Worx says its team delivers top-quality designs with fast turnaround and competitive pricing.",
    tags: [
      "fast",
      "turnaround",
      "delivery",
      "deliver",
      "shipping",
      "timeline",
      "lead",
      "time",
      "rush",
      "expedite",
      "soon",
      "quick",
    ],
    searchText: "",
    tokenSet: new Set<string>(),
  },
  {
    id: "delivery-testimonial",
    source: "Customer testimonial",
    content:
      "One verified customer said that after final approval they received a tracking number for the frame within 3 days, and the top and sidewalls shipped the following day.",
    tags: [
      "delivery",
      "deliver",
      "shipping",
      "shipped",
      "tracking",
      "approval",
      "timeline",
      "lead",
      "time",
      "turnaround",
    ],
    searchText: "",
    tokenSet: new Set<string>(),
  },
  {
    id: "returns-policy",
    source: "Return policies",
    content:
      "If an order arrives damaged or does not match the approved details, customers should contact Notion Worx so the team can review the issue and help with next steps.",
    tags: [
      "return",
      "returns",
      "refund",
      "exchange",
      "damaged",
      "issue",
      "wrong",
      "mismatch",
      "policy",
    ],
    searchText: "",
    tokenSet: new Set<string>(),
  },
  {
    id: "warranty-policy",
    source: "Product warranty copy",
    content:
      "Notion Worx says its warranty covers factory defects or damage that occurs during shipping, but not damage caused by extreme weather, misuse, or similar circumstances beyond its control.",
    tags: [
      "warranty",
      "damage",
      "shipping",
      "defect",
      "defects",
      "weather",
      "misuse",
      "policy",
    ],
    searchText: "",
    tokenSet: new Set<string>(),
  },
].map((entry) => {
  const searchText = normalizeText(
    [entry.source, entry.content, entry.tags.join(" ")].join(" "),
  );

  return {
    ...entry,
    searchText,
    tokenSet: new Set(tokenize(searchText)),
  };
});

export function retrieveCatalogMatches(input: {
  message: string;
  history?: ChatHistoryMessage[];
}): CatalogRetrievalResult {
  const message = input.message.trim();
  const history = input.history ?? [];
  const retrievalQuery = buildRetrievalQuery(message, history);
  const queryNormalized = normalizeText(retrievalQuery);
  const queryTokens = tokenize(retrievalQuery);
  const broadCatalogIntent = isBroadCatalogQuery(queryNormalized);

  if (broadCatalogIntent && FEATURED_CATEGORY_MATCHES.length > 0) {
    return {
      ok: true,
      retrievalQuery,
      catalogSummary: CATALOG_SUMMARY.slice(0, 8),
      broadCatalogIntent: true,
      matches: FEATURED_CATEGORY_MATCHES,
    };
  }

  if (queryTokens.length === 0) {
    return {
      ok: false,
      retrievalQuery,
      catalogSummary: CATALOG_SUMMARY.slice(0, 8),
      broadCatalogIntent: false,
      matches: [],
      refusalMessage: CATALOG_REFUSAL_MESSAGE,
    };
  }

  const scoredMatches = CATALOG_ENTRIES.map((entry) =>
    scoreCatalogEntry(entry, queryNormalized, queryTokens),
  )
    .filter((entry) => entry.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      if (right.coverage !== left.coverage) {
        return right.coverage - left.coverage;
      }

      return left.name.localeCompare(right.name);
    });

  const topMatch = scoredMatches[0];
  const secondMatch = scoredMatches[1];

  if (!topMatch || !isMatchStrongEnough(topMatch, secondMatch)) {
    return {
      ok: false,
      retrievalQuery,
      catalogSummary: CATALOG_SUMMARY.slice(0, 8),
      broadCatalogIntent: false,
      matches: [],
      refusalMessage: CATALOG_REFUSAL_MESSAGE,
    };
  }

  const threshold = Math.max(topMatch.score - 8, 8);
  const matches = scoredMatches
    .filter((entry) => entry.score >= threshold)
    .slice(0, 6)
    .map(stripInternalMatchFields);

  return {
    ok: true,
    retrievalQuery,
    catalogSummary: CATALOG_SUMMARY.slice(0, 8),
    broadCatalogIntent: false,
    matches,
  };
}

export function retrieveGeneralKnowledge(input: {
  message: string;
  history?: ChatHistoryMessage[];
}): GeneralKnowledgeSnippet[] {
  const retrievalQuery = buildRetrievalQuery(input.message.trim(), input.history ?? []);
  const queryNormalized = normalizeText(retrievalQuery);
  const queryTokens = tokenize(retrievalQuery);

  if (queryNormalized.length === 0) {
    return [];
  }

  const scoredEntries = GENERAL_KNOWLEDGE_ENTRIES.map((entry) => {
    let score = 0;
    let matchedTokenCount = 0;

    if (queryNormalized.length >= 6 && entry.searchText.includes(queryNormalized)) {
      score += 18;
    }

    for (const token of queryTokens) {
      if (entry.tokenSet.has(token)) {
        score += 5;
        matchedTokenCount += 1;
      }
    }

    const coverage =
      queryTokens.length > 0 ? matchedTokenCount / queryTokens.length : 0;

    if (coverage >= 0.6) {
      score += 6;
    } else if (coverage >= 0.34) {
      score += 3;
    }

    return {
      ...entry,
      score,
      matchedTokenCount,
      coverage,
    };
  })
    .filter((entry) => entry.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.id.localeCompare(right.id);
    });

  const topMatch = scoredEntries[0];
  if (!topMatch || topMatch.score < 5) {
    return [];
  }

  const threshold = Math.max(topMatch.score - 5, 5);

  return scoredEntries
    .filter((entry) => entry.score >= threshold)
    .slice(0, 3)
    .map(({ id, source, content, tags, score }) => ({
      id,
      source,
      content,
      tags,
      score,
    }));
}

function buildCatalogEntry(product: StorefrontProduct): CatalogEntry {
  const categories = Array.from(
    new Set(
      [product.category ?? "", ...(product.filterCategory ?? [])].filter(Boolean),
    ),
  );
  const category = categories[0] || "Catalog";
  const description = sanitizeSnippet(product.description);
  const sizes = [...(product.sizes ?? [])];
  const sku = product.sku?.trim() || null;

  return {
    id: product.id,
    name: product.name,
    url: `/product-detail/${product.id}`,
    category,
    categories,
    categoryHref: CATEGORY_LINKS.get(category) ?? null,
    price: typeof product.price === "number" ? product.price : null,
    sku,
    sizes,
    description,
    image: product.img,
    inStock: Boolean(product.inStock),
    nameNormalized: normalizeText(product.name),
    searchText: normalizeText(
      [
        product.name,
        description,
        category,
        categories.join(" "),
        sizes.join(" "),
        sku ?? "",
      ].join(" "),
    ),
    nameTokens: new Set(tokenize(product.name)),
    categoryTokens: new Set(categories.flatMap((value) => tokenize(value))),
    sizeTokens: new Set(sizes.flatMap((value) => tokenize(value))),
    descriptionTokens: new Set(tokenize(description)),
    skuTokens: new Set(tokenize(sku ?? "")),
  };
}

function buildFeaturedCategoryMatches(): CatalogMatch[] {
  const nonEmptyCategories = categoryRecords
    .map((category) => ({
      category,
      count: parseCount(category.quantity),
    }))
    .filter((item) => item.count > 0)
    .sort((left, right) => right.count - left.count)
    .slice(0, 6);

  return nonEmptyCategories
    .map(({ category }) => {
      const sample = CATALOG_ENTRIES.find((entry) =>
        entry.categories.includes(category.name),
      );
      if (!sample) return null;

      return stripInternalMatchFields({
        ...sample,
        score: 24,
        coverage: 1,
        matchedTokenCount: 1,
      });
    })
    .filter((value): value is CatalogMatch => value != null);
}

function buildRetrievalQuery(
  message: string,
  history: ChatHistoryMessage[],
): string {
  const recentUserTurns = history
    .filter((item) => item.role === "user")
    .slice(-2)
    .map((item) => item.content.trim())
    .filter(Boolean);

  return [...recentUserTurns, message].join(" ");
}

function scoreCatalogEntry(
  entry: CatalogEntry,
  queryNormalized: string,
  queryTokens: string[],
): ScoredMatch {
  let score = 0;
  let matchedTokenCount = 0;

  if (queryNormalized.length >= 6 && entry.nameNormalized.includes(queryNormalized)) {
    score += 24;
  }

  if (queryNormalized.length >= 6 && entry.searchText.includes(queryNormalized)) {
    score += 12;
  }

  for (const token of queryTokens) {
    if (entry.nameTokens.has(token)) {
      score += 12;
      matchedTokenCount += 1;
      continue;
    }

    if (entry.categoryTokens.has(token)) {
      score += 9;
      matchedTokenCount += 1;
      continue;
    }

    if (entry.skuTokens.has(token)) {
      score += 16;
      matchedTokenCount += 1;
      continue;
    }

    if (entry.sizeTokens.has(token)) {
      score += 6;
      matchedTokenCount += 1;
      continue;
    }

    if (entry.descriptionTokens.has(token)) {
      score += 3;
      matchedTokenCount += 1;
    }
  }

  if (entry.sku && normalizeText(entry.sku) === queryNormalized) {
    score += 24;
  }

  const coverage =
    queryTokens.length > 0 ? matchedTokenCount / queryTokens.length : 0;

  if (coverage >= 0.75) {
    score += 8;
  } else if (coverage >= 0.5) {
    score += 4;
  } else if (coverage >= 0.34) {
    score += 2;
  }

  return {
    id: entry.id,
    name: entry.name,
    url: entry.url,
    category: entry.category,
    categories: entry.categories,
    categoryHref: entry.categoryHref,
    price: entry.price,
    sku: entry.sku,
    sizes: entry.sizes,
    description: entry.description,
    image: entry.image,
    inStock: entry.inStock,
    score,
    coverage,
    matchedTokenCount,
  };
}

function isMatchStrongEnough(
  topMatch: ScoredMatch,
  secondMatch: ScoredMatch | undefined,
): boolean {
  if (topMatch.score >= 18) {
    return true;
  }

  if (topMatch.score >= 12 && topMatch.coverage >= 0.5) {
    return true;
  }

  if (
    topMatch.score >= 10 &&
    topMatch.coverage >= 0.34 &&
    secondMatch &&
    secondMatch.score >= 8
  ) {
    return true;
  }

  return false;
}

function stripInternalMatchFields(match: ScoredMatch): CatalogMatch {
  return {
    id: match.id,
    name: match.name,
    url: match.url,
    category: match.category,
    categories: match.categories,
    categoryHref: match.categoryHref,
    price: match.price,
    sku: match.sku,
    sizes: match.sizes,
    description: match.description,
    image: match.image,
    inStock: match.inStock,
    score: match.score,
    coverage: match.coverage,
  };
}

function isBroadCatalogQuery(queryNormalized: string): boolean {
  const broadMatch = [
    /\bwhat do you sell\b/,
    /\bwhat products do you have\b/,
    /\bwhat categories do you have\b/,
    /\bshow me the catalog\b/,
    /\bcatalog\b/,
    /\binventory\b/,
    /\bwhat is available\b/,
    /\bwhat do you have\b/,
  ].some((pattern) => pattern.test(queryNormalized));

  if (!broadMatch) {
    return false;
  }

  const specificTokens = tokenize(queryNormalized).filter(
    (token) => !["catalog", "inventory", "available"].includes(token),
  );

  return specificTokens.length === 0;
}

function parseCount(quantity: string | undefined): number {
  if (!quantity) return 0;
  const match = quantity.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function sanitizeSnippet(value: string | undefined): string {
  if (!value) return "";

  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\u2026/g, "...")
    .trim()
    .slice(0, 320);
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value: string): string[] {
  return normalizeText(value)
    .split(" ")
    .map((token) => token.trim())
    .filter((token) => token.length >= 2 && !STOPWORDS.has(token));
}
