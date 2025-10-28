/**
 * Jest setup file
 * Runs before each test suite
 */

// Mock browser APIs
global.browser = {
  storage: {
    local: {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
    },
  },
  runtime: {
    sendMessage: jest.fn(),
    onMessage: {
      addListener: jest.fn(),
    },
    getManifest: jest.fn(() => ({ version: '1.0.0' })),
  },
  tabs: {
    query: jest.fn(),
    sendMessage: jest.fn(),
  },
} as any;

// Mock chrome APIs (alias for browser)
global.chrome = global.browser as any;

// Mock crypto API
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: (arr: Uint32Array) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 0xffffffff);
      }
      return arr;
    },
  },
});

// Mock console methods in tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};
