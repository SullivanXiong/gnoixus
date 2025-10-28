import browser from 'webextension-polyfill';
import { Logger, MessageBus } from './utils';

/**
 * Background Script - Handles cross-tab communication and persistent tasks
 */
class GnoixusBackground {
  constructor() {
    this.initialize();
  }

  private initialize(): void {
    Logger.log('Background script initialized');

    // Handle installation
    browser.runtime.onInstalled.addListener((details) => {
      this.handleInstall(details);
    });

    // Handle messages from content scripts and popup
    browser.runtime.onMessage.addListener((message, sender) => {
      return this.handleMessage(message, sender);
    });

    // Handle browser action clicks (if no popup is defined)
    if (browser.action && browser.action.onClicked) {
      browser.action.onClicked.addListener((tab) => {
        this.handleBrowserAction(tab);
      });
    } else if (browser.browserAction && browser.browserAction.onClicked) {
      // For Manifest V2
      browser.browserAction.onClicked.addListener((tab) => {
        this.handleBrowserAction(tab);
      });
    }

    // Set up context menus
    this.setupContextMenus();
  }

  private handleInstall(details: browser.Runtime.OnInstalledDetailsType): void {
    if (details.reason === 'install') {
      Logger.log('Extension installed');
      this.setDefaultSettings();
    } else if (details.reason === 'update') {
      Logger.log('Extension updated to version', browser.runtime.getManifest().version);
    }
  }

  private async setDefaultSettings(): Promise<void> {
    // Set default feature states
    await browser.storage.local.set({
      feature_darkMode: true,
      feature_linterFormatter: true,
      feature_githubSearch: true,
      feature_passwordManager: true
    });
  }

  private async handleMessage(message: any, sender: any): Promise<any> {
    Logger.log('Background received message:', message.type);

    switch (message.type) {
      case 'getFeatureStates':
        return await this.getFeatureStates();
      
      case 'toggleFeature':
        return await this.toggleFeature(message.featureName, message.enabled);
      
      case 'search':
        // Forward search requests to active tab
        if (sender.tab) {
          return await this.forwardToTab(sender.tab.id!, message);
        }
        break;
      
      default:
        // Forward other messages to content script
        if (message.feature) {
          const tabs = await browser.tabs.query({ active: true, currentWindow: true });
          if (tabs[0]?.id) {
            return await browser.tabs.sendMessage(tabs[0].id, message);
          }
        }
    }

    return { success: false };
  }

  private async getFeatureStates(): Promise<{ [key: string]: boolean }> {
    const keys = [
      'feature_darkMode',
      'feature_linterFormatter',
      'feature_githubSearch',
      'feature_passwordManager'
    ];

    const result = await browser.storage.local.get(keys);
    return result as { [key: string]: boolean };
  }

  private async toggleFeature(featureName: string, enabled: boolean): Promise<{ success: boolean }> {
    try {
      await browser.storage.local.set({ [`feature_${featureName}`]: enabled });
      
      // Notify all tabs
      const tabs = await browser.tabs.query({});
      for (const tab of tabs) {
        if (tab.id) {
          await browser.tabs.sendMessage(tab.id, {
            type: 'toggleFeature',
            featureName,
            enabled
          }).catch(() => {
            // Tab might not have content script injected
          });
        }
      }

      return { success: true };
    } catch (error) {
      Logger.error('Error toggling feature:', error);
      return { success: false };
    }
  }

  private async forwardToTab(tabId: number, message: any): Promise<any> {
    try {
      return await browser.tabs.sendMessage(tabId, message);
    } catch (error) {
      Logger.error('Error forwarding message to tab:', error);
      return { success: false, error: 'Failed to communicate with tab' };
    }
  }

  private handleBrowserAction(tab: browser.Tabs.Tab): void {
    Logger.log('Browser action clicked');
    // This is only called if no popup is defined
    // We can open the popup programmatically or perform an action
  }

  private setupContextMenus(): void {
    // Create context menu items
    if (browser.contextMenus) {
      browser.contextMenus.create({
        id: 'gnoixus-format',
        title: 'Format with Gnoixus',
        contexts: ['selection']
      });

      browser.contextMenus.onClicked.addListener((info, tab) => {
        this.handleContextMenuClick(info, tab);
      });
    }
  }

  private async handleContextMenuClick(
    info: browser.Menus.OnClickData,
    tab?: browser.Tabs.Tab
  ): Promise<void> {
    if (info.menuItemId === 'gnoixus-format' && tab?.id) {
      await browser.tabs.sendMessage(tab.id, {
        type: 'formatSelection',
        text: info.selectionText
      }).catch(() => {
        Logger.error('Failed to send format message to tab');
      });
    }
  }
}

// Initialize background script
new GnoixusBackground();
