import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  // Read VITE_* variables from the repo-root .env so one file configures both
  // the server and the web app.
  envDir: "..",
  server: {
    port: 5173,
    host: true,
  },
});
