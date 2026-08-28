"use client";

import Image from "next/image";
import Link from "next/link";
import type { FormEvent, KeyboardEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import styles from "./CatalogChatbot.module.scss";

type MatchedProduct = {
  id: number;
  name: string;
  url: string;
  category: string;
  categoryHref: string | null;
  price: number | null;
  sku: string | null;
  image: string;
};

type Message = {
  id: string;
  role: "assistant" | "user";
  content: string;
  refusal?: boolean;
  matchedProducts?: MatchedProduct[];
};

type ApiResponse = {
  answer?: string;
  refusal?: boolean;
  matchedProducts?: MatchedProduct[];
  error?: string;
};

const BOT_NAME = "Worxie";
const QUICK_PROMPTS = [
  "Which 10x10 canopy options are in the catalog?",
  "Show me custom food booth canopy options.",
  "What trade show display products do you have?",
];

const INITIAL_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "I’m Worxie, your Notion Worx catalog assistant. Ask me about products in the current catalog and I’ll answer only from those product records.",
};

export default function CatalogChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const conversationHistory = useMemo(
    () =>
      messages
        .filter((message) => message.id !== INITIAL_MESSAGE.id)
        .map((message) => ({
          role: message.role,
          content: message.content,
        }))
        .slice(-6),
    [messages],
  );

  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;

    scroller.scrollTop = scroller.scrollHeight;
  }, [messages, isOpen, isSending]);

  useEffect(() => {
    if (!isOpen) return;
    textareaRef.current?.focus();
  }, [isOpen]);

  async function submitMessage(rawMessage: string) {
    const message = rawMessage.trim();
    if (!message || isSending) {
      return;
    }

    const userMessage: Message = {
      id: createMessageId(),
      role: "user",
      content: message,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/catalog-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          history: conversationHistory,
        }),
      });

      const data = (await response.json()) as ApiResponse;

      if (!response.ok || typeof data.answer !== "string") {
        throw new Error(data.error || "Request failed.");
      }

      const assistantMessage: Message = {
        id: createMessageId(),
        role: "assistant",
        content: data.answer,
        refusal: data.refusal,
        matchedProducts: data.matchedProducts ?? [],
      };

      setMessages((current) => [...current, assistantMessage]);
    } catch (error) {
      const fallbackMessage: Message = {
        id: createMessageId(),
        role: "assistant",
        content:
          error instanceof Error && error.message
            ? error.message
            : "The catalog assistant is temporarily unavailable. Please try again.",
      };

      setMessages((current) => [...current, fallbackMessage]);
    } finally {
      setIsSending(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submitMessage(input);
  }

  function handlePromptClick(prompt: string) {
    void submitMessage(prompt);
    setIsOpen(true);
  }

  function handleComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submitMessage(input);
    }
  }

  return (
    <>
      <section
        id="worxie-chat-panel"
        className={`${styles.panel} ${isOpen ? styles.panelOpen : styles.panelClosed}`}
        aria-label={`${BOT_NAME} product assistant`}
        aria-hidden={!isOpen}
      >
        {isOpen ? (
          <>
          <header className={styles.header}>
            <div>
              <h2 className={styles.title}>{BOT_NAME}</h2>
            </div>
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
              aria-label="Close catalog assistant"
            >
              <span aria-hidden>×</span>
            </button>
          </header>

          <div ref={scrollRef} className={styles.messages}>
            {messages.map((message) => (
              <article
                key={message.id}
                className={
                  message.role === "assistant"
                    ? `${styles.assistantMessage} ${styles.messageEntry}`
                    : `${styles.userMessage} ${styles.messageEntry}`
                }
              >
                <div className={styles.messageBubble}>
                  {message.role === "assistant" ? (
                    <p className={styles.messageLabel}>{BOT_NAME}</p>
                  ) : null}
                  <p className={styles.messageText}>{message.content}</p>
                </div>

                {message.role === "assistant" &&
                !message.refusal &&
                message.matchedProducts &&
                message.matchedProducts.length > 0 ? (
                  <div className={styles.referenceList}>
                    {message.matchedProducts.map((product) => (
                      <Link
                        key={`${message.id}-${product.id}`}
                        href={product.url}
                        className={styles.referenceCard}
                      >
                        <div className={styles.referenceMeta}>
                          <span className={styles.referenceCategory}>
                            {product.category}
                          </span>
                          {product.price != null ? (
                            <span className={styles.referencePrice}>
                              ${product.price}
                            </span>
                          ) : null}
                        </div>
                        <span className={styles.referenceName}>{product.name}</span>
                        {product.sku ? (
                          <span className={styles.referenceSku}>
                            SKU {product.sku}
                          </span>
                        ) : null}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}

            {isSending ? (
              <article className={`${styles.assistantMessage} ${styles.messageEntry}`}>
                <div className={styles.messageBubble}>
                  <p className={styles.messageLabel}>{BOT_NAME}</p>
                  <div className={styles.thinkingState}>
                    <span className={styles.thinkingText}>Checking the catalog</span>
                    <span className={styles.typingDots} aria-hidden="true">
                      <span />
                      <span />
                      <span />
                    </span>
                  </div>
                </div>
              </article>
            ) : null}
          </div>

          {messages.length === 1 ? (
            <div className={styles.quickPromptSection}>
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className={styles.quickPrompt}
                  onClick={() => handlePromptClick(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          ) : null}

          <form className={styles.composer} onSubmit={handleSubmit}>
            <textarea
              ref={textareaRef}
              className={styles.textarea}
              rows={1}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleComposerKeyDown}
              placeholder="Ask me anything"
              maxLength={600}
              aria-label="Catalog chat input"
            />
            <button
              type="submit"
              className={styles.sendButton}
              disabled={isSending || !input.trim()}
              aria-label="Send message"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className={styles.sendIcon}
              >
                <path
                  d="M12 5v11"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.5 9.5 12 5l4.5 4.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>
          </>
        ) : null}
      </section>

      <button
        type="button"
        className={styles.launcher}
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-controls="worxie-chat-panel"
      >
        <span className={styles.launcherBadge} aria-hidden="true">
          <Image
            src="/assets/images/chatbot/worxie-logo.png"
            alt=""
            width={44}
            height={44}
            className={styles.launcherLogo}
          />
        </span>
        <span className={styles.launcherText}>
          <strong>{BOT_NAME}</strong>
          <span>Ask about products</span>
        </span>
      </button>
    </>
  );
}

function createMessageId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
