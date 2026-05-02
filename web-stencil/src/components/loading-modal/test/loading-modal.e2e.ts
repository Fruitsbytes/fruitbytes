import { newE2EPage } from '@stencil/core/testing';

describe('loading-modal', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<loading-modal></loading-modal>');

    const element = await page.find('loading-modal');
    expect(element).toHaveClass('hydrated');
  });
});
