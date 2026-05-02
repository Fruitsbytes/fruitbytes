import { newE2EPage } from '@stencil/core/testing';

describe('right-panel', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<right-panel></right-panel>');

    const element = await page.find('right-panel');
    expect(element).toHaveClass('hydrated');
  });
});
