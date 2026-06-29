import { Router } from "express";
import { useMock } from "../env.js";
import { LOCATIONS } from "../data/seed.js";
import { squareFetch } from "../square/client.js";
import { asyncHandler } from "../util/http.js";

export const locationsRouter: Router = Router();

locationsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    if (useMock) {
      return res.json({ locations: LOCATIONS, source: "mock" });
    }
    const data = await squareFetch<any>("/v2/locations");
    const locations = (data.locations ?? []).map((l: any) => ({
      id: l.id,
      name: l.name,
      address: [l.address?.address_line_1, l.address?.locality, l.address?.postal_code]
        .filter(Boolean)
        .join(", "),
      phone: l.phone_number ?? "",
      timezone: l.timezone ?? "",
      hours: "",
    }));
    res.json({ locations, source: "square" });
  }),
);
