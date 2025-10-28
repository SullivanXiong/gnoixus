# TODO List

This file tracks future enhancements and known issues for Gnoixus.

## Phase 2 Features (Next Release)

### High Priority
- [ ] Add icons (PNG format) for all sizes (16x16, 48x48, 128x128)
- [ ] Implement proper Prettier/ESLint integration in formatter worker
- [ ] Add OAuth support for GitHub API authentication
- [ ] Implement export/import for password manager
- [ ] Add keyboard shortcuts for quick feature access
- [ ] Create options page for advanced settings

### Medium Priority
- [ ] Add more code language support (Python, Java, C++, etc.)
- [ ] Implement syntax highlighting in code formatter
- [ ] Add GitHub rate limit indicator
- [ ] Create backup/restore functionality for all data
- [ ] Add dark mode exclusion list for specific sites
- [ ] Implement custom color themes

### Low Priority
- [ ] Add analytics dashboard (local only, privacy-focused)
- [ ] Create tutorial/onboarding flow
- [ ] Add feature usage statistics
- [ ] Implement feature suggestions based on current site
- [ ] Add internationalization (i18n) support

## Phase 3 Features (Future)

### New Features
- [ ] **Ad Blocker**: Block ads and trackers
  - Basic ad blocking rules
  - Custom filter lists
  - Whitelist functionality
  - Statistics counter

- [ ] **Note Taker**: Quick notes while browsing
  - Rich text editor
  - Sync across tabs
  - Export to Markdown
  - Search functionality

- [ ] **Screenshot Tool**: Capture and annotate
  - Full page screenshots
  - Selection capture
  - Annotation tools
  - Export options

- [ ] **Productivity Timer**: Pomodoro technique
  - Configurable intervals
  - Break reminders
  - Statistics tracking
  - Site blocking during work sessions

- [ ] **Bookmark Manager**: Enhanced bookmarking
  - Tags and categories
  - Full-text search
  - Import/export
  - Duplicate detection

### Infrastructure
- [ ] Plugin system for community features
- [ ] Cloud sync (optional, privacy-focused)
- [ ] Mobile browser support (Firefox Mobile)
- [ ] Performance monitoring and optimization
- [ ] Automated E2E testing with Playwright

## Bug Fixes / Improvements

### Known Issues
- [ ] Dark mode may conflict with sites that have their own dark themes
- [ ] Code formatter doesn't detect all code block types
- [ ] GitHub search requires page refresh to work on first load
- [ ] Password manager auto-lock timer continues in background

### Improvements Needed
- [ ] Better error handling and user feedback
- [ ] Reduce bundle size (currently ~500KB)
- [ ] Optimize DOM mutation observer performance
- [ ] Add loading states to all async operations
- [ ] Improve accessibility (ARIA labels, keyboard navigation)
- [ ] Add comprehensive integration tests

## Technical Debt
- [ ] Refactor popup.ts into smaller components
- [ ] Add proper TypeScript types for browser APIs
- [ ] Implement better error boundaries
- [ ] Add retry logic for failed API calls
- [ ] Improve code documentation and JSDoc comments
- [ ] Set up automatic dependency updates (Dependabot)

## Documentation
- [ ] Add video tutorial/demo
- [ ] Create API documentation for feature developers
- [ ] Add more code examples in CONTRIBUTING.md
- [ ] Create troubleshooting guide
- [ ] Document browser API usage patterns
- [ ] Add architecture diagrams

## Community
- [ ] Set up discussion forum
- [ ] Create feature request template
- [ ] Add bug report template
- [ ] Establish code review guidelines
- [ ] Create contributor recognition system
- [ ] Set up community guidelines

## Release Checklist Template

Before each release:
- [ ] Update version in package.json, manifest.json, manifest.v2.json
- [ ] Update CHANGELOG.md
- [ ] Run full test suite
- [ ] Test on Chrome/Edge (Manifest V3)
- [ ] Test on Firefox (Manifest V2)
- [ ] Build production bundles
- [ ] Create release notes
- [ ] Tag release in Git
- [ ] Upload to Chrome Web Store
- [ ] Upload to Firefox Add-ons
- [ ] Create GitHub release
- [ ] Update documentation if needed

---

**Note**: This is a living document. Items may be added, removed, or reprioritized based on user feedback and project goals.
