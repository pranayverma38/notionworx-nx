import { NextResponse, type NextRequest } from "next/server";

import {
  CATALOG_REFUSAL_MESSAGE,
  CHATBOT_NAME,
  retrieveCatalogMatches,
  type ChatHistoryMessage,
} from "@/lib/chatbot/catalog";
import { generateCatalogAnswer } from "@/lib/chatbot/azure";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 12;
const REQUEST_LOG = new Map<string, number[]>();

type CatalogChatRequest = {
  message?: unknown;
  history?: unknown;
};

export async function POST(request: NextRequest) {
  const clientKey = getClientKey(request);
  if (isRateLimited(clientKey)) {
    return NextResponse.json(
      {
        error:
          "Too many chat requests. Please wait a moment before asking another catalog question.",
      },
      { status: 429 },
    );
  }

  let body: CatalogChatRequest;

  try {
    body = (await request.json()) as CatalogChatRequest;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const message =
    typeof body.message === "string" ? body.message.trim().slice(0, 600) : "";
  const history = sanitizeHistory(body.history);

  if (!message) {
    return NextResponse.json(
      { error: "Please send a catalog question." },
      { status: 400 },
    );
  }

  const retrieval = retrieveCatalogMatches({ message, history });
  if (!retrieval.ok) {
    return NextResponse.json({
      answer: "refusalMessage" in retrieval ? retrieval.refusalMessage : CATALOG_REFUSAL_MESSAGE,
      refusal: true,
      matchedProducts: [],
      botName: CHATBOT_NAME,
    });
  }

  try {
    const answer = await generateCatalogAnswer({
      question: message,
      history,
      retrieval,
    });

    return NextResponse.json({
      answer,
      refusal: answer.trim() === CATALOG_REFUSAL_MESSAGE,
      matchedProducts: retrieval.matches.map((match) => ({
        id: match.id,
        name: match.name,
        url: match.url,
        category: match.category,
        categoryHref: match.categoryHref,
        price: match.price,
        sku: match.sku,
        image: match.image,
      })),
      botName: CHATBOT_NAME,
    });
  } catch (error) {
    console.error("Catalog chat request failed", error);
    return NextResponse.json(
      {
        error:
          "The catalog assistant is temporarily unavailable. Please try again in a moment.",
      },
      { status: 502 },
    );
  }
}

function sanitizeHistory(history: unknown): ChatHistoryMessage[] {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .map((item) => {
      if (
        !item ||
        typeof item !== "object" ||
        !("role" in item) ||
        !("content" in item)
      ) {
        return null;
      }

      const role = item.role;
      const content = item.content;

      if (
        (role !== "user" && role !== "assistant") ||
        typeof content !== "string"
      ) {
        return null;
      }

      const sanitizedContent = content.trim().slice(0, 600);
      if (!sanitizedContent) {
        return null;
      }

      return {
        role,
        content: sanitizedContent,
      };
    })
    .filter((item): item is ChatHistoryMessage => item != null)
    .slice(-6);
}

function getClientKey(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "anonymous";
  }

  return "anonymous";
}

function isRateLimited(clientKey: string): boolean {
  const now = Date.now();
  const timestamps = REQUEST_LOG.get(clientKey) ?? [];
  const recent = timestamps.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  REQUEST_LOG.set(clientKey, recent);

  return recent.length > RATE_LIMIT_MAX_REQUESTS;
}
