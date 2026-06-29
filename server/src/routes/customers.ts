import { Router } from "express";
import { z } from "zod";
import { useMock } from "../env.js";
import { db, newId, nowIso, type Customer } from "../store.js";
import { squareFetch } from "../square/client.js";
import { ApiError, asyncHandler } from "../util/http.js";

export const customerSchema = z.object({
  givenName: z.string().min(1),
  familyName: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
});

/** Find an existing customer by email or create a new one (mock + Square). */
export async function upsertCustomer(
  input: z.infer<typeof customerSchema>,
): Promise<Customer> {
  if (useMock) {
    const existing = [...db.customers.values()].find(
      (c) => c.email.toLowerCase() === input.email.toLowerCase(),
    );
    if (existing) return existing;
    const customer: Customer = {
      id: newId("CUST"),
      givenName: input.givenName,
      familyName: input.familyName,
      email: input.email,
      phone: input.phone,
      createdAt: nowIso(),
    };
    db.customers.set(customer.id, customer);
    return customer;
  }

  const search = await squareFetch<any>("/v2/customers/search", {
    method: "POST",
    body: { query: { filter: { email_address: { exact: input.email } } } },
  });
  const found = search.customers?.[0];
  if (found) {
    return {
      id: found.id,
      givenName: found.given_name ?? input.givenName,
      familyName: found.family_name,
      email: found.email_address ?? input.email,
      phone: found.phone_number,
      createdAt: found.created_at ?? nowIso(),
    };
  }
  const created = await squareFetch<any>("/v2/customers", {
    method: "POST",
    body: {
      given_name: input.givenName,
      family_name: input.familyName,
      email_address: input.email,
      phone_number: input.phone,
    },
  });
  const c = created.customer;
  return {
    id: c.id,
    givenName: c.given_name ?? input.givenName,
    familyName: c.family_name,
    email: c.email_address ?? input.email,
    phone: c.phone_number,
    createdAt: c.created_at ?? nowIso(),
  };
}

export const customersRouter: Router = Router();

customersRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const input = customerSchema.parse(req.body);
    const customer = await upsertCustomer(input);
    res.status(201).json({ customer });
  }),
);

customersRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    if (useMock) {
      const customer = db.customers.get(req.params.id);
      if (!customer) throw new ApiError(404, "Customer not found");
      return res.json({ customer });
    }
    const data = await squareFetch<any>(`/v2/customers/${req.params.id}`);
    res.json({ customer: data.customer });
  }),
);
