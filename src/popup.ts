import browser from 'webextension-polyfill';
import { Logger, StorageManager, MessageBus } from './utils';
import type { GitHubSearchResult, GitHubUser, GitHubRepository } from './types';

/**
 * Popup Script - Handles user interactions in the extension popup
 */
class GnoixusPopup {
  private currentTab: browser.Tabs.Tab | null = null;

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    Logger.log('Popup initialized');

    // Get current tab
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    this.currentTab = tabs[0] || null;

    // Load feature states and setup UI
    await this.setupUI();
    this.attachEventListeners();
  }

  private async setupUI(): Promise<void> {
    // Load feature toggle states
    const features = ['darkMode', 'linterFormatter', 'githubSearch', 'passwordManager'];
    
    for (const feature of features) {
      const enabled = await StorageManager.getFeatureState(feature);
      const toggle = document.getElementById(`${feature}-toggle`) as HTMLInputElement;
      if (toggle) {
        toggle.checked = enabled;
      }
    }

    // Show version
    const version = browser.runtime.getManifest().version;
    const versionElement = document.getElementById('version');
    if (versionElement) {
      versionElement.textContent = `v${version}`;
    }
  }

  private attachEventListeners(): void {
    // Feature toggles
    this.attachToggleListeners();

    // GitHub Search
    this.attachGitHubSearchListeners();

    // Password Manager
    this.attachPasswordManagerListeners();

    // Dark Mode intensity
    const darkModeIntensity = document.getElementById('dark-mode-intensity') as HTMLInputElement;
    if (darkModeIntensity) {
      darkModeIntensity.addEventListener('input', (e) => {
        const value = (e.target as HTMLInputElement).value;
        this.sendToContentScript({
          type: 'setDarkModeIntensity',
          value: parseFloat(value)
        });
      });
    }

    // Manual lint button
    const manualLintBtn = document.getElementById('manual-lint-btn');
    if (manualLintBtn) {
      manualLintBtn.addEventListener('click', () => {
        this.sendToContentScript({ type: 'manualLint' });
      });
    }
  }

  private attachToggleListeners(): void {
    const features = ['darkMode', 'linterFormatter', 'githubSearch', 'passwordManager'];
    
    features.forEach(feature => {
      const toggle = document.getElementById(`${feature}-toggle`) as HTMLInputElement;
      if (toggle) {
        toggle.addEventListener('change', async (e) => {
          const enabled = (e.target as HTMLInputElement).checked;
          await this.toggleFeature(feature, enabled);
        });
      }
    });
  }

  private attachGitHubSearchListeners(): void {
    const searchBtn = document.getElementById('github-search-btn');
    const queryInput = document.getElementById('github-query') as HTMLInputElement;
    const typeSelect = document.getElementById('github-type') as HTMLSelectElement;

    if (searchBtn && queryInput) {
      const doSearch = async () => {
        const query = queryInput.value.trim();
        const type = typeSelect?.value || 'repositories';
        
        if (!query) return;

        searchBtn.textContent = 'Searching...';
        searchBtn.setAttribute('disabled', 'true');

        try {
          const result = await this.searchGitHub(query, type as 'users' | 'repositories');
          this.displayGitHubResults(result, type as 'users' | 'repositories');
        } finally {
          searchBtn.textContent = 'Search';
          searchBtn.removeAttribute('disabled');
        }
      };

      searchBtn.addEventListener('click', doSearch);
      queryInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          doSearch();
        }
      });
    }
  }

  private attachPasswordManagerListeners(): void {
    // Unlock
    const unlockBtn = document.getElementById('pw-unlock-btn');
    const masterKeyInput = document.getElementById('pw-master-key') as HTMLInputElement;
    
    if (unlockBtn && masterKeyInput) {
      unlockBtn.addEventListener('click', async () => {
        const masterKey = masterKeyInput.value;
        await this.unlockPasswordManager(masterKey);
      });

      masterKeyInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          unlockBtn.click();
        }
      });
    }

    // Lock
    const lockBtn = document.getElementById('pw-lock-btn');
    if (lockBtn) {
      lockBtn.addEventListener('click', async () => {
        await this.lockPasswordManager();
      });
    }

    // Add password form
    const addForm = document.getElementById('pw-add-form') as HTMLFormElement;
    if (addForm) {
      addForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.addPassword();
      });
    }

    // Generate password
    const generateBtn = document.getElementById('pw-generate-btn');
    if (generateBtn) {
      generateBtn.addEventListener('click', async () => {
        await this.generatePassword();
      });
    }
  }

  private async toggleFeature(featureName: string, enabled: boolean): Promise<void> {
    try {
      await StorageManager.setFeatureState(featureName, enabled);
      
      // Notify content script
      if (this.currentTab?.id) {
        await browser.tabs.sendMessage(this.currentTab.id, {
          type: 'toggleFeature',
          featureName,
          enabled
        });
      }

      Logger.log(`Feature ${featureName} ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      Logger.error('Error toggling feature:', error);
    }
  }

  private async searchGitHub(
    query: string,
    type: 'users' | 'repositories'
  ): Promise<GitHubSearchResult | null> {
    try {
      if (!this.currentTab?.id) return null;

      const response = await browser.tabs.sendMessage(this.currentTab.id, {
        feature: 'githubSearch',
        type: 'search',
        data: { query, type }
      });

      return response;
    } catch (error) {
      Logger.error('GitHub search error:', error);
      return null;
    }
  }

  private displayGitHubResults(
    result: GitHubSearchResult | null,
    type: 'users' | 'repositories'
  ): void {
    const resultsDiv = document.getElementById('github-results');
    if (!resultsDiv) return;

    if (!result || result.items.length === 0) {
      resultsDiv.innerHTML = '<p class="no-results">No results found</p>';
      return;
    }

    let html = `<div class="results-count">${result.total_count} results</div>`;
    
    if (type === 'users') {
      result.items.forEach((item) => {
        const user = item as GitHubUser;
        html += `
          <div class="result-item user">
            <img src="${user.avatar_url}" alt="${user.login}" class="avatar">
            <div class="result-info">
              <a href="${user.html_url}" target="_blank" class="result-name">${user.login}</a>
              <span class="result-meta">${user.type}</span>
            </div>
          </div>
        `;
      });
    } else {
      result.items.forEach((item) => {
        const repo = item as GitHubRepository;
        html += `
          <div class="result-item repo">
            <div class="result-info">
              <a href="${repo.html_url}" target="_blank" class="result-name">${repo.full_name}</a>
              <p class="result-description">${repo.description || 'No description'}</p>
              <div class="result-meta">
                ${repo.language ? `<span class="language">${repo.language}</span>` : ''}
                <span class="stars">⭐ ${repo.stargazers_count}</span>
              </div>
            </div>
          </div>
        `;
      });
    }

    resultsDiv.innerHTML = html;
  }

  private async unlockPasswordManager(masterKey: string): Promise<void> {
    if (!this.currentTab?.id) return;

    try {
      const response = await browser.tabs.sendMessage(this.currentTab.id, {
        feature: 'passwordManager',
        type: 'unlock',
        data: { masterKey }
      });

      if (response.success) {
        this.showPasswordManagerSection();
        await this.loadPasswordList();
      } else {
        alert(response.error || 'Failed to unlock');
      }
    } catch (error) {
      Logger.error('Unlock error:', error);
      alert('Failed to unlock password manager');
    }
  }

  private async lockPasswordManager(): Promise<void> {
    if (!this.currentTab?.id) return;

    await browser.tabs.sendMessage(this.currentTab.id, {
      feature: 'passwordManager',
      type: 'lock'
    });

    this.hidePasswordManagerSection();
  }

  private showPasswordManagerSection(): void {
    const unlockSection = document.getElementById('pw-unlock-section');
    const mainSection = document.getElementById('pw-main-section');
    
    if (unlockSection) unlockSection.style.display = 'none';
    if (mainSection) mainSection.style.display = 'block';
  }

  private hidePasswordManagerSection(): void {
    const unlockSection = document.getElementById('pw-unlock-section');
    const mainSection = document.getElementById('pw-main-section');
    
    if (unlockSection) unlockSection.style.display = 'block';
    if (mainSection) mainSection.style.display = 'none';
  }

  private async addPassword(): Promise<void> {
    if (!this.currentTab?.id) return;

    const siteInput = document.getElementById('pw-site') as HTMLInputElement;
    const usernameInput = document.getElementById('pw-username') as HTMLInputElement;
    const passwordInput = document.getElementById('pw-password') as HTMLInputElement;

    const site = siteInput.value.trim();
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!site || !username || !password) {
      alert('Please fill all fields');
      return;
    }

    try {
      const response = await browser.tabs.sendMessage(this.currentTab.id, {
        feature: 'passwordManager',
        type: 'add',
        data: { site, username, password }
      });

      if (response.success) {
        siteInput.value = '';
        usernameInput.value = '';
        passwordInput.value = '';
        await this.loadPasswordList();
      } else {
        alert(response.error || 'Failed to save password');
      }
    } catch (error) {
      Logger.error('Add password error:', error);
      alert('Failed to save password');
    }
  }

  private async generatePassword(): Promise<void> {
    if (!this.currentTab?.id) return;

    try {
      const response = await browser.tabs.sendMessage(this.currentTab.id, {
        feature: 'passwordManager',
        type: 'generate',
        data: { length: 16 }
      });

      if (response.success && response.password) {
        const passwordInput = document.getElementById('pw-password') as HTMLInputElement;
        if (passwordInput) {
          passwordInput.value = response.password;
        }
      }
    } catch (error) {
      Logger.error('Generate password error:', error);
    }
  }

  private async loadPasswordList(): Promise<void> {
    if (!this.currentTab?.id) return;

    try {
      const response = await browser.tabs.sendMessage(this.currentTab.id, {
        feature: 'passwordManager',
        type: 'list'
      });

      if (response.success && response.entries) {
        this.displayPasswordList(response.entries);
      }
    } catch (error) {
      Logger.error('Load password list error:', error);
    }
  }

  private displayPasswordList(entries: Array<{ site: string; username: string; updatedAt: number }>): void {
    const listDiv = document.getElementById('pw-list');
    if (!listDiv) return;

    if (entries.length === 0) {
      listDiv.innerHTML = '<p class="no-results">No saved passwords</p>';
      return;
    }

    let html = '';
    entries.forEach(entry => {
      const date = new Date(entry.updatedAt).toLocaleDateString();
      html += `
        <div class="pw-item">
          <div class="pw-item-info">
            <strong>${entry.site}</strong>
            <span>${entry.username}</span>
            <small>${date}</small>
          </div>
          <div class="pw-item-actions">
            <button class="pw-view-btn" data-site="${entry.site}">View</button>
            <button class="pw-delete-btn" data-site="${entry.site}">Delete</button>
          </div>
        </div>
      `;
    });

    listDiv.innerHTML = html;

    // Attach event listeners
    listDiv.querySelectorAll('.pw-view-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const site = (e.target as HTMLElement).dataset.site!;
        this.viewPassword(site);
      });
    });

    listDiv.querySelectorAll('.pw-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const site = (e.target as HTMLElement).dataset.site!;
        this.deletePassword(site);
      });
    });
  }

  private async viewPassword(site: string): Promise<void> {
    if (!this.currentTab?.id) return;

    try {
      const response = await browser.tabs.sendMessage(this.currentTab.id, {
        feature: 'passwordManager',
        type: 'get',
        data: { site }
      });

      if (response.success) {
        alert(`Site: ${site}\nUsername: ${response.username}\nPassword: ${response.password}`);
      } else {
        alert(response.error || 'Failed to get password');
      }
    } catch (error) {
      Logger.error('View password error:', error);
    }
  }

  private async deletePassword(site: string): Promise<void> {
    if (!this.currentTab?.id) return;
    if (!confirm(`Delete password for ${site}?`)) return;

    try {
      const response = await browser.tabs.sendMessage(this.currentTab.id, {
        feature: 'passwordManager',
        type: 'delete',
        data: { site }
      });

      if (response.success) {
        await this.loadPasswordList();
      } else {
        alert(response.error || 'Failed to delete password');
      }
    } catch (error) {
      Logger.error('Delete password error:', error);
    }
  }

  private async sendToContentScript(message: any): Promise<any> {
    if (!this.currentTab?.id) return null;

    try {
      return await browser.tabs.sendMessage(this.currentTab.id, message);
    } catch (error) {
      Logger.error('Error sending message to content script:', error);
      return null;
    }
  }
}

// Initialize popup when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new GnoixusPopup();
  });
} else {
  new GnoixusPopup();
}
