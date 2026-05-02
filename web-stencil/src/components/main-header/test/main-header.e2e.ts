import { newE2EPage } from '@stencil/core/testing';

describe('main-header', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<main-header></main-header>');

    const element = await page.find('main-header');
    expect(element).toHaveClass('hydrated');
  });
});
