import browser from 'webextension-polyfill';
import CryptoJS from 'crypto-js';

/**
 * Core Feature interface that all features must implement
 */
export interface Feature {
  name: string;
  enabled: boolean;
  init(): void;
  toggle(enable: boolean): void;
  cleanup?(): void;
  getPopupContent?(): string;
}

/**
 * Storage utilities for cross-browser compatibility
 */
export class StorageManager {
  static async get<T>(key: string): Promise<T | null> {
    try {
      const result = await browser.storage.local.get(key);
      return result[key] || null;
    } catch (error) {
      console.error(`Error getting ${key} from storage:`, error);
      return null;
    }
  }

  static async set(key: string, value: any): Promise<void> {
    try {
      await browser.storage.local.set({ [key]: value });
    } catch (error) {
      console.error(`Error setting ${key} in storage:`, error);
    }
  }

  static async remove(key: string): Promise<void> {
    try {
      await browser.storage.local.remove(key);
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
    }
  }

  static async getFeatureState(featureName: string): Promise<boolean> {
    const state = await this.get<boolean>(`feature_${featureName}`);
    return state !== null ? state : true; // Default to enabled
  }

  static async setFeatureState(featureName: string, enabled: boolean): Promise<void> {
    await this.set(`feature_${featureName}`, enabled);
  }
}

/**
 * Encryption utilities for password manager
 */
export class CryptoUtils {
  static encrypt(data: string, key: string): string {
    return CryptoJS.AES.encrypt(data, key).toString();
  }

  static decrypt(encryptedData: string, key: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, key);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption failed:', error);
      return '';
    }
  }

  static generatePassword(length: number = 16, options = {
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true
  }): string {
    let charset = '';
    if (options.includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (options.includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.includeNumbers) charset += '0123456789';
    if (options.includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let password = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < length; i++) {
      password += charset[array[i] % charset.length];
    }
    
    return password;
  }
}

/**
 * DOM utilities for content scripts
 */
export class DOMUtils {
  static injectStyles(css: string): HTMLStyleElement {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    return style;
  }

  static removeElement(element: HTMLElement | null): void {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }

  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;
    return function(...args: Parameters<T>) {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  static isCodeElement(element: Element): boolean {
    const tagName = element.tagName.toLowerCase();
    return ['pre', 'code', 'textarea'].includes(tagName) ||
           element.classList.contains('code') ||
           element.classList.contains('highlight');
  }
}

/**
 * Message passing utilities
 */
export interface Message {
  type: string;
  feature: string;
  data?: any;
}

export class MessageBus {
  static async sendToBackground(message: Message): Promise<any> {
    try {
      return await browser.runtime.sendMessage(message);
    } catch (error) {
      console.error('Error sending message to background:', error);
      return null;
    }
  }

  static async sendToTab(tabId: number, message: Message): Promise<any> {
    try {
      return await browser.tabs.sendMessage(tabId, message);
    } catch (error) {
      console.error('Error sending message to tab:', error);
      return null;
    }
  }

  static onMessage(callback: (message: Message, sender: any) => Promise<any> | any): void {
    browser.runtime.onMessage.addListener((message, sender) => {
      return Promise.resolve(callback(message, sender));
    });
  }
}

/**
 * Logger utility
 */
export class Logger {
  private static prefix = '[Gnoixus]';

  static log(...args: any[]): void {
    console.log(this.prefix, ...args);
  }

  static error(...args: any[]): void {
    console.error(this.prefix, ...args);
  }

  static warn(...args: any[]): void {
    console.warn(this.prefix, ...args);
  }

  static debug(...args: any[]): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.prefix, ...args);
    }
  }
}
