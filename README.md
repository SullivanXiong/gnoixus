# 🛠️ Gnoixus - Multi-Tool Browser Extension

Gnoixus is a powerful, modular browser extension that brings multiple developer and productivity tools directly to your browser. Built with TypeScript and designed with a clean, extensible architecture.

## ✨ Features

### 🌙 Dark Mode
- Apply customizable dark theme to any website
- Adjustable intensity slider
- Automatic image inversion for perfect contrast
- Toggle on/off per site

### ✨ Code Formatter
- Auto-detect code blocks on web pages (Stack Overflow, GitHub, etc.)
- Format JavaScript, TypeScript, JSON, CSS, and more
- One-click formatting with visual feedback
- Supports inline and block code elements
- Web Worker-based processing for smooth performance

### 🔍 GitHub Search
- Quick search for GitHub users and repositories
- Beautiful result display with avatars and metadata
- Shows stars, language, and descriptions
- Direct links to profiles and repos
- Result caching for improved performance

### 🔐 Password Manager (Demo)
- Secure encrypted password storage
- Password generation with customizable options
- Master key protection with auto-lock
- Add, view, and delete passwords
- **⚠️ Note**: This is a basic demonstration. For production use, consider established password managers like LastPass or 1Password.

## 🚀 Installation

### From Source

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/gnoixus.git
   cd gnoixus
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build
   ```

4. **Load in your browser**

   **Chrome/Edge:**
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

   **Firefox:**
   - Open `about:debugging#/runtime/this-firefox`
   - Click "Load Temporary Add-on"
   - Select the `manifest.v2.json` file from the `dist` folder

## 🏗️ Architecture

Gnoixus is built with a modular architecture where each feature is an independent module implementing the `Feature` interface:

```typescript
interface Feature {
  name: string;
  enabled: boolean;
  init(): void;
  toggle(enable: boolean): void;
  cleanup?(): void;
  getPopupContent?(): string;
}
```

### Project Structure

```
gnoixus/
├── src/
│   ├── features/
│   │   ├── darkMode/
│   │   │   └── darkMode.ts
│   │   ├── linterFormatter/
│   │   │   ├── linterFormatter.ts
│   │   │   └── worker.ts
│   │   ├── githubSearch/
│   │   │   └── githubSearch.ts
│   │   └── passwordManager/
│   │       └── passwordManager.ts
│   ├── content.ts          # Main content script
│   ├── background.ts       # Background service worker
│   ├── popup.ts           # Popup UI logic
│   ├── popup.html         # Popup interface
│   ├── popup.css          # Popup styles
│   ├── utils.ts           # Shared utilities
│   └── types.ts           # TypeScript types
├── manifest.json          # Manifest V3 (Chrome/Edge)
├── manifest.v2.json       # Manifest V2 (Firefox)
├── package.json
├── tsconfig.json
├── webpack.config.js
└── README.md
```

## 🛠️ Development

### Commands

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Build in development mode with watch
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

### Adding a New Feature

1. **Create feature directory**
   ```bash
   mkdir src/features/myFeature
   ```

2. **Implement the Feature interface**
   ```typescript
   // src/features/myFeature/myFeature.ts
   import { Feature, Logger, StorageManager } from '../../utils';

   export class MyFeature implements Feature {
     name = 'myFeature';
     enabled = true;

     async init(): Promise<void> {
       Logger.log('MyFeature initialized');
       this.enabled = await StorageManager.getFeatureState(this.name);
       // Your initialization logic
     }

     toggle(enable: boolean): void {
       this.enabled = enable;
       StorageManager.setFeatureState(this.name, enable);
       // Your toggle logic
     }

     cleanup?(): void {
       // Cleanup logic if needed
     }

     getPopupContent?(): string {
       // Return HTML for popup UI
       return '<div>My Feature UI</div>';
     }
   }
   ```

3. **Register in content.ts**
   ```typescript
   import { MyFeature } from './features/myFeature/myFeature';

   this.features = [
     // ... existing features
     new MyFeature()
   ];
   ```

4. **Add to popup UI** (in `popup.html` and `popup.ts`)

## 🧪 Testing

The project uses Jest for testing. Example test structure:

```typescript
import { DarkModeFeature } from '../features/darkMode/darkMode';

describe('DarkModeFeature', () => {
  it('should initialize correctly', async () => {
    const feature = new DarkModeFeature();
    await feature.init();
    expect(feature.enabled).toBeDefined();
  });

  it('should toggle on and off', () => {
    const feature = new DarkModeFeature();
    feature.toggle(false);
    expect(feature.enabled).toBe(false);
  });
});
```

## 🔒 Security & Privacy

- **Local Storage Only**: All data is stored locally using browser storage APIs
- **No External Tracking**: No analytics or tracking of any kind
- **Encrypted Passwords**: Password manager uses AES encryption
- **Open Source**: Full transparency - review the code yourself
- **Minimal Permissions**: Only requests necessary permissions

## 🌐 Browser Compatibility

| Browser | Manifest | Status |
|---------|----------|--------|
| Chrome 88+ | V3 | ✅ Full Support |
| Edge 88+ | V3 | ✅ Full Support |
| Firefox 109+ | V2 | ✅ Full Support |
| Safari 14+ | V2 | ⚠️ Partial (needs testing) |

## 📝 Permissions

- `storage` - Store feature preferences and password data
- `activeTab` - Apply features to the current tab
- `contextMenus` - Add right-click menu options
- `tabs` - Communicate between popup and content scripts
- `https://api.github.com/*` - GitHub search functionality

## 🗺️ Roadmap

### Phase 1 ✅ (Current)
- [x] Core architecture
- [x] Dark Mode
- [x] Code Formatter
- [x] GitHub Search
- [x] Password Manager

### Phase 2 (Planned)
- [ ] Ad Blocker
- [ ] Note Taker
- [ ] Screenshot Tool
- [ ] Productivity Timer
- [ ] Bookmark Manager

### Phase 3 (Future)
- [ ] Cloud sync (optional)
- [ ] Custom themes
- [ ] Plugin system for community features
- [ ] Mobile browser support

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style (TypeScript, ESLint)
- Write tests for new features
- Update documentation as needed
- Keep commits focused and descriptive
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💡 Inspiration

Gnoixus was built with the vision of creating a unified toolkit for developers and power users, combining multiple essential tools into a single, lightweight extension.

## 🙏 Acknowledgments

- Built with [TypeScript](https://www.typescriptlang.org/)
- Uses [webextension-polyfill](https://github.com/mozilla/webextension-polyfill) for cross-browser compatibility
- Encryption powered by [CryptoJS](https://github.com/brix/crypto-js)
- Icons designed with modern UI principles

## 📧 Contact

- **Issues**: [GitHub Issues](https://github.com/yourusername/gnoixus/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/gnoixus/discussions)

---

**Made with ❤️ by the Gnoixus Team**
