import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    // TanStack Start injects the router plugin, so it must run before React's JSX transform.
    tanstackStart({
      server: { entry: "server" },
    }),
    tailwindcss(),
    react(),
  ],
});
