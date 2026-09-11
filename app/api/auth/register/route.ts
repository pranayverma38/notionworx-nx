import { NextRequest, NextResponse } from "next/server";

import {
  getResponseMessage,
  getResponseStatus,
  registerCustomerSession,
  setMedusaSessionCookies,
} from "@/lib/medusa/customer-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RegisterBody = {
  firstName?: unknown;
  lastName?: unknown;
  phoneCode?: unknown;
  phone?: unknown;
  email?: unknown;
  password?: unknown;
};

export async function POST(request: NextRequest) {
  let body: RegisterBody;

  try {
    body = (await request.json()) as RegisterBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const firstName = typeof body.firstName === "string" ? body.firstName.trim() : "";
  const lastName = typeof body.lastName === "string" ? body.lastName.trim() : "";
  const phoneCode = typeof body.phoneCode === "string" ? body.phoneCode.trim() : "+1";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!firstName || !lastName || !phone || !email || !password) {
    return NextResponse.json(
      { error: "Please complete all required fields." },
      { status: 400 },
    );
  }

  try {
    const { session, customer } = await registerCustomerSession({
      firstName,
      lastName,
      phoneCode,
      phone,
      email,
      password,
    });
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
