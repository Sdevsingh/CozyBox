import { Router } from "express";
import { z } from "zod";
import { useMock } from "../env.js";
import { LOYALTY_PROGRAM } from "../data/seed.js";
import { db, newId, nowIso, type LoyaltyAccount } from "../store.js";
import { squareFetch } from "../square/client.js";
import { ApiError, asyncHandler } from "../util/http.js";
import { customerSchema, upsertCustomer } from "./customers.js";

export const loyaltyRouter: Router = Router();

loyaltyRouter.get(
  "/program",
  asyncHandler(async (_req, res) => {
    if (useMock) return res.json({ program: LOYALTY_PROGRAM, source: "mock" });
    const data = await squareFetch<any>("/v2/loyalty/programs/main");
    res.json({ program: data.program, source: "square" });
  }),
);

const enrollSchema = z.object({ customer: customerSchema });

loyaltyRouter.post(
  "/accounts",
  asyncHandler(async (req, res) => {
    const input = enrollSchema.parse(req.body);
    const customer = await upsertCustomer(input.customer);

    if (useMock) {
      const existing = [...db.loyalty.values()].find(
        (a) => a.customerId === customer.id,
      );
      if (existing) return res.json({ account: existing, customer });
      const account: LoyaltyAccount = {
        id: newId("LOYAL"),
        customerId: customer.id,
        programId: LOYALTY_PROGRAM.id,
        balance: 0,
        lifetimePoints: 0,
        createdAt: nowIso(),
      };
      db.loyalty.set(account.id, account);
      return res.status(201).json({ account, customer, source: "mock" });
    }

    const data = await squareFetch<any>("/v2/loyalty/accounts", {
      method: "POST",
      body: {
        idempotency_key: newId("idem"),
        loyalty_account: { program_id: "main", customer_id: customer.id },
      },
    });
    res.status(201).json({ account: data.loyalty_account, customer, source: "square" });
  }),
);

const accrueSchema = z.object({
  accountId: z.string(),
  /** order subtotal in cents used to derive points */
  amount: z.number().int().nonnegative(),
});

loyaltyRouter.post(
  "/accrue",
  asyncHandler(async (req, res) => {
    const input = accrueSchema.parse(req.body);
    if (!useMock) throw new ApiError(501, "Use Square accumulate-points in Square mode");

    const account = db.loyalty.get(input.accountId);
    if (!account) throw new ApiError(404, "Loyalty account not found");
    const points = Math.floor((input.amount / 100) * LOYALTY_PROGRAM.pointsPerDollar);
    account.balance += points;
    account.lifetimePoints += points;
    db.loyalty.set(account.id, account);
    res.json({ account, pointsEarned: points, source: "mock" });
  }),
);

loyaltyRouter.get(
  "/accounts/:id",
  asyncHandler(async (req, res) => {
    if (useMock) {
      const account = db.loyalty.get(req.params.id);
      if (!account) throw new ApiError(404, "Loyalty account not found");
      return res.json({ account });
    }
    const data = await squareFetch<any>(`/v2/loyalty/accounts/${req.params.id}`);
    res.json({ account: data.loyalty_account });
  }),
);
