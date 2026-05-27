import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    testTimeout: 20000, // bcrypt operations and HTTP server setup can be slow
    include: ['tests/**/*.test.ts'],
  },
});
