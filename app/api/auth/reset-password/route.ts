import { NextRequest, NextResponse } from "next/server";

import {
  getResponseMessage,
  getResponseStatus,
  requestCustomerPasswordReset,
} from "@/lib/medusa/customer-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ResetPasswordBody = {
  email?: unknown;
};

export async function POST(request: NextRequest) {
  let body: ResetPasswordBody;

  try {
    body = (await request.json()) as ResetPasswordBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email) {
    return NextResponse.json(
      { error: "Please enter your email address." },
      { status: 400 },
    );
  }

  try {
    await requestCustomerPasswordReset(email);
    return NextResponse.json({
      ok: true,
      message:
        "If that email exists, password reset instructions will be handled by the Medusa backend.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: getResponseMessage(error) },
      { status: getResponseStatus(error) },
    );
  }
}
