import { NextResponse } from "next/server";

import {
  getResponseMessage,
  getResponseStatus,
  listCustomerOrders,
} from "@/lib/medusa/customer-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const orders = await listCustomerOrders();
    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json(
      { error: getResponseMessage(error) },
      { status: getResponseStatus(error) },
    );
  }
}
