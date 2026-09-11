import { NextResponse } from "next/server";

import {
  clearMedusaSessionCookies,
  destroyCurrentMedusaSession,
  getResponseMessage,
  getResponseStatus,
} from "@/lib/medusa/customer-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function handleLogout() {
  try {
    await destroyCurrentMedusaSession();
    const response = NextResponse.json({ ok: true });
    clearMedusaSessionCookies(response);
    return response;
  } catch (error) {
    const response = NextResponse.json(
      { error: getResponseMessage(error) },
      { status: getResponseStatus(error) },
    );
    clearMedusaSessionCookies(response);
    return response;
  }
}

export async function POST() {
  return handleLogout();
}

export async function DELETE() {
  return handleLogout();
}
