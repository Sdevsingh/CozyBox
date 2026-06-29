import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import morgan from "morgan";
import { ZodError } from "zod";
import { env, useMock } from "./env.js";
import { ApiError } from "./util/http.js";
import { SquareError } from "./square/client.js";
import { catalogRouter } from "./routes/catalog.js";
import { locationsRouter } from "./routes/locations.js";
import { customersRouter } from "./routes/customers.js";
import { ordersRouter } from "./routes/orders.js";
import { paymentsRouter } from "./routes/payments.js";
import { bookingsRouter } from "./routes/bookings.js";
import { loyaltyRouter } from "./routes/loyalty.js";
import { subscriptionsRouter } from "./routes/subscriptions.js";
import { eventsRouter } from "./routes/events.js";
import { packagesRouter } from "./routes/packages.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: env.webOrigins,
    credentials: true,
  }),
);

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    mode: useMock ? "mock" : "square",
    squareEnvironment: useMock ? null : env.square.environment,
    time: new Date().toISOString(),
  });
});

app.use("/api/catalog", catalogRouter);
app.use("/api/locations", locationsRouter);
app.use("/api/customers", customersRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/loyalty", loyaltyRouter);
app.use("/api/subscriptions", subscriptionsRouter);
app.use("/api/events", eventsRouter);
app.use("/api/packages", packagesRouter);

// 404 for unknown API routes
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Centralised error handling
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: "Validation failed", details: err.issues });
  }
  if (err instanceof ApiError) {
    return res.status(err.status).json({ error: err.message });
  }
  if (err instanceof SquareError) {
    return res.status(err.status).json({ error: err.message, details: err.details });
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(env.port, () => {
  console.log(
    `[cozybox] API listening on http://localhost:${env.port} ` +
      `(${useMock ? "mock data" : `Square ${env.square.environment}`})`,
  );
});
