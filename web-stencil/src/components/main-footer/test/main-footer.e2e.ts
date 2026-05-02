import { newE2EPage } from '@stencil/core/testing';

describe('main-footer', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<main-footer></main-footer>');

    const element = await page.find('main-footer');
    expect(element).toHaveClass('hydrated');
  });
});
