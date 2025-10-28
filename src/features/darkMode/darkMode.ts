import { Feature } from '../../utils';
import { Logger, StorageManager, DOMUtils } from '../../utils';

/**
 * Dark Mode Feature - Applies dark theme to web pages
 */
export class DarkModeFeature implements Feature {
  name = 'darkMode';
  enabled = true;
  private styleElement: HTMLStyleElement | null = null;
  private intensity = 0.9;

  async init(): Promise<void> {
    Logger.log('Initializing Dark Mode feature');
    this.enabled = await StorageManager.getFeatureState(this.name);
    
    if (this.enabled) {
      this.applyDarkMode();
    }
  }

  toggle(enable: boolean): void {
    this.enabled = enable;
    StorageManager.setFeatureState(this.name, enable);
    
    if (enable) {
      this.applyDarkMode();
    } else {
      this.removeDarkMode();
    }
  }

  private applyDarkMode(): void {
    if (this.styleElement) {
      return; // Already applied
    }

    const css = `
      html {
        filter: invert(${this.intensity}) hue-rotate(180deg) !important;
        background-color: #fff !important;
      }
      
      img, picture, video, canvas, svg, iframe {
        filter: invert(${this.intensity}) hue-rotate(180deg) !important;
      }
      
      * {
        background-color: inherit !important;
        scrollbar-color: #454a4d #202324 !important;
      }
    `;

    this.styleElement = DOMUtils.injectStyles(css);
    Logger.log('Dark mode applied');
  }

  private removeDarkMode(): void {
    if (this.styleElement) {
      DOMUtils.removeElement(this.styleElement);
      this.styleElement = null;
      Logger.log('Dark mode removed');
    }
  }

  cleanup(): void {
    this.removeDarkMode();
  }

  getPopupContent(): string {
    return `
      <div class="feature-section">
        <label>
          Dark Mode Intensity:
          <input type="range" id="dark-mode-intensity" min="0.5" max="1" step="0.1" value="${this.intensity}">
        </label>
      </div>
    `;
  }

  setIntensity(value: number): void {
    this.intensity = value;
    if (this.enabled) {
      this.removeDarkMode();
      this.applyDarkMode();
    }
  }
}
