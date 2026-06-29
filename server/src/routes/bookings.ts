import { Router } from "express";
import { z } from "zod";
import { useMock, env } from "../env.js";
import { db, newId, nowIso, type Booking } from "../store.js";
import { squareFetch } from "../square/client.js";
import { ApiError, asyncHandler } from "../util/http.js";
import { customerSchema, upsertCustomer } from "./customers.js";

export const bookingsRouter: Router = Router();

/** Simple dinner-service availability: 5pm–9pm in 30-min slots for a date. */
bookingsRouter.get(
  "/availability",
  asyncHandler(async (req, res) => {
    const date = (req.query.date as string) ?? nowIso().slice(0, 10);

    if (useMock) {
      const slots: string[] = [];
      for (let hour = 17; hour <= 21; hour++) {
        for (const min of [0, 30]) {
          const hh = String(hour).padStart(2, "0");
          const mm = String(min).padStart(2, "0");
          slots.push(`${date}T${hh}:${mm}:00`);
        }
      }
      // Pretend a couple of slots are already taken.
      const taken = new Set([slots[2], slots[5]]);
      return res.json({
        date,
        slots: slots.map((s) => ({ startAt: s, available: !taken.has(s) })),
        source: "mock",
      });
    }

    const data = await squareFetch<any>("/v2/bookings/availability/search", {
      method: "POST",
      body: {
        query: {
          filter: {
            start_at_range: {
              start_at: `${date}T00:00:00Z`,
              end_at: `${date}T23:59:59Z`,
            },
            location_id: env.square.locationId,
          },
        },
      },
    });
    const slots = (data.availabilities ?? []).map((a: any) => ({
      startAt: a.start_at,
      available: true,
    }));
    res.json({ date, slots, source: "square" });
  }),
);

const bookingSchema = z.object({
  startAt: z.string(),
  partySize: z.number().int().positive().max(20),
  note: z.string().optional(),
  locationId: z.string().optional(),
  customer: customerSchema,
});

bookingsRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const input = bookingSchema.parse(req.body);
    const customer = await upsertCustomer(input.customer);

    if (useMock) {
      const booking: Booking = {
        id: newId("BOOK"),
        locationId: input.locationId ?? "LOC_CARLTON",
        customerId: customer.id,
        startAt: input.startAt,
        partySize: input.partySize,
        status: "ACCEPTED",
        note: input.note,
        createdAt: nowIso(),
      };
      db.bookings.set(booking.id, booking);
      return res.status(201).json({ booking, customer, source: "mock" });
    }

    const data = await squareFetch<any>("/v2/bookings", {
      method: "POST",
      body: {
        booking: {
          location_id: input.locationId ?? env.square.locationId,
          customer_id: customer.id,
          start_at: input.startAt,
          appointment_segments: [
            { duration_minutes: 90, team_member_id: "" },
          ],
          customer_note: input.note,
        },
      },
    });
    res.status(201).json({ booking: data.booking, customer, source: "square" });
  }),
);

bookingsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    if (useMock) {
      const booking = db.bookings.get(req.params.id);
      if (!booking) throw new ApiError(404, "Booking not found");
      return res.json({ booking });
    }
    const data = await squareFetch<any>(`/v2/bookings/${req.params.id}`);
    res.json({ booking: data.booking });
  }),
);
