import react from '@astrojs/react';
import { defineConfig } from 'astro/config';

export default defineConfig({
  integrations: [react()],
  server: {
    port: 4321,
    host: true,
  },
  vite: {
    worker: {
      format: 'es',
    },
    optimizeDeps: {
      include: ['react', 'react-dom', '@mantine/core', '@mantine/hooks'],
    },
  },
});
