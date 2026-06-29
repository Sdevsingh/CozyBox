import { fileURLToPath } from "node:url";
import path from "node:path";
import dotenv from "dotenv";

// The server lives in a workspace; load the repo-root .env (and a local one if
// present) so a single root .env can configure the whole monorepo.
const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../..");
dotenv.config({ path: path.join(repoRoot, ".env") });
dotenv.config({ path: path.join(repoRoot, "server", ".env") });

function bool(value: string | undefined): boolean {
  return value === "true" || value === "1";
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  webOrigins: (process.env.WEB_ORIGIN ?? "http://localhost:5173")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
  square: {
    accessToken: process.env.SQUARE_ACCESS_TOKEN ?? "",
    environment: (process.env.SQUARE_ENVIRONMENT ?? "sandbox") as
      | "sandbox"
      | "production",
    locationId: process.env.SQUARE_LOCATION_ID ?? "",
    apiVersion: process.env.SQUARE_VERSION ?? "2025-01-23",
  },
  verboseLogs: bool(process.env.VERBOSE_LOGS),
};

/**
 * When no Square access token is configured the server runs in "mock" mode:
 * it serves seeded CozyBox data from memory so the whole product works
 * end-to-end without external credentials.
 */
export const useMock = env.square.accessToken.trim().length === 0;
