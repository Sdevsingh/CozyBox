import { api } from "./api";

// Cached public config from the backend (Square ids + feature flags)
let _configPromise = null;
export function getConfig() {
  if (!_configPromise) {
    _configPromise = api.get("/config").then((r) => r.data).catch(() => ({ enabled: false }));
  }
  return _configPromise;
}

// Load the Square Web Payments SDK once, for the right environment.
let _sdkPromise = null;
export function loadSquareSdk(environment) {
  if (window.Square) return Promise.resolve(window.Square);
  if (_sdkPromise) return _sdkPromise;

  const src =
    environment === "production"
      ? "https://web.squarecdn.com/v1/square.js"
      : "https://sandbox.web.squarecdn.com/v1/square.js";

  _sdkPromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => resolve(window.Square);
    s.onerror = () => reject(new Error("Failed to load Square Web Payments SDK"));
    document.head.appendChild(s);
  });
  return _sdkPromise;
}
