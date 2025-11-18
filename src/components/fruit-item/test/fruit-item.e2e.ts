import { newE2EPage } from '@stencil/core/testing';

describe('fruit-item', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<fruit-item></fruit-item>');

    const element = await page.find('fruit-item');
    expect(element).toHaveClass('hydrated');
  });
});
