// vitest.config.ts

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // Enables using describe, it, expect globally
    environment: 'node', // Node environment for testing backend
  },
  plugins: [], // Supports TypeScript path mapping
});
