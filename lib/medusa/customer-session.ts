import "server-only";

import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

import {
  formatProvinceCode,
  getCountryLabel,
  normalizeCountryCode,
} from "@/lib/medusa/countries";
import type {
  AccountAddress,
  AccountOrder,
  AccountOrderItem,
  PublicCustomer,
} from "@/types/medusa";

const MEDUSA_SESSION_NAME_COOKIE = "nw_medusa_session_name";
const MEDUSA_SESSION_VALUE_COOKIE = "nw_medusa_session_value";
const DEFAULT_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 14;

type JsonRecord = Record<string, unknown>;

type MedusaSession = {
  name: string;
  value: string;
  maxAge: number;
};

type MedusaAuthResponse = {
  token?: string;
  location?: string;
  verification_required?: boolean;
};

type MedusaCustomer = {
  id?: string;
  email?: string;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  company_name?: string | null;
  metadata?: JsonRecord | null;
  addresses?: MedusaCustomerAddress[] | null;
};

type MedusaCustomerAddress = {
  id?: string;
  company?: string | null;
  address_1?: string | null;
  address_2?: string | null;
  city?: string | null;
  country_code?: string | null;
  province?: string | null;
  postal_code?: string | null;
  phone?: string | null;
  is_default_shipping?: boolean | null;
  is_default_billing?: boolean | null;
};

type MedusaOrder = {
  id?: string;
  display_id?: number | null;
  status?: string | null;
  created_at?: string | null;
  total?: number | null;
  currency_code?: string | null;
  items?: MedusaOrderLineItem[] | null;
};

type MedusaOrderLineItem = {
  id?: string;
  product_title?: string | null;
  title?: string | null;
  variant_title?: string | null;
  quantity?: number | null;
  unit_price?: number | null;
  thumbnail?: string | null;
};

type MedusaCustomerResponse = {
  customer?: MedusaCustomer | null;
};

type MedusaAddressesResponse = {
  addresses?: MedusaCustomerAddress[] | null;
};

type MedusaOrdersResponse = {
  orders?: MedusaOrder[] | null;
};

type AuthenticatedCustomerContext = {
  session: MedusaSession;
  customer: MedusaCustomer;
};

type RegisterCustomerInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneCode: string;
  phone: string;
};

type UpdateCustomerProfileInput = {
  firstName: string;
  lastName: string;
  phoneCode: string;
  phone: string;
  companyName: string;
  gender: string;
  dateOfBirth: string;
};

type UpsertCustomerAddressInput = {
  addressId?: string;
  company: string;
  countryCode: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  firstName?: string;
  lastName?: string;
};

class MedusaRequestError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "MedusaRequestError";
    this.status = status;
  }
}

function getMedusaConfig() {
  const backendUrl =
    process.env.MEDUSA_BACKEND_URL?.trim().replace(/\/+$/, "") ?? "";
  const publishableKey = process.env.MEDUSA_API_KEY?.trim() ?? "";

  if (!backendUrl || !publishableKey) {
    throw new MedusaRequestError(
      "Medusa storefront credentials are not configured.",
      500,
    );
  }

  return { backendUrl, publishableKey };
}

function getCookieOptions(maxAge = DEFAULT_SESSION_MAX_AGE_SECONDS) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function extractMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === "object") {
    const message = (payload as JsonRecord).message;
    if (typeof message === "string" && message.trim()) {
      return message.trim();
    }
  }

  if (typeof payload === "string" && payload.trim()) {
    return payload.trim();
  }

  return fallback;
}

