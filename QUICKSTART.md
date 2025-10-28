# 🚀 Quick Start Guide

Get Gnoixus up and running in under 5 minutes!

## Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- npm 8+ (comes with Node.js)
- Chrome, Firefox, or Edge browser

## Installation

### Option 1: Install from Source (Recommended for Development)

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/gnoixus.git
cd gnoixus

# 2. Install dependencies
npm install

# 3. Build the extension
npm run build

# 4. Load in your browser (see below)
```

### Option 2: Download Release

1. Download the latest release from [GitHub Releases](https://github.com/yourusername/gnoixus/releases)
2. Extract the ZIP file
3. Load in your browser (see below)

## Loading in Browser

### Chrome / Edge

1. Open your browser and navigate to:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`

2. Enable **Developer mode** (toggle in top right)

3. Click **Load unpacked**

4. Select the `dist` folder (or extracted folder)

5. Done! The Gnoixus icon should appear in your toolbar

### Firefox

1. Open Firefox and navigate to: `about:debugging#/runtime/this-firefox`

2. Click **Load Temporary Add-on**

3. Navigate to the `dist` folder

4. Select the `manifest.v2.json` file

5. Done! The extension is now loaded (note: temporary until browser restart)

## First Use

### 1. Open the Extension

Click the Gnoixus icon in your browser toolbar to open the popup.

### 2. Enable Features

All features are enabled by default. You can toggle them on/off:

- 🌙 **Dark Mode** - Invert colors on websites
- ✨ **Code Formatter** - Format code blocks automatically
- 🔍 **GitHub Search** - Search GitHub users and repos
- 🔐 **Password Manager** - Store passwords securely

### 3. Try Dark Mode

1. Navigate to any website (e.g., `https://example.com`)
2. Click the Gnoixus icon
3. Ensure **Dark Mode** is enabled
4. Adjust the intensity slider
5. The website should now have a dark theme!

### 4. Try Code Formatter

1. Visit a code-heavy site:
   - [Stack Overflow](https://stackoverflow.com)
   - [GitHub](https://github.com)
   - Any page with code blocks

2. Look for **✨ Format** buttons near code blocks

3. Click a button to format the code

### 5. Try GitHub Search

1. Click the Gnoixus icon
2. Scroll to the **GitHub Search** section
3. Enter a search query (e.g., "react")
4. Select "Repos" or "Users"
5. Click **Search**
6. Results appear with direct links

### 6. Try Password Manager (Optional)

⚠️ **Warning**: This is a demo implementation. Use at your own risk.

1. Click the Gnoixus icon
2. Scroll to **Password Manager**
3. Create a master key (min 8 characters)
4. Click **Unlock**
5. Add a test password:
   - Website: `example.com`
   - Username: `testuser`
   - Password: Click **Generate** or enter your own
6. Click **Save**
7. Your password is now stored securely!

## Keyboard Shortcuts (Optional)

You can add keyboard shortcuts in browser settings:

**Chrome:**
1. Go to `chrome://extensions/shortcuts`
2. Find Gnoixus
3. Add shortcuts for quick access

**Firefox:**
1. Go to `about:addons`
2. Click the gear icon
3. Select "Manage Extension Shortcuts"

## Troubleshooting

### Extension doesn't load

- **Check manifest**: Ensure `manifest.json` exists in `dist/`
- **Clear cache**: Remove and reload the extension
- **Check console**: Open browser DevTools (F12) for errors

### Features not working

- **Refresh the page** after loading the extension
- **Check permissions**: Ensure extension has necessary permissions
- **Open console**: Check for JavaScript errors

### Dark mode not applying

- **Refresh the page** with Dark Mode enabled
- **Check toggle**: Ensure it's enabled in popup
- **Site-specific issues**: Some sites may override styles

### Code formatter buttons missing

- **Refresh the page**
- **Check toggle**: Ensure formatter is enabled
- **Site compatibility**: Not all code blocks are detected

### GitHub search not working

- **Rate limits**: GitHub API has rate limits for unauthenticated requests
- **Network**: Check internet connection
- **API status**: Check [GitHub Status](https://www.githubstatus.com/)

## Development Mode

Want to modify Gnoixus? Use development mode:

```bash
# Start development build with auto-reload
npm run dev

# In another terminal, run tests
npm test -- --watch
```

Now any changes to `src/` will automatically rebuild!

## Next Steps

- ⭐ **Star the repo** on GitHub
- 📖 Read the full [README.md](README.md)
- 🛠️ Check [CONTRIBUTING.md](CONTRIBUTING.md) to contribute
- 🐛 Report bugs in [Issues](https://github.com/yourusername/gnoixus/issues)
- 💬 Join [Discussions](https://github.com/yourusername/gnoixus/discussions)

## Uninstalling

### Chrome / Edge

1. Go to `chrome://extensions/` or `edge://extensions/`
2. Find Gnoixus
3. Click **Remove**

### Firefox

1. Go to `about:addons`
2. Find Gnoixus
3. Click **Remove**

## Support

Need help? Check out:

- 📖 [Full Documentation](README.md)
- 🏗️ [Build Guide](BUILD.md)
- 🐛 [Known Issues](https://github.com/yourusername/gnoixus/issues)
- 💬 [Community Discussions](https://github.com/yourusername/gnoixus/discussions)

---

**Enjoy using Gnoixus! 🎉**
