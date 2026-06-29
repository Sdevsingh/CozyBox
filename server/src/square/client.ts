/**
 * Thin Square Connect v2 REST adapter. Used only when SQUARE_ACCESS_TOKEN is
 * configured. Keeping this as plain REST (rather than the SDK) avoids SDK
 * breaking-change churn and pins behaviour via the Square-Version header.
 */
import { env } from "../env.js";

const BASE_URL: Record<"sandbox" | "production", string> = {
  sandbox: "https://connect.squareupsandbox.com",
  production: "https://connect.squareup.com",
};

export class SquareError extends Error {
  status: number;
  details: unknown;
  constructor(status: number, message: string, details: unknown) {
    super(message);
    this.name = "SquareError";
    this.status = status;
    this.details = details;
  }
}

export async function squareFetch<T = any>(
  path: string,
  init: { method?: string; body?: unknown } = {},
): Promise<T> {
  const url = `${BASE_URL[env.square.environment]}${path}`;
  const res = await fetch(url, {
    method: init.method ?? "GET",
    headers: {
      Authorization: `Bearer ${env.square.accessToken}`,
      "Content-Type": "application/json",
      "Square-Version": env.square.apiVersion,
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
  });

  const text = await res.text();
  const json = text ? JSON.parse(text) : {};

  if (!res.ok) {
    const message =
      json?.errors?.[0]?.detail ?? `Square API error (${res.status})`;
    throw new SquareError(res.status, message, json?.errors ?? json);
  }
  return json as T;
}
