import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless'; // ✅ ADD THIS LINE

export default defineConfig({
  output: 'server',
  adapter: vercel(), // ✅ AND THIS LINE
});
