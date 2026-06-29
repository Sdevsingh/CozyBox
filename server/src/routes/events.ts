import { Router } from "express";
import { EVENTS } from "../data/seed.js";
import { ApiError, asyncHandler } from "../util/http.js";

export const eventsRouter: Router = Router();

eventsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const events = [...EVENTS].sort((a, b) => a.date.localeCompare(b.date));
    res.json({ events, source: "seed" });
  }),
);

eventsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const event = EVENTS.find((e) => e.id === req.params.id);
    if (!event) throw new ApiError(404, "Event not found");
    res.json({ event });
  }),
);
