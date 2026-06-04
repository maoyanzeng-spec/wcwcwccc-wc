import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    env: {
      DB_PATH: ':memory:',
      ADMIN_KEY: 'test-admin-key',
    },
    setupFiles: ['./src/__tests__/setup.ts'],
  },
});
