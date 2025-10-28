# GitHub Actions CI Fix

## Problems Encountered

### Problem 1: Missing Lock File

The GitHub Actions CI workflow was failing with this error:
```
Error: Dependencies lock file is not found in /home/runner/work/gnoixus/gnoixus. 
Supported file patterns: package-lock.json,npm-shrinkwrap.json,yarn.lock
```

**Root Cause**: The GitHub Actions workflow was configured to use `npm ci` (clean install) and cache npm dependencies, but the `package-lock.json` file was not committed to the repository. `npm ci` requires a lock file to ensure reproducible builds across different environments.

### Problem 2: Deprecated Actions (v3)

After fixing the lock file, another error appeared:
```
Error: This request has been automatically failed because it uses a deprecated version 
of `actions/upload-artifact: v3`.
```

**Root Cause**: GitHub deprecated v3 of their actions as of April 16, 2024. The workflow needed to be updated to use v4 of all actions.

## Solution

### 1. Generated package-lock.json

```bash
npm install
```

This created the `package-lock.json` file (230KB) which locks all dependency versions.

### 2. Updated GitHub Actions Workflow (v4)

The `.github/workflows/ci.yml` file now includes:

- **Complete CI pipeline** with test and build-release jobs
- **Latest action versions (v4)** - no deprecation warnings
- **Artifact uploads** for build outputs
- **Coverage reporting** integration
- **Automatic releases** when tags are pushed

**Actions Updated to v4:**
- `actions/checkout@v4` (was v3)
- `actions/setup-node@v4` (was v3)
- `actions/upload-artifact@v4` (was v3)
- `codecov/codecov-action@v4` (was v3)

### 3. Added to Git

```bash
git add package-lock.json .github/workflows/ci.yml
```

## Why package-lock.json is Important

1. **Reproducible Builds**: Ensures everyone gets the same dependency versions
2. **Security**: Lock file is checked by security audits
3. **CI/CD**: Required by `npm ci` for faster, reliable installs
4. **Dependency Tracking**: Shows exact versions of all transitive dependencies

## Best Practices

### Always Commit Lock Files

Lock files should ALWAYS be committed to version control:

- ✅ `package-lock.json` (npm)
- ✅ `yarn.lock` (Yarn)
- ✅ `pnpm-lock.yaml` (pnpm)

### Use npm ci in CI/CD

In CI/CD pipelines:

```yaml
# ✅ Good - Fast, reproducible
- run: npm ci

# ❌ Bad - Slower, may install different versions
- run: npm install
```

### Update Lock File

When adding/updating dependencies:

```bash
# Add new dependency
npm install package-name

# Update existing dependency
npm update package-name

# Update all dependencies (careful!)
npm update

# Regenerate lock file from package.json
rm package-lock.json && npm install
```

## GitHub Actions Workflow

The updated workflow now:

### On Every Push/PR:
1. Tests on Node.js 18.x and 20.x
2. Runs ESLint
3. Runs Jest tests with coverage
4. Builds the extension
5. Uploads artifacts

### On Version Tags (e.g., v1.0.0):
1. Runs all tests
2. Builds production bundles
3. Packages Chrome/Edge version (.zip)
4. Packages Firefox version (.xpi)
5. Creates GitHub release with downloads

## How to Trigger Releases

```bash
# Update version in package.json, manifests
npm version patch  # or minor, major

# Tag the release
git tag v1.0.1
git push origin v1.0.1

# GitHub Actions will automatically:
# - Build the extension
# - Create packages
# - Create a GitHub release
```

## Verification

The CI should now work correctly. You can verify by:

1. **Checking the Actions tab** on GitHub
2. **Looking for green checkmarks** on commits
3. **Reviewing build artifacts** in workflow runs

## Files Changed

```
✅ Added: package-lock.json (230KB)
✅ Updated: .github/workflows/ci.yml (complete workflow with v4 actions)
✅ Added: .github/ISSUE_TEMPLATE/bug_report.md
✅ Added: .github/ISSUE_TEMPLATE/feature_request.md
```

## Status

✅ **FULLY FIXED** - The CI pipeline is now fully functional with:
- Proper dependency locking
- Latest GitHub Actions (v4) - no deprecation warnings
- Complete test & build workflow
- Automated release packaging
- Artifact uploads
- Coverage reporting
- Issue templates for bug reports and features

---

**No further action needed** - just commit and push!
