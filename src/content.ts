import browser from 'webextension-polyfill';
import { Feature, Logger } from './utils';
import { DarkModeFeature } from './features/darkMode/darkMode';
import { LinterFormatterFeature } from './features/linterFormatter/linterFormatter';
import { GithubSearchFeature } from './features/githubSearch/githubSearch';
import { PasswordManagerFeature } from './features/passwordManager/passwordManager';

/**
 * Main Content Script - Orchestrates all features
 */
class GnoixusContentScript {
  private features: Feature[] = [];

  constructor() {
    this.initializeFeatures();
  }

  private initializeFeatures(): void {
    // Register all features
    this.features = [
      new DarkModeFeature(),
      new LinterFormatterFeature(),
      new GithubSearchFeature(),
      new PasswordManagerFeature()
    ];

    Logger.log('Gnoixus initialized with', this.features.length, 'features');
    
    // Initialize each feature
    this.features.forEach(feature => {
      try {
        feature.init();
        Logger.log(`Feature initialized: ${feature.name}`);
      } catch (error) {
        Logger.error(`Failed to initialize feature ${feature.name}:`, error);
      }
    });

    // Listen for feature toggle messages from popup
    browser.runtime.onMessage.addListener((message) => {
      return this.handleMessage(message);
    });
  }

  private async handleMessage(message: any): Promise<any> {
    if (message.type === 'toggleFeature') {
      return this.toggleFeature(message.featureName, message.enabled);
    }

    // Forward message to appropriate feature
    if (message.feature) {
      const feature = this.features.find(f => f.name === message.feature);
      if (feature) {
        // Features will handle their own messages via MessageBus
        return;
      }
    }

    return { success: false, error: 'Unknown message type' };
  }

  private toggleFeature(featureName: string, enabled: boolean): { success: boolean } {
    const feature = this.features.find(f => f.name === featureName);
    
    if (!feature) {
      Logger.error(`Feature not found: ${featureName}`);
      return { success: false };
    }

    try {
      feature.toggle(enabled);
      Logger.log(`Feature ${featureName} ${enabled ? 'enabled' : 'disabled'}`);
      return { success: true };
    } catch (error) {
      Logger.error(`Error toggling feature ${featureName}:`, error);
      return { success: false };
    }
  }

  public cleanup(): void {
    this.features.forEach(feature => {
      if (feature.cleanup) {
        feature.cleanup();
      }
    });
  }
}

// Initialize the content script
const gnoixus = new GnoixusContentScript();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  gnoixus.cleanup();
});

Logger.log('Gnoixus content script loaded');
