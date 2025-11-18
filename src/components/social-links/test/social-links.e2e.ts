import { newE2EPage } from '@stencil/core/testing';

describe('social-links', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<social-links></social-links>');

    const element = await page.find('social-links');
    expect(element).toHaveClass('hydrated');
  });
});
