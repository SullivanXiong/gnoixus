# 🚀 Deployment Guide

This guide covers deploying Gnoixus to browser extension stores.

## Pre-Deployment Checklist

Before deploying to any store:

- [x] All features tested and working
- [x] Build system configured
- [x] Tests passing
- [x] Documentation complete
- [ ] Extension icons created (16x16, 48x48, 128x128 PNG)
- [ ] Store screenshots prepared (1280x800 or 640x400)
- [ ] Store promotional images created
- [ ] Privacy policy written
- [ ] Support contact set up
- [ ] Version number updated in all manifests

## Creating Extension Icons

You need PNG icons in three sizes. Use the SVG in `icons/icon.svg` as a starting point:

```bash
# Using ImageMagick (install first: apt-get install imagemagick)
cd icons
convert icon.svg -resize 16x16 icon16.png
convert icon.svg -resize 48x48 icon48.png
convert icon.svg -resize 128x128 icon128.png
```

Or use online tools:
- [CloudConvert](https://cloudconvert.com/svg-to-png)
- [Convertio](https://convertio.co/svg-png/)

## Chrome Web Store

### 1. Developer Registration

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Pay one-time $5 registration fee
3. Complete developer profile

### 2. Prepare Package

```bash
# Build production version
npm run build

# Create ZIP
cd dist
zip -r ../gnoixus-chrome-v1.0.0.zip .
cd ..
```

### 3. Store Listing Requirements

**Required Assets:**
- Icon: 128x128 PNG (already in dist/)
- Small promo tile: 440x280 PNG
- Screenshot: At least 1, up to 5 (1280x800 or 640x400)

**Required Information:**
- Short description (132 chars max)
- Detailed description (no limit)
- Category (Developer Tools or Productivity)
- Language
- Privacy policy URL (create and host)

### 4. Upload and Submit

1. Click "New Item"
2. Upload ZIP file
3. Fill in store listing:
   - Product name: Gnoixus
   - Summary: Multi-tool browser extension with dark mode, code formatter, GitHub search, and more
   - Description: Use README.md content
   - Category: Developer Tools
4. Upload images
5. Set pricing (Free)
6. Submit for review (typically 1-3 days)

### 5. Privacy Policy

Create a simple privacy policy. Example:

```markdown
# Privacy Policy for Gnoixus

Gnoixus is committed to protecting your privacy.

## Data Collection
Gnoixus does NOT collect, transmit, or share any personal data.

## Data Storage
- All data is stored locally in your browser
- No information is sent to external servers
- Password data is encrypted using AES encryption

## Third-Party Services
- GitHub API: Only used when you explicitly search GitHub
- No tracking or analytics services

## Contact
For questions: your-email@example.com

Last updated: 2024-10-28
```

Host this on GitHub Pages or your website.

## Firefox Add-ons (AMO)

### 1. Developer Registration

1. Go to [Firefox Add-on Developer Hub](https://addons.mozilla.org/developers/)
2. Sign in with Firefox Account (free)
3. Read and accept policies

### 2. Prepare Package

```bash
# Build with Firefox manifest
npm run build
cp manifest.v2.json dist/manifest.json

# Create XPI (same as ZIP)
cd dist
zip -r ../gnoixus-firefox-v1.0.0.xpi .
cd ..
```

### 3. Store Listing Requirements

**Required Assets:**
- Icon: 64x64 PNG minimum (128x128 recommended)
- Screenshots: At least 1 (any size)

**Required Information:**
- Name
- Summary (250 chars)
- Description
- Categories (Developer Tools)
- Support email or URL
- License (MIT)
- Privacy policy

### 4. Source Code Submission

⚠️ **Important**: Firefox requires source code if using minification/obfuscation.

```bash
# Create source code archive
git archive --format=zip HEAD -o gnoixus-source-v1.0.0.zip

# Or without git
zip -r gnoixus-source-v1.0.0.zip . \
  -x "node_modules/*" "dist/*" ".git/*" "*.log"
```

Include a `BUILD_INSTRUCTIONS.md`:

```markdown
# Build Instructions for Gnoixus

1. Install Node.js 18+
2. Run: npm install
3. Run: npm run build
4. Output will be in dist/ folder

The build process uses:
- TypeScript compiler
- Webpack bundler
- No obfuscation or minification (for review)
```

### 5. Upload and Submit

1. Click "Submit a New Add-on"
2. Upload XPI file
3. Upload source code ZIP
4. Fill in listing information
5. Submit for review (typically 1-7 days)

## Microsoft Edge Add-ons

Same process as Chrome (uses Manifest V3).

1. Register at [Edge Add-ons Developer](https://partner.microsoft.com/dashboard/microsoftedge)
2. Build and package same as Chrome
3. Upload and submit

## Self-Hosting

For organizations or advanced users:

### 1. Create Update Manifest (Chrome)

```xml
<?xml version='1.0' encoding='UTF-8'?>
<gupdate xmlns='http://www.google.com/update2/response' protocol='2.0'>
  <app appid='YOUR_EXTENSION_ID'>
    <updatecheck codebase='https://yoursite.com/gnoixus-v1.0.0.crx' version='1.0.0' />
  </app>
</gupdate>
```

### 2. Update manifest.json

```json
{
  "update_url": "https://yoursite.com/updates.xml"
}
```

### 3. Pack Extension

```bash
# Chrome only allows self-hosted if packed and signed
# Use chrome://extensions/ -> Pack extension
# Or use chrome binary:
/path/to/chrome --pack-extension=/path/to/dist
```

## Post-Deployment

### Monitor

- Check store reviews regularly
- Respond to user feedback
- Monitor error reports
- Track download stats

### Update Process

When releasing updates:

1. Update version in package.json and manifests
2. Update CHANGELOG.md
3. Build and test
4. Create new ZIP/XPI
5. Upload to stores
6. Wait for review approval
7. Create GitHub release

### Version Numbering

Follow semantic versioning:
- **Major** (1.0.0): Breaking changes
- **Minor** (1.1.0): New features
- **Patch** (1.0.1): Bug fixes

## Support Setup

Set up support channels:

1. **GitHub Issues**: For bug reports
2. **GitHub Discussions**: For questions
3. **Email**: For private inquiries
4. **Store reviews**: Respond when possible

## Analytics (Optional)

If you want usage analytics:

1. **DO NOT** track users without consent
2. Use privacy-focused tools (e.g., Plausible)
3. Make it opt-in
4. Update privacy policy
5. Add consent UI in extension

## Marketing

After deployment:

1. Post on social media
2. Share on Reddit (r/webdev, r/chrome, etc.)
3. Write blog post
4. Submit to Product Hunt
5. Share on Hacker News
6. Create demo video on YouTube

## Troubleshooting Deployment

### "Manifest validation failed"
- Check JSON syntax
- Verify all required fields present
- Check permissions are valid

### "Package contains prohibited files"
- Remove .git folders
- Remove node_modules
- Check .npmignore

### "Privacy policy required"
- Host privacy policy online
- Add URL to store listing

### "Screenshots required"
- Minimum 1 screenshot
- Correct dimensions
- Show actual extension UI

## Legal Considerations

1. **License**: MIT (included in LICENSE file)
2. **Trademarks**: Don't use trademarked names/logos
3. **Copyright**: Own your code or have permission
4. **Privacy**: Comply with GDPR/CCPA if applicable
5. **Terms**: Follow each store's terms of service

## Resources

- [Chrome Web Store Policies](https://developer.chrome.com/docs/webstore/program-policies/)
- [Firefox Add-on Policies](https://extensionworkshop.com/documentation/publish/add-on-policies/)
- [Extension Security Best Practices](https://developer.chrome.com/docs/extensions/mv3/security/)

---

Good luck with your deployment! 🎉
