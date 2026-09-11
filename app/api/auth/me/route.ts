import { NextResponse } from "next/server";

import {
  clearMedusaSessionCookies,
  getAuthenticatedCustomer,
} from "@/lib/medusa/customer-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const customer = await getAuthenticatedCustomer();

  if (!customer) {
    const response = NextResponse.json(
      { error: "Not signed in." },
      { status: 401 },
    );
    clearMedusaSessionCookies(response);
    return response;
  }

  return NextResponse.json({ customer });
}
