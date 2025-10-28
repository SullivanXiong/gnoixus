# Icons

This directory contains the extension icons in various sizes.

To generate production-ready icons, you can:

1. Use a tool like [Real Favicon Generator](https://realfavicongenerator.net/)
2. Design custom icons in Figma/Sketch/Illustrator
3. Use the placeholder SVG below as a starting point

## Placeholder Icon (SVG)

```svg
<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="24" fill="url(#grad)"/>
  <text x="64" y="80" font-family="Arial" font-size="60" fill="white" text-anchor="middle">🛠️</text>
</svg>
```

## Required Sizes
- 16x16 - Favicon, extension icon
- 48x48 - Extension management page
- 128x128 - Chrome Web Store, installation

## Notes
For now, you can create simple placeholder PNGs or use the browser's default icon.
To generate icons from the SVG above, use an online converter or ImageMagick:

```bash
# Example with ImageMagick
convert icon.svg -resize 16x16 icon16.png
convert icon.svg -resize 48x48 icon48.png
convert icon.svg -resize 128x128 icon128.png
```
