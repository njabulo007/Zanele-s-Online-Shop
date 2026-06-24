import { defineNitroConfig } from "nitro/config";

// Ensure Nitro picks up the Vite client build so it can copy static assets
// into the Vercel output `static` directory. The TanStack Start Vite build
// places client files into `dist/client` by default, so point Nitro's
// `publicDir` to that folder.
export default defineNitroConfig({
  preset: "vercel",
  publicDir: "dist/client",
});