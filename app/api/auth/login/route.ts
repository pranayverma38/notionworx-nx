import { NextRequest, NextResponse } from "next/server";

import {
  getResponseMessage,
  getResponseStatus,
  loginCustomerSession,
  setMedusaSessionCookies,
} from "@/lib/medusa/customer-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LoginBody = {
  email?: unknown;
  password?: unknown;
};

export async function POST(request: NextRequest) {
  let body: LoginBody;

  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  try {
    const { session, customer } = await loginCustomerSession(email, password);
    const response = NextResponse.json({ customer });
    setMedusaSessionCookies(response, session);
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: getResponseMessage(error) },
      { status: getResponseStatus(error) },
    );
  }
}
