# Build and Deployment Guide

This guide covers building, testing, and deploying the Gnoixus extension.

## Prerequisites

- Node.js 18+ and npm 8+
- Git
- A modern browser (Chrome, Firefox, or Edge)

## Development Setup

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/gnoixus.git
cd gnoixus
npm install
```

### 2. Development Build

```bash
# Start development build with watch mode
npm run dev
```

This will:
- Compile TypeScript to JavaScript
- Bundle all files with Webpack
- Watch for changes and rebuild automatically
- Output to `dist/` directory

### 3. Load in Browser

#### Chrome/Edge
1. Open `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `dist` folder

#### Firefox
1. Open `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Navigate to `dist/` and select `manifest.v2.json`

### 4. Development Workflow

1. Make changes to source files in `src/`
2. Webpack will automatically rebuild (if using `npm run dev`)
3. Reload the extension in your browser:
   - Chrome: Click reload icon on extension card
   - Firefox: Click "Reload" button
4. Test your changes

## Production Build

### Build for Distribution

```bash
npm run build
```

This creates an optimized build in `dist/` with:
- Minified JavaScript
- Source maps (for debugging)
- All assets copied

### Pre-flight Checks

Before building for release:

```bash
# Run all tests
npm test

# Check for linting errors
npm run lint

# Format all code
npm run format

# Verify build
npm run build
```

## Testing

### Unit Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run with coverage report
npm test -- --coverage

# Run specific test file
npm test darkMode.test.ts
```

### Manual Testing

Test each feature manually:

1. **Dark Mode**
   - Visit various websites
   - Toggle on/off
   - Adjust intensity
   - Check image inversion

2. **Code Formatter**
   - Visit GitHub, Stack Overflow
   - Check format buttons appear
   - Test formatting various code types
   - Verify no UI breakage

3. **GitHub Search**
   - Search for repositories
   - Search for users
   - Verify links work
   - Check error handling (rate limits)

4. **Password Manager**
   - Set up master key
   - Add passwords
   - Generate passwords
   - Lock/unlock
   - Delete passwords

## Browser-Specific Builds

### Chrome/Edge (Manifest V3)

The default build uses Manifest V3:

```bash
npm run build
# Uses manifest.json
```

### Firefox (Manifest V2)

Firefox requires Manifest V2 (for now):

1. Build normally:
   ```bash
   npm run build
   ```

2. Update webpack to copy v2 manifest:
   ```javascript
   // In webpack.config.js
   { from: 'manifest.v2.json', to: 'manifest.json' }
   ```

Or manually:
```bash
npm run build
cp manifest.v2.json dist/manifest.json
```

## Packaging for Distribution

### Chrome Web Store

1. **Build production version**:
   ```bash
   npm run build
   ```

2. **Create ZIP archive**:
   ```bash
   cd dist
   zip -r ../gnoixus-chrome-v1.0.0.zip .
   cd ..
   ```

3. **Upload to Chrome Web Store**:
   - Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   - Upload ZIP file
   - Fill in store listing details
   - Submit for review

### Firefox Add-ons (AMO)

1. **Build with Manifest V2**:
   ```bash
   npm run build
   cp manifest.v2.json dist/manifest.json
   ```

2. **Create XPI archive**:
   ```bash
   cd dist
   zip -r ../gnoixus-firefox-v1.0.0.xpi .
   cd ..
   ```

3. **Submit to AMO**:
   - Go to [Firefox Add-on Developer Hub](https://addons.mozilla.org/developers/)
   - Upload XPI file
   - Complete listing information
   - Submit for review

### Edge Add-ons

Same process as Chrome (uses Manifest V3).

1. Build and zip
2. Upload to [Edge Add-ons Developer Dashboard](https://partner.microsoft.com/dashboard/microsoftedge)

## Version Management

### Updating Version

Update version in three places:

1. **package.json**:
   ```json
   {
     "version": "1.0.1"
   }
   ```

2. **manifest.json**:
   ```json
   {
     "version": "1.0.1"
   }
   ```

3. **manifest.v2.json**:
   ```json
   {
     "version": "1.0.1"
   }
   ```

### Creating a Release

1. **Update version** (see above)

2. **Update CHANGELOG** (create if needed):
   ```markdown
   ## [1.0.1] - 2024-01-15
   ### Fixed
   - Bug in password decryption
   
   ### Added
   - New feature X
   ```

3. **Commit and tag**:
   ```bash
   git add .
   git commit -m "chore: bump version to 1.0.1"
   git tag v1.0.1
   git push origin main --tags
   ```

4. **Build and package** (see above)

5. **Create GitHub release**:
   - Go to Releases
   - Create new release
   - Upload ZIP/XPI files
   - Add release notes

## Continuous Integration

### GitHub Actions (Example)

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm test
      - run: npm run lint
      - run: npm run build
```

## Troubleshooting

### Build Errors

**TypeScript errors:**
```bash
# Check types
npx tsc --noEmit
```

**Webpack errors:**
```bash
# Clear cache and rebuild
rm -rf dist node_modules
npm install
npm run build
```

### Extension Loading Issues

**Chrome "Manifest file is invalid":**
- Check `manifest.json` syntax
- Verify all required fields
- Check file references exist

**Firefox "Extension is corrupt":**
- Ensure using `manifest.v2.json`
- Check file permissions
- Try loading as temporary add-on

### Runtime Errors

1. **Open browser console** (F12)
2. Check for errors in:
   - Extension popup console
   - Background script console
   - Content script console (on page)
3. Look for permission issues
4. Verify storage API calls

## Performance Optimization

### Bundle Size

```bash
# Analyze bundle
npm run build
npx webpack-bundle-analyzer dist/stats.json
```

### Optimization Tips

1. **Code splitting**: Separate features into chunks
2. **Tree shaking**: Ensure unused code is removed
3. **Compression**: Use Terser for minification
4. **Lazy loading**: Load features on demand

## Security Checklist

Before release:

- [ ] No hardcoded secrets or API keys
- [ ] CSP headers configured correctly
- [ ] Minimal permissions requested
- [ ] Input validation on all user inputs
- [ ] Secure password encryption
- [ ] No external script loading
- [ ] HTTPS for all API calls

## Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/gnoixus/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/gnoixus/discussions)
- **Documentation**: See README.md

---

Happy building! 🚀
