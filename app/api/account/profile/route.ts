import { NextRequest, NextResponse } from "next/server";

import {
  getCustomerProfile,
  getResponseMessage,
  getResponseStatus,
  updateCustomerProfile,
} from "@/lib/medusa/customer-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ProfileBody = {
  firstName?: unknown;
  lastName?: unknown;
  phoneCode?: unknown;
  phone?: unknown;
  companyName?: unknown;
  gender?: unknown;
  dateOfBirth?: unknown;
};

export async function GET() {
  try {
    const customer = await getCustomerProfile();
    return NextResponse.json({ customer });
  } catch (error) {
    return NextResponse.json(
      { error: getResponseMessage(error) },
      { status: getResponseStatus(error) },
    );
  }
}

export async function POST(request: NextRequest) {
  let body: ProfileBody;

  try {
    body = (await request.json()) as ProfileBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  try {
    const customer = await updateCustomerProfile({
      firstName: typeof body.firstName === "string" ? body.firstName : "",
      lastName: typeof body.lastName === "string" ? body.lastName : "",
      phoneCode: typeof body.phoneCode === "string" ? body.phoneCode : "+1",
      phone: typeof body.phone === "string" ? body.phone : "",
      companyName: typeof body.companyName === "string" ? body.companyName : "",
      gender: typeof body.gender === "string" ? body.gender : "",
      dateOfBirth: typeof body.dateOfBirth === "string" ? body.dateOfBirth : "",
    });

    return NextResponse.json({ customer });
  } catch (error) {
    return NextResponse.json(
      { error: getResponseMessage(error) },
      { status: getResponseStatus(error) },
    );
  }
}
