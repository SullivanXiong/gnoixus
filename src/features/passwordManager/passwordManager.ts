import { Feature, Logger, StorageManager, CryptoUtils, MessageBus } from '../../utils';
import type { PasswordEntry, PasswordStore } from '../../types';

/**
 * Password Manager Feature - Secure password storage and generation
 * WARNING: This is a basic implementation for demonstration.
 * For production use, consider using established password managers.
 */
export class PasswordManagerFeature implements Feature {
  name = 'passwordManager';
  enabled = true;
  private masterKey: string | null = null;
  private isLocked = true;
  private autoLockTimeout: NodeJS.Timeout | null = null;
  private lockDuration = 5 * 60 * 1000; // 5 minutes

  async init(): Promise<void> {
    Logger.log('Initializing Password Manager feature');
    this.enabled = await StorageManager.getFeatureState(this.name);
    
    // Listen for password-related requests
    MessageBus.onMessage(async (message) => {
      if (message.feature === this.name) {
        return await this.handleMessage(message);
      }
    });

    // Check if master key is set
    const hasMasterKey = await StorageManager.get<boolean>('pw_master_key_set');
    if (!hasMasterKey) {
      Logger.log('Master key not set');
    }
  }

  toggle(enable: boolean): void {
    this.enabled = enable;
    StorageManager.setFeatureState(this.name, enable);
    
    if (!enable) {
      this.lock();
    }
  }

  private async handleMessage(message: any): Promise<any> {
    if (!this.enabled) return { error: 'Feature disabled' };

    switch (message.type) {
      case 'unlock':
        return await this.unlock(message.data.masterKey);
      case 'lock':
        return this.lock();
      case 'add':
        return await this.addPassword(
          message.data.site,
          message.data.username,
          message.data.password
        );
      case 'get':
        return await this.getPassword(message.data.site);
      case 'list':
        return await this.listPasswords();
      case 'delete':
        return await this.deletePassword(message.data.site);
      case 'generate':
        return this.generatePassword(message.data.length);
      case 'setup':
        return await this.setupMasterKey(message.data.masterKey);
      default:
        return { error: 'Unknown action' };
    }
  }

  async setupMasterKey(masterKey: string): Promise<{ success: boolean; error?: string }> {
    if (!masterKey || masterKey.length < 8) {
      return { success: false, error: 'Master key must be at least 8 characters' };
    }

    // Hash the master key for verification
    const hashedKey = CryptoUtils.encrypt(masterKey, 'gnoixus-salt');
    await StorageManager.set('pw_master_key_hash', hashedKey);
    await StorageManager.set('pw_master_key_set', true);
    
    this.masterKey = masterKey;
    this.isLocked = false;
    this.startAutoLockTimer();
    
    Logger.log('Master key set up successfully');
    return { success: true };
  }

  async unlock(masterKey: string): Promise<{ success: boolean; error?: string }> {
    const storedHash = await StorageManager.get<string>('pw_master_key_hash');
    
    if (!storedHash) {
      return { success: false, error: 'Master key not set up' };
    }

    // Verify master key
    const hashedInput = CryptoUtils.encrypt(masterKey, 'gnoixus-salt');
    
    if (hashedInput !== storedHash) {
      return { success: false, error: 'Invalid master key' };
    }

    this.masterKey = masterKey;
    this.isLocked = false;
    this.startAutoLockTimer();
    
    Logger.log('Password manager unlocked');
    return { success: true };
  }

  lock(): { success: boolean } {
    this.masterKey = null;
    this.isLocked = true;
    this.stopAutoLockTimer();
    
    Logger.log('Password manager locked');
    return { success: true };
  }

  private startAutoLockTimer(): void {
    this.stopAutoLockTimer();
    
    this.autoLockTimeout = setTimeout(() => {
      this.lock();
      Logger.log('Auto-locked due to inactivity');
    }, this.lockDuration);
  }

  private stopAutoLockTimer(): void {
    if (this.autoLockTimeout) {
      clearTimeout(this.autoLockTimeout);
      this.autoLockTimeout = null;
    }
  }

