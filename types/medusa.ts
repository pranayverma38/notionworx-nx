export interface PublicCustomer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  phoneCode: string;
  companyName: string;
  gender: string;
  dateOfBirth: string;
}

export interface AccountAddress {
  id: string;
  company: string;
  countryCode: string;
  countryLabel: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
}

export type AccountOrderStatus =
  | "pending"
  | "requires_action"
  | "completed"
  | "draft"
  | "archived"
  | "canceled";

export interface AccountOrderItem {
  id: string;
  name: string;
  variant: string;
  quantity: number;
  unitPrice: number;
  thumbnail?: string;
}

export interface AccountOrder {
  id: string;
  displayId: number | null;
  status: AccountOrderStatus;
  createdAt: string;
  total: number;
  currencyCode: string;
  items: AccountOrderItem[];
}
