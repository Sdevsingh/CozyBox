/**
 * In-memory data store used in mock mode (no Square credentials). State lives
 * for the lifetime of the process — perfect for local development and demos.
 */
import { randomUUID } from "node:crypto";

export interface Money {
  amount: number;
  currency: "AUD";
}

export interface OrderLineItem {
  catalogObjectId: string;
  name: string;
  quantity: number;
  basePrice: Money;
}

export interface Order {
  id: string;
  locationId: string;
  lineItems: OrderLineItem[];
  totalMoney: Money;
  state: "OPEN" | "COMPLETED" | "CANCELED";
  fulfillment: "PICKUP" | "SHIPMENT";
  customerId?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  amountMoney: Money;
  status: "COMPLETED" | "FAILED";
  sourceType: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  givenName: string;
  familyName?: string;
  email: string;
  phone?: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  locationId: string;
  customerId: string;
  startAt: string;
  partySize: number;
  status: "PENDING" | "ACCEPTED" | "CANCELLED";
  note?: string;
  createdAt: string;
}

export interface LoyaltyAccount {
  id: string;
  customerId: string;
  programId: string;
  balance: number;
  lifetimePoints: number;
  createdAt: string;
}

export interface Subscription {
  id: string;
  planId: string;
  customerId: string;
  status: "ACTIVE" | "CANCELED";
  startDate: string;
  createdAt: string;
}

export interface FunctionEnquiry {
  id: string;
  packageId: string;
  customerId: string;
  preferredDate?: string;
  guests: number;
  message?: string;
  status: "NEW";
  createdAt: string;
}

interface DB {
  orders: Map<string, Order>;
  payments: Map<string, Payment>;
  customers: Map<string, Customer>;
  bookings: Map<string, Booking>;
  loyalty: Map<string, LoyaltyAccount>;
  subscriptions: Map<string, Subscription>;
  enquiries: Map<string, FunctionEnquiry>;
}

export const db: DB = {
  orders: new Map(),
  payments: new Map(),
  customers: new Map(),
  bookings: new Map(),
  loyalty: new Map(),
  subscriptions: new Map(),
  enquiries: new Map(),
};

export const newId = (prefix: string): string =>
  `${prefix}_${randomUUID().replace(/-/g, "").slice(0, 18).toUpperCase()}`;

export const nowIso = (): string => new Date().toISOString();
