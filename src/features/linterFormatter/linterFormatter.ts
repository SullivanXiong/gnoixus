import { Feature, Logger, StorageManager, DOMUtils, MessageBus } from '../../utils';
import type { LinterResult } from '../../types';

/**
 * Linter/Formatter Feature - Auto-detects and formats code on web pages
 */
export class LinterFormatterFeature implements Feature {
  name = 'linterFormatter';
  enabled = true;
  private observer: MutationObserver | null = null;
  private processedElements = new WeakSet<Element>();
  private autoFormat = true;

  async init(): Promise<void> {
    Logger.log('Initializing Linter/Formatter feature');
    this.enabled = await StorageManager.getFeatureState(this.name);
    
    if (this.enabled) {
      this.startObserving();
      this.applyToExistingElements();
    }
  }

  toggle(enable: boolean): void {
    this.enabled = enable;
    StorageManager.setFeatureState(this.name, enable);
    
    if (enable) {
      this.startObserving();
      this.applyToExistingElements();
    } else {
      this.stopObserving();
    }
  }

  private startObserving(): void {
    if (this.observer) return;

    this.observer = new MutationObserver(
      DOMUtils.debounce(() => {
        this.applyToExistingElements();
      }, 500)
    );

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  private stopObserving(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  private applyToExistingElements(): void {
    if (!this.enabled) return;

    const codeElements = document.querySelectorAll('pre, code, textarea[class*="code"], div[class*="code"]');
    
    codeElements.forEach(element => {
      if (!this.processedElements.has(element) && DOMUtils.isCodeElement(element)) {
        this.processedElements.add(element);
        this.addFormatButton(element);
      }
    });
  }

  private addFormatButton(element: Element): void {
    // Don't add button to inline code elements
    if (element.tagName.toLowerCase() === 'code' && element.parentElement?.tagName.toLowerCase() !== 'pre') {
      return;
    }

    const container = document.createElement('div');
    container.style.position = 'relative';
    
    const button = document.createElement('button');
    button.textContent = '✨ Format';
    button.className = 'gnoixus-format-btn';
    button.style.cssText = `
      position: absolute;
      top: 5px;
      right: 5px;
      padding: 4px 8px;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      z-index: 1000;
    `;

    button.addEventListener('click', async () => {
      await this.formatElement(element, button);
    });

    // Wrap element if needed
    if (element.parentElement) {
      element.parentElement.insertBefore(container, element);
      container.appendChild(element);
      container.appendChild(button);
    }
  }

  private async formatElement(element: Element, button: HTMLButtonElement): Promise<void> {
    const originalText = button.textContent;
    button.textContent = '⏳ Formatting...';
    button.disabled = true;

    try {
      const code = element.textContent || '';
      const language = this.detectLanguage(element);
      
      const result = await this.formatCode(code, language);
      
      if (result.success && result.formatted) {
        if (element instanceof HTMLTextAreaElement) {
          element.value = result.formatted;
        } else {
          element.textContent = result.formatted;
        }
        button.textContent = '✓ Formatted';
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      } else {
        button.textContent = '✗ Error';
        Logger.error('Formatting failed:', result.errors);
      }
    } catch (error) {
      Logger.error('Format error:', error);
      button.textContent = '✗ Error';
    } finally {
      button.disabled = false;
      setTimeout(() => {
        if (button.textContent?.includes('Error')) {
          button.textContent = originalText;
        }
      }, 3000);
    }
  }

  private detectLanguage(element: Element): string {
    // Try to detect from class names
    const classNames = element.className.toLowerCase();
    
    const languageMap: { [key: string]: string } = {
      'javascript': 'javascript',
      'typescript': 'typescript',
      'python': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'css': 'css',
      'html': 'html',
      'json': 'json',
      'markdown': 'markdown'
    };

    for (const [key, value] of Object.entries(languageMap)) {
      if (classNames.includes(key)) {
        return value;
      }
    }

    return 'javascript'; // Default
  }

  private async formatCode(code: string, language: string): Promise<LinterResult> {
    // Simple formatting for demonstration
    // In production, this would use a Web Worker with Prettier/ESLint
    try {
      let formatted = code;

      // Basic formatting rules
      if (language === 'javascript' || language === 'typescript') {
        // Add semicolons if missing
        formatted = formatted.replace(/([^;\s])\s*\n/g, '$1;\n');
        // Format braces
        formatted = formatted.replace(/\{([^\n])/g, '{\n  $1');
        formatted = formatted.replace(/([^\n])\}/g, '$1\n}');
      } else if (language === 'json') {
        // Format JSON
        try {
          const parsed = JSON.parse(code);
          formatted = JSON.stringify(parsed, null, 2);
        } catch {
          // Invalid JSON, return as-is
        }
      }

      return {
        success: true,
        formatted: formatted
      };
    } catch (error) {
      return {
        success: false,
        errors: [{
          line: 0,
          column: 0,
          message: error instanceof Error ? error.message : 'Unknown error',
          severity: 'error'
        }]
      };
    }
  }

  cleanup(): void {
    this.stopObserving();
    // Remove all format buttons
    document.querySelectorAll('.gnoixus-format-btn').forEach(btn => btn.remove());
  }

  getPopupContent(): string {
    return `
      <div class="feature-section">
        <button id="manual-lint-btn" class="action-btn">Format Current Page</button>
        <label>
          <input type="checkbox" id="auto-format-check" ${this.autoFormat ? 'checked' : ''}>
          Auto-format on detection
        </label>
      </div>
    `;
  }
}
