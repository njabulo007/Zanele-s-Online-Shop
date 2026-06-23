// Root-level adapter for Vercel/Nitro builds.
// Nitro will import this file (e.g. /vercel/path0/server.ts).
// Forward to the already-built Vite server bundle to avoid unresolved virtual imports.
export { default } from './dist/server/server.js'