  async addPassword(
    site: string,
    username: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> {
    if (this.isLocked || !this.masterKey) {
      return { success: false, error: 'Password manager is locked' };
    }

    try {
      const encrypted = CryptoUtils.encrypt(password, this.masterKey);
      const entry: PasswordEntry = {
        site,
        username,
        encrypted,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      const store = await StorageManager.get<PasswordStore>('pw_store') || {};
      store[site] = entry;
      await StorageManager.set('pw_store', store);

      this.startAutoLockTimer(); // Reset timer
      Logger.log(`Password saved for ${site}`);
      return { success: true };
    } catch (error) {
      Logger.error('Error adding password:', error);
      return { success: false, error: 'Failed to save password' };
    }
  }

  async getPassword(site: string): Promise<{
    success: boolean;
    password?: string;
    username?: string;
    error?: string;
  }> {
    if (this.isLocked || !this.masterKey) {
      return { success: false, error: 'Password manager is locked' };
    }

    try {
      const store = await StorageManager.get<PasswordStore>('pw_store') || {};
      const entry = store[site];

      if (!entry) {
        return { success: false, error: 'Password not found' };
      }

      const decrypted = CryptoUtils.decrypt(entry.encrypted, this.masterKey);
      
      if (!decrypted) {
        return { success: false, error: 'Failed to decrypt password' };
      }

      this.startAutoLockTimer(); // Reset timer
      return {
        success: true,
        password: decrypted,
        username: entry.username
      };
    } catch (error) {
      Logger.error('Error getting password:', error);
      return { success: false, error: 'Failed to retrieve password' };
    }
  }

  async listPasswords(): Promise<{
    success: boolean;
    entries?: Array<{ site: string; username: string; updatedAt: number }>;
    error?: string;
  }> {
    if (this.isLocked || !this.masterKey) {
      return { success: false, error: 'Password manager is locked' };
    }

    try {
      const store = await StorageManager.get<PasswordStore>('pw_store') || {};
      const entries = Object.values(store).map(entry => ({
        site: entry.site,
        username: entry.username,
        updatedAt: entry.updatedAt
      }));

      this.startAutoLockTimer(); // Reset timer
      return { success: true, entries };
    } catch (error) {
      Logger.error('Error listing passwords:', error);
      return { success: false, error: 'Failed to list passwords' };
    }
  }

  async deletePassword(site: string): Promise<{ success: boolean; error?: string }> {
    if (this.isLocked || !this.masterKey) {
      return { success: false, error: 'Password manager is locked' };
    }

    try {
      const store = await StorageManager.get<PasswordStore>('pw_store') || {};
      
      if (!store[site]) {
        return { success: false, error: 'Password not found' };
      }

      delete store[site];
      await StorageManager.set('pw_store', store);

      this.startAutoLockTimer(); // Reset timer
      Logger.log(`Password deleted for ${site}`);
      return { success: true };
    } catch (error) {
      Logger.error('Error deleting password:', error);
      return { success: false, error: 'Failed to delete password' };
    }
  }

  generatePassword(length: number = 16): {
    success: boolean;
    password?: string;
  } {
    try {
      const password = CryptoUtils.generatePassword(length, {
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: true
      });

      return { success: true, password };
    } catch (error) {
      Logger.error('Error generating password:', error);
      return { success: false };
    }
  }

  getPopupContent(): string {
    return `
      <div class="feature-section password-manager">
        <div id="pw-unlock-section" class="pw-section">
          <input type="password" id="pw-master-key" placeholder="Master Key" class="pw-input">
          <button id="pw-unlock-btn" class="action-btn">Unlock</button>
        </div>
        
        <div id="pw-main-section" class="pw-section" style="display: none;">
          <button id="pw-lock-btn" class="action-btn secondary">Lock</button>
          
          <h4>Add Password</h4>
          <form id="pw-add-form">
            <input type="text" id="pw-site" placeholder="Website" required class="pw-input">
            <input type="text" id="pw-username" placeholder="Username" required class="pw-input">
            <input type="password" id="pw-password" placeholder="Password" required class="pw-input">
            <div class="button-group">
              <button type="button" id="pw-generate-btn" class="action-btn secondary">Generate</button>
              <button type="submit" class="action-btn">Save</button>
            </div>
          </form>
          
          <h4>Saved Passwords</h4>
          <div id="pw-list" class="pw-list"></div>
        </div>
      </div>
    `;
  }

  cleanup(): void {
    this.lock();
  }
}
