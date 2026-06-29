import { Router } from "express";
import { z } from "zod";
import { PACKAGES } from "../data/seed.js";
import {
  db,
  newId,
  nowIso,
  type FunctionEnquiry,
} from "../store.js";
import { ApiError, asyncHandler } from "../util/http.js";
import { customerSchema, upsertCustomer } from "./customers.js";

export const packagesRouter: Router = Router();

packagesRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json({ packages: PACKAGES, source: "seed" });
  }),
);

const enquirySchema = z.object({
  packageId: z.string(),
  preferredDate: z.string().optional(),
  guests: z.number().int().positive().max(500),
  message: z.string().optional(),
  customer: customerSchema,
});

packagesRouter.post(
  "/enquiries",
  asyncHandler(async (req, res) => {
    const input = enquirySchema.parse(req.body);
    const pkg = PACKAGES.find((p) => p.id === input.packageId);
    if (!pkg) throw new ApiError(400, "Unknown package");
    const customer = await upsertCustomer(input.customer);

    const enquiry: FunctionEnquiry = {
      id: newId("ENQ"),
      packageId: pkg.id,
      customerId: customer.id,
      preferredDate: input.preferredDate,
      guests: input.guests,
      message: input.message,
      status: "NEW",
      createdAt: nowIso(),
    };
    db.enquiries.set(enquiry.id, enquiry);
    res.status(201).json({ enquiry, package: pkg, customer, source: "mock" });
  }),
);
