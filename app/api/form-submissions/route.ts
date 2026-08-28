import { NextRequest, NextResponse } from "next/server";

import {
  sendFormSubmissionEmail,
  type AffiliateSubmission,
  type ContactSubmission,
  type FormSubmission,
} from "@/lib/email/form-submissions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 6;
const REQUEST_LOG = new Map<string, number[]>();

type RawSubmissionBody = {
  formType?: unknown;
  sourcePath?: unknown;
  name?: unknown;
  email?: unknown;
  projectScope?: unknown;
  saveDetails?: unknown;
  firstName?: unknown;
  lastName?: unknown;
  phone?: unknown;
  instagram?: unknown;
};

export async function POST(request: NextRequest) {
  const clientKey = getClientKey(request);
  if (isRateLimited(clientKey)) {
    return NextResponse.json(
      {
        error:
          "Too many form submissions were received from this connection. Please wait a minute and try again.",
      },
      { status: 429 },
    );
  }

  let body: RawSubmissionBody;

  try {
    body = (await request.json()) as RawSubmissionBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  let submission: FormSubmission;

  try {
    submission = parseSubmission(body);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid submission payload.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    await sendFormSubmissionEmail(submission);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to send form submission email", error);
    return NextResponse.json(
      {
        error:
          "Your request could not be sent right now. Please try again in a moment.",
      },
      { status: 502 },
    );
  }
}

function parseSubmission(body: RawSubmissionBody): FormSubmission {
  const formType = normalizeString(body.formType, 40);

  if (formType === "contact") {
    return parseContactSubmission(body);
  }

  if (formType === "affiliate_registration" || formType === "home_affiliate") {
    return parseAffiliateSubmission(body, formType);
  }

  throw new Error("Unsupported form type.");
}

function parseContactSubmission(body: RawSubmissionBody): ContactSubmission {
  const name = requireText(body.name, "Name", 120);
  const email = requireEmail(body.email);
  const projectScope = requireText(body.projectScope, "Project scope", 4000);
  const sourcePath = normalizeString(body.sourcePath, 40);

  if (sourcePath !== "/contact") {
    throw new Error("Invalid contact form source.");
  }

  return {
    formType: "contact",
    sourcePath,
    name,
    email,
    projectScope,
    saveDetails: Boolean(body.saveDetails),
  };
}

function parseAffiliateSubmission(
  body: RawSubmissionBody,
  formType: AffiliateSubmission["formType"],
): AffiliateSubmission {
  const sourcePath = normalizeString(body.sourcePath, 40);
  const expectedSourcePath =
    formType === "home_affiliate" ? "/" : "/affiliate-registration";

  if (sourcePath !== expectedSourcePath) {
    throw new Error("Invalid affiliate form source.");
  }

  return {
    formType,
    sourcePath,
    firstName: requireText(body.firstName, "First name", 80),
    lastName: requireText(body.lastName, "Last name", 80),
    email: requireEmail(body.email),
    phone: optionalText(body.phone, 40),
    instagram: optionalText(body.instagram, 120),
  };
}

function requireText(value: unknown, label: string, maxLength: number): string {
  const normalized = normalizeString(value, maxLength);
  if (!normalized) {
    throw new Error(`${label} is required.`);
  }

  return normalized;
}

function optionalText(value: unknown, maxLength: number): string {
  return normalizeString(value, maxLength);
}

function requireEmail(value: unknown): string {
  const email = requireText(value, "Email", 320);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    throw new Error("A valid email address is required.");
  }

  return email;
}

function normalizeString(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
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
  const recent = timestamps.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );
  recent.push(now);
  REQUEST_LOG.set(clientKey, recent);

  return recent.length > RATE_LIMIT_MAX_REQUESTS;
}
