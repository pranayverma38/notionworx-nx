import { NextRequest, NextResponse } from "next/server";

import {
  sendFormSubmissionEmail,
  type ArtUploadSubmission,
  type EmailAttachment,
} from "@/lib/email/form-submissions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 4;
const REQUEST_LOG = new Map<string, number[]>();

export async function POST(request: NextRequest) {
  const clientKey = getClientKey(request);
  if (isRateLimited(clientKey)) {
    return NextResponse.json(
      {
        error:
          "Too many artwork submissions were received from this connection. Please wait a minute and try again.",
      },
      { status: 429 },
    );
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid multipart form data." },
      { status: 400 },
    );
  }

  let submission: ArtUploadSubmission;
  let attachment: EmailAttachment | undefined;

  try {
    submission = await parseArtUploadSubmission(formData);
    attachment = await parseAttachment(formData);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid art upload payload.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    await sendFormSubmissionEmail(submission, {
      attachments: attachment ? [attachment] : undefined,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to send art upload email", error);
    return NextResponse.json(
      {
        error:
          "Your artwork submission could not be sent right now. Please try again in a moment.",
      },
      { status: 502 },
    );
  }
}

async function parseArtUploadSubmission(
  formData: FormData,
): Promise<ArtUploadSubmission> {
  return {
    formType: "art_upload",
    sourcePath: "/uploadart",
    fullName: requireText(formData, "fullName", "Full name", 120),
    businessName: requireText(formData, "businessName", "Business / Club name", 160),
    invoiceNumber: optionalText(formData, "invoiceNumber", 120),
    mockupOnly: optionalText(formData, "mockupOnly", 20),
    instagram: optionalText(formData, "instagram", 160),
    facebook: optionalText(formData, "facebook", 200),
    tiktok: optionalText(formData, "tiktok", 160),
    linktree: optionalText(formData, "linktree", 200),
    website: optionalText(formData, "website", 200),
    dateNeeded: requireText(formData, "dateNeeded", "Date needed by", 40),
    email: requireEmail(formData.get("email")),
    phone: requireText(formData, "phone", "Phone", 60),
    designInstructions: requireText(
      formData,
      "designInstructions",
      "Design instructions",
      5000,
    ),
    fileName: extractFileName(formData.get("file")),
    fileSizeLabel: await extractFileSizeLabel(formData.get("file")),
  };
}

async function parseAttachment(
  formData: FormData,
): Promise<EmailAttachment | undefined> {
  const rawFile = formData.get("file");
  if (!(rawFile instanceof File) || rawFile.size === 0) {
    return undefined;
  }

  if (rawFile.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("Uploaded file must be 15 MB or smaller.");
  }

  const sanitizedName = sanitizeFileName(rawFile.name);
  const buffer = Buffer.from(await rawFile.arrayBuffer());

  return {
    filename: sanitizedName,
    content: buffer.toString("base64"),
    contentType: rawFile.type || undefined,
  };
}

function requireText(
  formData: FormData,
  fieldName: string,
  label: string,
  maxLength: number,
): string {
  const value = normalizeText(formData.get(fieldName), maxLength);
  if (!value) {
    throw new Error(`${label} is required.`);
  }

  return value;
}

function optionalText(
  formData: FormData,
  fieldName: string,
  maxLength: number,
): string {
  return normalizeText(formData.get(fieldName), maxLength);
}

function requireEmail(value: FormDataEntryValue | null): string {
  const email = normalizeText(value, 320);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailPattern.test(email)) {
    throw new Error("A valid email address is required.");
  }

  return email;
}

function normalizeText(
  value: FormDataEntryValue | null,
  maxLength: number,
): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function extractFileName(value: FormDataEntryValue | null): string {
  if (!(value instanceof File) || value.size === 0) {
    return "";
  }

  return sanitizeFileName(value.name);
}

async function extractFileSizeLabel(
  value: FormDataEntryValue | null,
): Promise<string> {
  if (!(value instanceof File) || value.size === 0) {
    return "";
  }

  return formatFileSize(value.size);
}

function sanitizeFileName(fileName: string): string {
  const trimmed = fileName.trim().slice(0, 180);
  const sanitized = trimmed.replace(/[^\w.\-() ]+/g, "_");
  return sanitized || "uploaded-artwork";
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
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
