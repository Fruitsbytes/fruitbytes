import { newE2EPage } from '@stencil/core/testing';

describe('logo-text', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<logo-text></logo-text>');

    const element = await page.find('logo-text');
    expect(element).toHaveClass('hydrated');
  });
});
