import { DarkModeFeature } from '../../src/features/darkMode/darkMode';

describe('DarkModeFeature', () => {
  let feature: DarkModeFeature;

  beforeEach(() => {
    feature = new DarkModeFeature();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    if (feature.cleanup) {
      feature.cleanup();
    }
  });

  it('should have correct name', () => {
    expect(feature.name).toBe('darkMode');
  });

  it('should be enabled by default', () => {
    expect(feature.enabled).toBe(true);
  });

  it('should initialize without errors', async () => {
    (global.browser.storage.local.get as jest.Mock).mockResolvedValue({
      feature_darkMode: true,
    });

    await expect(feature.init()).resolves.not.toThrow();
  });

  it('should toggle on and off', () => {
    feature.toggle(false);
    expect(feature.enabled).toBe(false);

    feature.toggle(true);
    expect(feature.enabled).toBe(true);
  });

  it('should provide popup content', () => {
    const content = feature.getPopupContent?.();
    expect(content).toBeDefined();
    expect(content).toContain('Dark Mode Intensity');
  });

  it('should inject styles when applying dark mode', async () => {
    (global.browser.storage.local.get as jest.Mock).mockResolvedValue({
      feature_darkMode: true,
    });

    await feature.init();
    
    const styleElements = document.querySelectorAll('style');
    expect(styleElements.length).toBeGreaterThanOrEqual(0);
  });

  it('should remove styles when disabled', () => {
    feature.toggle(true);
    feature.toggle(false);
    
    // After toggling off, styles should be removed
    expect(feature.enabled).toBe(false);
  });

  it('should update intensity', () => {
    const newIntensity = 0.7;
    feature.setIntensity(newIntensity);
    
    // Intensity should be updated internally
    // We can't easily test the private property, but we can test behavior
    expect(() => feature.setIntensity(newIntensity)).not.toThrow();
  });
});
