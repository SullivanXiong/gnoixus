import { StorageManager, CryptoUtils, DOMUtils, Logger } from '../src/utils';
import browser from 'webextension-polyfill';

describe('StorageManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get value from storage', async () => {
    (browser.storage.local.get as jest.Mock).mockResolvedValue({
      testKey: 'testValue',
    });

    const result = await StorageManager.get('testKey');
    expect(result).toBe('testValue');
  });

  it('should return null for non-existent key', async () => {
    (browser.storage.local.get as jest.Mock).mockResolvedValue({});

    const result = await StorageManager.get('nonExistent');
    expect(result).toBeNull();
  });

  it('should set value in storage', async () => {
    await StorageManager.set('testKey', 'testValue');
    
    expect(browser.storage.local.set).toHaveBeenCalledWith({
      testKey: 'testValue',
    });
  });

  it('should get feature state', async () => {
    (browser.storage.local.get as jest.Mock).mockResolvedValue({
      feature_testFeature: false,
    });

    const state = await StorageManager.getFeatureState('testFeature');
    expect(state).toBe(false);
  });

  it('should default to enabled for new features', async () => {
    (browser.storage.local.get as jest.Mock).mockResolvedValue({});

    const state = await StorageManager.getFeatureState('newFeature');
    expect(state).toBe(true);
  });
});

describe('CryptoUtils', () => {
  it('should encrypt and decrypt data', () => {
    const data = 'secretPassword123';
    const key = 'masterKey';

    const encrypted = CryptoUtils.encrypt(data, key);
    expect(encrypted).not.toBe(data);

    const decrypted = CryptoUtils.decrypt(encrypted, key);
    expect(decrypted).toBe(data);
  });

  it('should fail to decrypt with wrong key', () => {
    const data = 'secretPassword123';
    const key = 'masterKey';
    const wrongKey = 'wrongKey';

    const encrypted = CryptoUtils.encrypt(data, key);
    const decrypted = CryptoUtils.decrypt(encrypted, wrongKey);
    
    expect(decrypted).not.toBe(data);
  });

  it('should generate password with default length', () => {
    const password = CryptoUtils.generatePassword();
    expect(password).toHaveLength(16);
  });

  it('should generate password with custom length', () => {
    const password = CryptoUtils.generatePassword(24);
    expect(password).toHaveLength(24);
  });

  it('should generate password with only lowercase', () => {
    const password = CryptoUtils.generatePassword(16, {
      includeUppercase: false,
      includeLowercase: true,
      includeNumbers: false,
      includeSymbols: false,
    });

    expect(password).toMatch(/^[a-z]+$/);
  });
});

describe('DOMUtils', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should inject styles', () => {
    const css = 'body { background: red; }';
    const style = DOMUtils.injectStyles(css);

    expect(style.textContent).toBe(css);
    expect(document.head.contains(style)).toBe(true);
  });

  it('should remove element', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    expect(document.body.contains(div)).toBe(true);
    DOMUtils.removeElement(div);
    expect(document.body.contains(div)).toBe(false);
  });

  it('should handle removing null element', () => {
    expect(() => DOMUtils.removeElement(null)).not.toThrow();
  });

  it('should debounce function calls', (done) => {
    let callCount = 0;
    const debouncedFn = DOMUtils.debounce(() => {
      callCount++;
    }, 100);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    expect(callCount).toBe(0);

    setTimeout(() => {
      expect(callCount).toBe(1);
      done();
    }, 150);
  });

  it('should detect code elements', () => {
    const pre = document.createElement('pre');
    expect(DOMUtils.isCodeElement(pre)).toBe(true);

    const code = document.createElement('code');
    expect(DOMUtils.isCodeElement(code)).toBe(true);

    const div = document.createElement('div');
    div.className = 'code';
    expect(DOMUtils.isCodeElement(div)).toBe(true);

    const normal = document.createElement('div');
    expect(DOMUtils.isCodeElement(normal)).toBe(false);
  });
});

describe('Logger', () => {
  it('should log messages', () => {
    Logger.log('test message');
    expect(console.log).toHaveBeenCalled();
  });

  it('should log errors', () => {
    Logger.error('error message');
    expect(console.error).toHaveBeenCalled();
  });

  it('should log warnings', () => {
    Logger.warn('warning message');
    expect(console.warn).toHaveBeenCalled();
  });
});
