import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react()],
  preview: {
    port: 8080, // Only used for preview, not dev
    strictPort: true,
  },
  server: {
    port: 3000, // Set dev server port here
    strictPort: true, // Ensure it fails if port 5173 isn't available
    host: "0.0.0.0", // Bind to all network interfaces
    origin: "http://localhost:5173", // Public-facing URL
  },
});

