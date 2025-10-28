/**
 * Mock for webextension-polyfill
 * Used in tests to simulate browser extension APIs
 */

const browser = {
  storage: {
    local: {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
      clear: jest.fn(),
    },
    sync: {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
      clear: jest.fn(),
    },
  },
  runtime: {
    sendMessage: jest.fn(),
    onMessage: {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    },
    getManifest: jest.fn(() => ({ version: '1.0.0' })),
    getURL: jest.fn((path: string) => `chrome-extension://test/${path}`),
    id: 'test-extension-id',
  },
  tabs: {
    query: jest.fn(),
    sendMessage: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  },
  contextMenus: {
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    removeAll: jest.fn(),
    onClicked: {
      addListener: jest.fn(),
    },
  },
  action: {
    onClicked: {
      addListener: jest.fn(),
    },
  },
  browserAction: {
    onClicked: {
      addListener: jest.fn(),
    },
  },
};

export default browser;
