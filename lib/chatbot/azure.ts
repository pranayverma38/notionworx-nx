import "server-only";

import type {
  CatalogRetrievalResult,
  ChatHistoryMessage,
} from "@/lib/chatbot/catalog";
import { CATALOG_REFUSAL_MESSAGE, CHATBOT_NAME } from "@/lib/chatbot/catalog";

type GenerateCatalogAnswerInput = {
  question: string;
  history: ChatHistoryMessage[];
  retrieval: Extract<CatalogRetrievalResult, { ok: true }>;
};

type ResponsesApiSuccess = {
  output_text?: string | null;
  output?: Array<{
    content?: Array<{
      text?: string;
      type?: string;
      refusal?: string;
    }>;
  }>;
};

const DEFAULT_BASE_URL = "https://foundryrentiqo.services.ai.azure.com/openai/v1";
const DEFAULT_RESPONSES_URL = `${DEFAULT_BASE_URL}/responses`;
const DEFAULT_MODEL = "gpt-4.1";

const SYSTEM_PROMPT = `You are ${CHATBOT_NAME}, a catalog-grounded shopping assistant for Notion Worx.

Rules you must follow:
- Use only the supplied catalog context and matched products.
- Never use outside knowledge, assumptions, or general world facts.
- If the context is insufficient, reply exactly with: "${CATALOG_REFUSAL_MESSAGE}"
- Mention relevant matched product names in the answer.
- Keep the answer concise and practical.
- When helpful, mention pricing, available sizes, SKU, stock status, or category only if those fields are present in the supplied snippets.
- Do not invent policies, lead times, materials, warranties, or comparisons that are not present in the supplied catalog context.
- Do not answer unrelated or out-of-catalog questions.`;

export async function generateCatalogAnswer(
  input: GenerateCatalogAnswerInput,
): Promise<string> {
  const endpoint =
    process.env.AZURE_OPENAI_RESPONSES_ENDPOINT?.trim() || DEFAULT_RESPONSES_URL;
  const apiKey = process.env.AZURE_OPENAI_API_KEY?.trim();
  const model = process.env.AZURE_OPENAI_MODEL?.trim() || DEFAULT_MODEL;

  if (!apiKey) {
    throw new Error("Missing AZURE_OPENAI_API_KEY.");
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      model,
      temperature: 0.1,
      max_output_tokens: 500,
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: SYSTEM_PROMPT }],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: buildUserPrompt(input),
            },
          ],
        },
      ],
    }),
    cache: "no-store",
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Azure Responses API failed (${response.status}): ${responseText.slice(0, 500)}`,
    );
  }

  let payload: ResponsesApiSuccess;

  try {
    payload = JSON.parse(responseText) as ResponsesApiSuccess;
  } catch (error) {
    throw new Error(
      `Azure Responses API returned non-JSON content: ${String(error)}`,
    );
  }

  const answer = extractOutputText(payload).trim();
  if (!answer) {
    throw new Error("Azure Responses API returned an empty answer.");
  }

  return answer;
}

function buildUserPrompt({
  question,
  history,
  retrieval,
}: GenerateCatalogAnswerInput): string {
  const historyBlock = history
    .slice(-6)
    .map((message) => `${message.role.toUpperCase()}: ${message.content.trim()}`)
    .join("\n");

  const matchesBlock = retrieval.matches
    .map((match, index) => {
      const price = match.price != null ? `$${match.price}` : "N/A";
      const sizes = match.sizes.length > 0 ? match.sizes.join(", ") : "N/A";
      const sku = match.sku ?? "N/A";

      return [
        `${index + 1}. ${match.name}`,
        `   URL: ${match.url}`,
        `   Category: ${match.category}`,
        `   Additional categories: ${match.categories.join(", ")}`,
        `   Price: ${price}`,
        `   SKU: ${sku}`,
        `   In stock: ${match.inStock ? "yes" : "no"}`,
        `   Sizes/options: ${sizes}`,
        `   Description snippet: ${match.description || "N/A"}`,
      ].join("\n");
    })
    .join("\n\n");

  const catalogSummaryBlock = retrieval.catalogSummary.join("\n");

  return [
    `Customer question: ${question.trim()}`,
    "",
    "Recent conversation:",
    historyBlock || "No prior conversation.",
    "",
    `Retrieval query: ${retrieval.retrievalQuery}`,
    `Broad catalog intent: ${retrieval.broadCatalogIntent ? "yes" : "no"}`,
    "",
    "Catalog category summary:",
    catalogSummaryBlock || "No category summary available.",
    "",
    "Matched catalog products:",
    matchesBlock,
    "",
    "Answer requirements:",
    "- Answer using only the matched products and category summary above.",
    "- Reference the most relevant product names directly in the answer.",
    "- If the context does not actually support an answer, return the refusal sentence exactly.",
    "- Keep the answer easy to scan and avoid filler.",
  ].join("\n");
}

function extractOutputText(payload: ResponsesApiSuccess): string {
  if (typeof payload.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text;
  }

  const collected = payload.output
    ?.flatMap((item) => item.content ?? [])
    .map((content) => content.text ?? content.refusal ?? "")
    .join("\n")
    .trim();

  return collected ?? "";
}
