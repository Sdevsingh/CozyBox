import { Router } from "express";
import { z } from "zod";
import { useMock, env } from "../env.js";
import { PLATE_PASS_PLANS } from "../data/seed.js";
import { db, newId, nowIso, type Subscription } from "../store.js";
import { squareFetch } from "../square/client.js";
import { ApiError, asyncHandler } from "../util/http.js";
import { customerSchema, upsertCustomer } from "./customers.js";

export const subscriptionsRouter: Router = Router();

subscriptionsRouter.get(
  "/plans",
  asyncHandler(async (_req, res) => {
    res.json({ plans: PLATE_PASS_PLANS, source: useMock ? "mock" : "seed" });
  }),
);

const subscribeSchema = z.object({
  planId: z.string(),
  customer: customerSchema,
});

subscriptionsRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const input = subscribeSchema.parse(req.body);
    const plan = PLATE_PASS_PLANS.find((p) => p.id === input.planId);
    if (!plan) throw new ApiError(400, "Unknown plan");
    const customer = await upsertCustomer(input.customer);

    if (useMock) {
      const subscription: Subscription = {
        id: newId("SUB"),
        planId: plan.id,
        customerId: customer.id,
        status: "ACTIVE",
        startDate: nowIso().slice(0, 10),
        createdAt: nowIso(),
      };
      db.subscriptions.set(subscription.id, subscription);
      return res
        .status(201)
        .json({ subscription, plan, customer, source: "mock" });
    }

    const data = await squareFetch<any>("/v2/subscriptions", {
      method: "POST",
      body: {
        idempotency_key: newId("idem"),
        location_id: env.square.locationId,
        plan_variation_id: plan.id,
        customer_id: customer.id,
      },
    });
    res
      .status(201)
      .json({ subscription: data.subscription, plan, customer, source: "square" });
  }),
);
