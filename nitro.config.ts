import { defineNitroConfig } from 'nitro/config'

export default defineNitroConfig({
  preset: 'vercel',
  serverEntry: {
    handler: './server.ts',
    format: 'web',
  },
})