async function requestMedusa<T>(
  path: string,
  init: RequestInit & { json?: unknown } = {},
  options: {
    authToken?: string;
    session?: MedusaSession | null;
    includePublishableKey?: boolean;
  } = {},
): Promise<{ data: T; response: Response }> {
  const config = getMedusaConfig();
  const headers = new Headers(init.headers);
  const includePublishableKey = options.includePublishableKey ?? path.startsWith("/store/");

  headers.set("Accept", "application/json");
  if (includePublishableKey) {
    headers.set("x-publishable-api-key", config.publishableKey);
  }
  if (options.authToken) {
    headers.set("Authorization", `Bearer ${options.authToken}`);
  }
  if (options.session) {
    headers.append("Cookie", `${options.session.name}=${options.session.value}`);
  }

  let body = init.body;
  if (Object.prototype.hasOwnProperty.call(init, "json")) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(init.json);
  }

  const response = await fetch(`${config.backendUrl}${path}`, {
    ...init,
    headers,
    body,
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : await response.text().catch(() => "");

  if (!response.ok) {
    throw new MedusaRequestError(
      extractMessage(payload, `Medusa request failed with status ${response.status}.`),
      response.status,
    );
  }

  return {
    data: (payload ?? {}) as T,
    response,
  };
}

function parseSessionCookie(response: Response): MedusaSession {
  const rawSetCookie = response.headers.get("set-cookie");
  const match = rawSetCookie?.match(/^([^=;,\s]+)=([^;]+)/);

  if (!match) {
    throw new MedusaRequestError(
      "Medusa did not return a customer session cookie.",
      502,
    );
  }

  const maxAgeMatch = rawSetCookie.match(/Max-Age=(\d+)/i);
  const maxAge = maxAgeMatch ? Number(maxAgeMatch[1]) : DEFAULT_SESSION_MAX_AGE_SECONDS;

  return {
    name: match[1],
    value: match[2],
    maxAge: Number.isFinite(maxAge) && maxAge > 0 ? maxAge : DEFAULT_SESSION_MAX_AGE_SECONDS,
  };
}

async function createSessionFromToken(authToken: string): Promise<MedusaSession> {
  const { response } = await requestMedusa<Record<string, unknown>>(
    "/auth/session",
    {
      method: "POST",
    },
    {
      authToken,
      includePublishableKey: false,
    },
  );

  return parseSessionCookie(response);
}

function readAuthToken(payload: MedusaAuthResponse): string {
  if (typeof payload.token === "string" && payload.token.trim()) {
    return payload.token;
  }

  if (payload.verification_required) {
    throw new MedusaRequestError(
      "This account requires email verification before it can be used.",
      409,
    );
  }

  if (payload.location) {
    throw new MedusaRequestError(
      "This authentication flow requires additional steps that are not supported here.",
      409,
    );
  }

  throw new MedusaRequestError("Medusa did not return an auth token.", 502);
}

async function authenticateCustomer(
  email: string,
  password: string,
): Promise<MedusaSession> {
  const { data } = await requestMedusa<MedusaAuthResponse>(
    "/auth/customer/emailpass",
    {
      method: "POST",
      json: {
        email,
        password,
      },
    },
    {
      includePublishableKey: false,
    },
  );

  return createSessionFromToken(readAuthToken(data));
}

function getMetadataValue(
  metadata: JsonRecord | null | undefined,
  key: string,
): string {
  const value = metadata?.[key];
  return typeof value === "string" ? value.trim() : "";
}

function inferPhoneCode(phone: string): string {
  const knownCodes = [
    "+971",
    "+91",
    "+81",
    "+65",
    "+61",
    "+49",
    "+44",
    "+33",
    "+86",
    "+1",
  ];

  return knownCodes.find((code) => phone.startsWith(code)) ?? "+1";
}

function stripPhoneCode(phone: string, phoneCode: string): string {
  if (!phone || !phoneCode || !phone.startsWith(phoneCode)) {
    return phone;
  }

  return phone.slice(phoneCode.length).trim();
}

function combinePhone(phoneCode: string, phone: string): string {
  const normalizedPhoneCode = phoneCode.trim() || "+1";
  const normalizedPhone = phone.trim();

  return normalizedPhone
    ? `${normalizedPhoneCode} ${normalizedPhone}`.trim()
    : normalizedPhoneCode;
}

function mapPublicCustomer(customer: MedusaCustomer): PublicCustomer {
  const metadata = customer.metadata ?? {};
  const rawPhone = normalizeString(customer.phone);
  const phoneCode = getMetadataValue(metadata, "phone_country_code") || inferPhoneCode(rawPhone);
  const phone = getMetadataValue(metadata, "phone_number") || stripPhoneCode(rawPhone, phoneCode);

  return {
    id: normalizeString(customer.id),
    email: normalizeString(customer.email),
    firstName: normalizeString(customer.first_name),
    lastName: normalizeString(customer.last_name),
    phone,
    phoneCode,
    companyName: normalizeString(customer.company_name),
    gender: getMetadataValue(metadata, "gender"),
    dateOfBirth: getMetadataValue(metadata, "date_of_birth"),
  };
}

function mapAddress(address: MedusaCustomerAddress): AccountAddress | null {
  const id = normalizeString(address.id);
  if (!id) {
    return null;
  }

  const countryCode = normalizeCountryCode(address.country_code);

  return {
    id,
    company: normalizeString(address.company),
    countryCode,
    countryLabel: getCountryLabel(countryCode),
    address1: normalizeString(address.address_1),
    address2: normalizeString(address.address_2),
    city: normalizeString(address.city),
    state: normalizeString(address.province),
    zip: normalizeString(address.postal_code),
    phone: normalizeString(address.phone),
    isDefaultShipping: Boolean(address.is_default_shipping),
    isDefaultBilling: Boolean(address.is_default_billing),
  };
}

function mapOrderItem(item: MedusaOrderLineItem, index: number): AccountOrderItem {
  const quantity =
    typeof item.quantity === "number" && Number.isFinite(item.quantity)
      ? item.quantity
      : 1;
  const rawUnitPrice =
    typeof item.unit_price === "number" && Number.isFinite(item.unit_price)
      ? item.unit_price
      : 0;

  return {
    id: normalizeString(item.id) || `item-${index}`,
    name:
      normalizeString(item.product_title) ||
      normalizeString(item.title) ||
      "Product",
    variant: normalizeString(item.variant_title),
    quantity,
    unitPrice: Number((rawUnitPrice / 100).toFixed(2)),
    ...(normalizeString(item.thumbnail)
      ? { thumbnail: normalizeString(item.thumbnail) }
      : {}),
  };
}

function normalizeOrderStatus(value: string): AccountOrder["status"] {
  switch (value) {
    case "pending":
    case "requires_action":
    case "completed":
    case "draft":
    case "archived":
    case "canceled":
      return value;
    default:
      return "pending";
  }
}

function mapOrder(order: MedusaOrder): AccountOrder | null {
  const id = normalizeString(order.id);
  if (!id) {
    return null;
  }

  const total =
    typeof order.total === "number" && Number.isFinite(order.total)
      ? Number((order.total / 100).toFixed(2))
      : 0;

  return {
    id,
    displayId:
      typeof order.display_id === "number" && Number.isFinite(order.display_id)
        ? order.display_id
        : null,
    status: normalizeOrderStatus(normalizeString(order.status)),
    createdAt:
      normalizeString(order.created_at) || new Date(0).toISOString(),
    total,
    currencyCode: normalizeString(order.currency_code) || "usd",
    items: (order.items ?? []).map(mapOrderItem).filter(Boolean),
  };
}

export function setMedusaSessionCookies(
  response: NextResponse,
  session: MedusaSession,
) {
  const cookieOptions = getCookieOptions(session.maxAge);
  response.cookies.set(MEDUSA_SESSION_NAME_COOKIE, session.name, cookieOptions);
  response.cookies.set(MEDUSA_SESSION_VALUE_COOKIE, session.value, cookieOptions);
}

export function clearMedusaSessionCookies(response: NextResponse) {
  const cookieOptions = getCookieOptions(0);
  response.cookies.set(MEDUSA_SESSION_NAME_COOKIE, "", cookieOptions);
  response.cookies.set(MEDUSA_SESSION_VALUE_COOKIE, "", cookieOptions);
}

export async function getStoredMedusaSession(): Promise<MedusaSession | null> {
  const cookieStore = await cookies();
  const name = cookieStore.get(MEDUSA_SESSION_NAME_COOKIE)?.value?.trim();
  const value = cookieStore.get(MEDUSA_SESSION_VALUE_COOKIE)?.value?.trim();

  if (!name || !value) {
    return null;
  }

  return {
    name,
    value,
    maxAge: DEFAULT_SESSION_MAX_AGE_SECONDS,
  };
}

async function fetchAuthenticatedCustomer(
  session: MedusaSession,
): Promise<MedusaCustomer | null> {
  try {
    const { data } = await requestMedusa<MedusaCustomerResponse>(
      "/store/customers/me",
      {},
      {
        session,
      },
    );

    return data.customer ?? null;
  } catch (error) {
    if (error instanceof MedusaRequestError && error.status === 401) {
      return null;
    }

    throw error;
  }
}

export async function getAuthenticatedCustomer(): Promise<PublicCustomer | null> {
  const session = await getStoredMedusaSession();
  if (!session) {
    return null;
  }

  const customer = await fetchAuthenticatedCustomer(session);
  return customer ? mapPublicCustomer(customer) : null;
}

async function getAuthenticatedCustomerContext(): Promise<AuthenticatedCustomerContext> {
  const session = await getStoredMedusaSession();
  if (!session) {
    throw new MedusaRequestError("Please sign in to continue.", 401);
  }

  const customer = await fetchAuthenticatedCustomer(session);
  if (!customer) {
    throw new MedusaRequestError("Your session has expired. Please sign in again.", 401);
  }

  return { session, customer };
}

export async function loginCustomerSession(email: string, password: string) {
  const session = await authenticateCustomer(email, password);
  const customer = await fetchAuthenticatedCustomer(session);

  if (!customer) {
    throw new MedusaRequestError(
      "Your account was authenticated, but the customer profile could not be loaded.",
      502,
    );
  }

  return {
    session,
    customer: mapPublicCustomer(customer),
  };
}

export async function registerCustomerSession(input: RegisterCustomerInput) {
  const email = normalizeString(input.email).toLowerCase();
  const password = input.password;
  const firstName = normalizeString(input.firstName);
  const lastName = normalizeString(input.lastName);
  const phoneCode = normalizeString(input.phoneCode) || "+1";
  const phone = normalizeString(input.phone);

  const { data } = await requestMedusa<MedusaAuthResponse>(
    "/auth/customer/emailpass/register",
    {
      method: "POST",
      json: {
        email,
        password,
      },
    },
    {
      includePublishableKey: false,
    },
  );

  const registrationToken = readAuthToken(data);

  await requestMedusa<MedusaCustomerResponse>(
    "/store/customers",
    {
      method: "POST",
      json: {
        email,
        first_name: firstName,
        last_name: lastName,
        phone: combinePhone(phoneCode, phone),
        metadata: {
          phone_country_code: phoneCode,
          phone_number: phone,
        },
      },
    },
    {
      authToken: registrationToken,
    },
  );

  return loginCustomerSession(email, password);
}

export async function destroyCurrentMedusaSession(): Promise<void> {
  const session = await getStoredMedusaSession();
  if (!session) {
    return;
  }

  try {
    await requestMedusa<Record<string, unknown>>(
      "/auth/session",
      {
        method: "DELETE",
      },
      {
        session,
        includePublishableKey: false,
      },
    );
  } catch (error) {
    if (error instanceof MedusaRequestError && error.status === 401) {
      return;
    }

    throw error;
  }
}

export async function getCustomerProfile(): Promise<PublicCustomer> {
  const { customer } = await getAuthenticatedCustomerContext();
  return mapPublicCustomer(customer);
}

export async function updateCustomerProfile(
  input: UpdateCustomerProfileInput,
): Promise<PublicCustomer> {
  const { session } = await getAuthenticatedCustomerContext();
  const firstName = normalizeString(input.firstName);
  const lastName = normalizeString(input.lastName);
  const companyName = normalizeString(input.companyName);
  const phoneCode = normalizeString(input.phoneCode) || "+1";
  const phone = normalizeString(input.phone);
  const gender = normalizeString(input.gender);
  const dateOfBirth = normalizeString(input.dateOfBirth);

  const { data } = await requestMedusa<MedusaCustomerResponse>(
    "/store/customers/me",
    {
      method: "POST",
      json: {
        first_name: firstName,
        last_name: lastName,
        company_name: companyName,
        phone: combinePhone(phoneCode, phone),
        metadata: {
          phone_country_code: phoneCode,
          phone_number: phone,
          gender,
          date_of_birth: dateOfBirth,
        },
      },
    },
    {
      session,
    },
  );

  if (!data.customer) {
    throw new MedusaRequestError("Medusa did not return the updated profile.", 502);
  }

  return mapPublicCustomer(data.customer);
}

export async function listCustomerAddresses(): Promise<AccountAddress[]> {
  const { session } = await getAuthenticatedCustomerContext();
  const { data } = await requestMedusa<MedusaAddressesResponse>(
    "/store/customers/me/addresses?limit=20",
    {},
    {
      session,
    },
  );

  return (data.addresses ?? []).map(mapAddress).filter((address): address is AccountAddress => address != null);
}

export async function upsertCustomerAddress(
  input: UpsertCustomerAddressInput,
): Promise<AccountAddress[]> {
  const { session, customer } = await getAuthenticatedCustomerContext();
  const payload = {
    first_name: normalizeString(input.firstName) || normalizeString(customer.first_name),
    last_name: normalizeString(input.lastName) || normalizeString(customer.last_name),
    phone: normalizeString(input.phone),
    company: normalizeString(input.company),
    address_1: normalizeString(input.address1),
    address_2: normalizeString(input.address2),
    city: normalizeString(input.city),
    country_code: normalizeCountryCode(input.countryCode),
    province: formatProvinceCode(input.countryCode, input.state),
    postal_code: normalizeString(input.zip),
    address_name:
      normalizeString(input.company) ||
      `${normalizeString(customer.first_name)} ${normalizeString(customer.last_name)}`.trim() ||
      "Default address",
    is_default_shipping: true,
    is_default_billing: true,
  };
  const normalizedAddressId = normalizeString(input.addressId);

  await requestMedusa<MedusaCustomerResponse>(
    normalizedAddressId
      ? `/store/customers/me/addresses/${normalizedAddressId}`
      : "/store/customers/me/addresses",
    {
      method: "POST",
      json: payload,
    },
    {
      session,
    },
  );

  return listCustomerAddresses();
}

export async function listCustomerOrders(): Promise<AccountOrder[]> {
  const { session } = await getAuthenticatedCustomerContext();
  const { data } = await requestMedusa<MedusaOrdersResponse>(
    "/store/orders?limit=50&order=-created_at",
    {},
    {
      session,
    },
  );

  return (data.orders ?? []).map(mapOrder).filter((order): order is AccountOrder => order != null);
}

export async function requestCustomerPasswordReset(email: string): Promise<void> {
  const normalizedEmail = normalizeString(email).toLowerCase();
  if (!normalizedEmail) {
    throw new MedusaRequestError("Please enter a valid email address.", 400);
  }

  await requestMedusa<Record<string, unknown>>(
    "/auth/customer/emailpass/reset-password",
    {
      method: "POST",
      json: {
        identifier: normalizedEmail,
      },
    },
    {
      includePublishableKey: false,
    },
  );
}

export function getResponseStatus(error: unknown): number {
  return error instanceof MedusaRequestError ? error.status : 500;
}

export function getResponseMessage(error: unknown): string {
  if (error instanceof MedusaRequestError) {
    return error.message;
  }

  return "Unexpected error. Please try again.";
}
