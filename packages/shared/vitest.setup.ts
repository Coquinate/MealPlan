import { vi } from 'vitest';

// Setup localStorage mock
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

// Add to global
(global as any).localStorage = localStorageMock;
(global as any).window = {
  localStorage: localStorageMock,
};
