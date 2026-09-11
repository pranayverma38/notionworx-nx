import { NextRequest, NextResponse } from "next/server";

import {
  getResponseMessage,
  getResponseStatus,
  listCustomerAddresses,
  upsertCustomerAddress,
} from "@/lib/medusa/customer-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AddressBody = {
  addressId?: unknown;
  company?: unknown;
  countryCode?: unknown;
  address1?: unknown;
  address2?: unknown;
  city?: unknown;
  state?: unknown;
  zip?: unknown;
  phone?: unknown;
};

export async function GET() {
  try {
    const addresses = await listCustomerAddresses();
    return NextResponse.json({ addresses });
  } catch (error) {
    return NextResponse.json(
      { error: getResponseMessage(error) },
      { status: getResponseStatus(error) },
    );
  }
}

export async function POST(request: NextRequest) {
  let body: AddressBody;

  try {
    body = (await request.json()) as AddressBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  try {
    const addresses = await upsertCustomerAddress({
      addressId: typeof body.addressId === "string" ? body.addressId : "",
      company: typeof body.company === "string" ? body.company : "",
      countryCode: typeof body.countryCode === "string" ? body.countryCode : "",
      address1: typeof body.address1 === "string" ? body.address1 : "",
      address2: typeof body.address2 === "string" ? body.address2 : "",
      city: typeof body.city === "string" ? body.city : "",
      state: typeof body.state === "string" ? body.state : "",
      zip: typeof body.zip === "string" ? body.zip : "",
      phone: typeof body.phone === "string" ? body.phone : "",
    });

    return NextResponse.json({ addresses });
  } catch (error) {
    return NextResponse.json(
      { error: getResponseMessage(error) },
      { status: getResponseStatus(error) },
    );
  }
}
