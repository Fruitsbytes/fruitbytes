import { newE2EPage } from '@stencil/core/testing';

describe('console-about', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<console-about></console-about>');

    const element = await page.find('console-about');
    expect(element).toHaveClass('hydrated');
  });
});
