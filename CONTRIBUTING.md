# Contributing to Gnoixus

Thank you for your interest in contributing to Gnoixus! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive criticism
- Maintain a positive and collaborative environment

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/gnoixus.git
   cd gnoixus
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a branch** for your feature:
   ```bash
   git checkout -b feature/my-new-feature
   ```

## Development Workflow

### Building

```bash
# Development build with watch mode
npm run dev

# Production build
npm run build
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Linting and Formatting

```bash
# Lint code
npm run lint

# Format code
npm run format
```

### Loading the Extension

**Chrome/Edge:**
1. Navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist` folder

**Firefox:**
1. Navigate to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select `manifest.v2.json` from the `dist` folder

## Adding a New Feature

1. **Create feature directory**:
   ```bash
   mkdir src/features/myFeature
   ```

2. **Implement the Feature interface**:
   ```typescript
   import { Feature, Logger, StorageManager } from '../../utils';

   export class MyFeature implements Feature {
     name = 'myFeature';
     enabled = true;

     async init(): Promise<void> {
       Logger.log('MyFeature initialized');
       // Your init logic
     }

     toggle(enable: boolean): void {
       this.enabled = enable;
       StorageManager.setFeatureState(this.name, enable);
       // Your toggle logic
     }
   }
   ```

3. **Register in content.ts**:
   ```typescript
   import { MyFeature } from './features/myFeature/myFeature';
   // Add to features array
   ```

4. **Add tests**:
   ```bash
   # Create test file
   touch tests/features/myFeature.test.ts
   ```

5. **Update documentation** in README.md

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict type checking
- Use interfaces over type aliases when possible
- Avoid `any` types when possible

### Code Style

- Follow the ESLint and Prettier configurations
- Use meaningful variable and function names
- Write self-documenting code
- Add comments for complex logic
- Keep functions small and focused

### File Organization

```
src/
├── features/           # Feature modules
│   └── featureName/
│       ├── featureName.ts
│       └── utils.ts    # Feature-specific utilities
├── utils.ts           # Shared utilities
├── types.ts           # Shared types
└── ...
```

### Naming Conventions

- **Classes**: PascalCase (e.g., `DarkModeFeature`)
- **Functions**: camelCase (e.g., `toggleFeature`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`)
- **Files**: camelCase (e.g., `darkMode.ts`)
- **Directories**: camelCase (e.g., `darkMode/`)

## Testing

- Write tests for all new features
- Aim for >80% code coverage
- Test edge cases and error conditions
- Use descriptive test names

### Test Structure

```typescript
describe('FeatureName', () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    // Cleanup
  });

  it('should do something specific', () => {
    // Test logic
  });
});
```

## Commit Messages

Use conventional commit format:

```
type(scope): subject

body

footer
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Test additions or changes
- `chore`: Build process or tooling changes

**Examples:**
```
feat(darkMode): add intensity control

Add slider to control dark mode intensity from 50% to 100%.

Closes #123
```

```
fix(password): resolve decryption error

Fix issue where passwords couldn't be decrypted after browser restart.
```

## Pull Request Process

1. **Update your branch** with the latest main:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run tests and linting**:
   ```bash
   npm test
   npm run lint
   ```

3. **Commit your changes** with descriptive messages

4. **Push to your fork**:
   ```bash
   git push origin feature/my-new-feature
   ```

5. **Create a Pull Request** on GitHub:
   - Provide a clear title and description
   - Reference related issues
   - Include screenshots for UI changes
   - List breaking changes (if any)

6. **Address review feedback**:
   - Respond to comments
   - Make requested changes
   - Push updates to the same branch

7. **Wait for approval** and merge

## Feature Ideas

Looking for something to work on? Check out:

- [Open Issues](https://github.com/yourusername/gnoixus/issues)
- [Feature Requests](https://github.com/yourusername/gnoixus/labels/enhancement)
- The Roadmap in README.md

## Questions?

- Open a [Discussion](https://github.com/yourusername/gnoixus/discussions)
- Ask in the Pull Request or Issue
- Check existing documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Gnoixus! 🎉
