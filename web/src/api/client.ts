const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:4000";

export interface CatalogItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: "food" | "drink" | "retail";
  section: string;
  dietary: string[];
}

export interface Location {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
}

export interface PlatePassPlan {
  id: string;
  name: string;
  cadence: "MONTHLY" | "ANNUAL";
  price: number;
  currency: string;
  perks: string[];
}

export interface CustomerInput {
  givenName: string;
  familyName?: string;
  email: string;
  phone?: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as any).error ?? `Request failed (${res.status})`);
  }
  return data as T;
}

export const api = {
  health: () => request<{ status: string; mode: string }>("/api/health"),

  catalog: (category?: string) =>
    request<{ items: CatalogItem[]; source: string }>(
      `/api/catalog${category ? `?category=${category}` : ""}`,
    ),

  locations: () =>
    request<{ locations: Location[] }>("/api/locations"),

  createOrder: (body: {
    lineItems: { catalogObjectId: string; quantity: number }[];
    fulfillment?: "PICKUP" | "SHIPMENT";
    customerId?: string;
  }) => request<{ order: any; source: string }>("/api/orders", {
    method: "POST",
    body: JSON.stringify(body),
  }),

  pay: (orderId: string) =>
    request<{ payment: any; order: any; source: string }>("/api/payments", {
      method: "POST",
      body: JSON.stringify({ orderId }),
    }),

  availability: (date: string) =>
    request<{ date: string; slots: { startAt: string; available: boolean }[] }>(
      `/api/bookings/availability?date=${date}`,
    ),

  createBooking: (body: {
    startAt: string;
    partySize: number;
    note?: string;
    customer: CustomerInput;
  }) => request<{ booking: any; customer: any; source: string }>("/api/bookings", {
    method: "POST",
    body: JSON.stringify(body),
  }),

  plans: () => request<{ plans: PlatePassPlan[] }>("/api/subscriptions/plans"),

  subscribe: (body: { planId: string; customer: CustomerInput }) =>
    request<{ subscription: any; plan: PlatePassPlan; customer: any; source: string }>(
      "/api/subscriptions",
      { method: "POST", body: JSON.stringify(body) },
    ),

  enrollLoyalty: (body: { customer: CustomerInput }) =>
    request<{ account: any; customer: any; source: string }>(
      "/api/loyalty/accounts",
      { method: "POST", body: JSON.stringify(body) },
    ),
};

export const formatAUD = (cents: number): string =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(cents / 100);
