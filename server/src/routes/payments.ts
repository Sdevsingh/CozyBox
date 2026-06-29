import { Router } from "express";
import { z } from "zod";
import { useMock } from "../env.js";
import { db, newId, nowIso, type Payment } from "../store.js";
import { squareFetch } from "../square/client.js";
import { ApiError, asyncHandler } from "../util/http.js";

const paymentSchema = z.object({
  orderId: z.string(),
  // From the Square Web Payments SDK on the client. In mock mode any value
  // works; the demo uses Square's "cnon:card-nonce-ok" sandbox token.
  sourceId: z.string().default("cnon:card-nonce-ok"),
});

export const paymentsRouter: Router = Router();

paymentsRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const input = paymentSchema.parse(req.body);

    if (useMock) {
      const order = db.orders.get(input.orderId);
      if (!order) throw new ApiError(404, "Order not found");
      const payment: Payment = {
        id: newId("PAY"),
        orderId: order.id,
        amountMoney: order.totalMoney,
        status: "COMPLETED",
        sourceType: "CARD",
        createdAt: nowIso(),
      };
      db.payments.set(payment.id, payment);
      order.state = "COMPLETED";
      db.orders.set(order.id, order);
      return res.status(201).json({ payment, order, source: "mock" });
    }

    const order = await squareFetch<any>(`/v2/orders/${input.orderId}`);
    const total = order.order?.total_money;
    const data = await squareFetch<any>("/v2/payments", {
      method: "POST",
      body: {
        idempotency_key: newId("idem"),
        source_id: input.sourceId,
        order_id: input.orderId,
        amount_money: total,
      },
    });
    res.status(201).json({ payment: data.payment, source: "square" });
  }),
);
