import { Router } from "express";
import { z } from "zod";
import { useMock, env } from "../env.js";
import { CATALOG } from "../data/seed.js";
import {
  db,
  newId,
  nowIso,
  type Order,
  type OrderLineItem,
} from "../store.js";
import { squareFetch } from "../square/client.js";
import { ApiError, asyncHandler } from "../util/http.js";

const orderSchema = z.object({
  locationId: z.string().optional(),
  fulfillment: z.enum(["PICKUP", "SHIPMENT"]).default("PICKUP"),
  customerId: z.string().optional(),
  lineItems: z
    .array(
      z.object({
        catalogObjectId: z.string(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
});

export const ordersRouter: Router = Router();

ordersRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const input = orderSchema.parse(req.body);

    if (useMock) {
      const lineItems: OrderLineItem[] = input.lineItems.map((li) => {
        const item = CATALOG.find((c) => c.id === li.catalogObjectId);
        if (!item) throw new ApiError(400, `Unknown item ${li.catalogObjectId}`);
        return {
          catalogObjectId: item.id,
          name: item.name,
          quantity: li.quantity,
          basePrice: { amount: item.price, currency: "AUD" },
        };
      });
      const amount = lineItems.reduce(
        (sum, li) => sum + li.basePrice.amount * li.quantity,
        0,
      );
      const order: Order = {
        id: newId("ORDER"),
        locationId: input.locationId ?? "LOC_CARLTON",
        lineItems,
        totalMoney: { amount, currency: "AUD" },
        state: "OPEN",
        fulfillment: input.fulfillment,
        customerId: input.customerId,
        createdAt: nowIso(),
      };
      db.orders.set(order.id, order);
      return res.status(201).json({ order, source: "mock" });
    }

    const data = await squareFetch<any>("/v2/orders", {
      method: "POST",
      body: {
        idempotency_key: newId("idem"),
        order: {
          location_id: input.locationId ?? env.square.locationId,
          customer_id: input.customerId,
          line_items: input.lineItems.map((li) => ({
            catalog_object_id: li.catalogObjectId,
            quantity: String(li.quantity),
          })),
        },
      },
    });
    res.status(201).json({ order: data.order, source: "square" });
  }),
);

ordersRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    if (useMock) {
      const order = db.orders.get(req.params.id);
      if (!order) throw new ApiError(404, "Order not found");
      return res.json({ order });
    }
    const data = await squareFetch<any>(`/v2/orders/${req.params.id}`);
    res.json({ order: data.order });
  }),
);
