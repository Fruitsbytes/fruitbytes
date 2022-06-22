import { newE2EPage } from '@stencil/core/testing';

describe('simple-link', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<simple-link></simple-link>');

    const element = await page.find('simple-link');
    expect(element).toHaveClass('hydrated');
  });
});
