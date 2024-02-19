import { device, element, by, expect } from 'detox';

describe('MobileExample', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display welcome message', async () => {
    await expect(element(by.id('heading'))).toHaveText(
      'Welcome MobileExample 👋'
    );
  });
});
