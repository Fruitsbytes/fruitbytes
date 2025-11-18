import { newE2EPage } from '@stencil/core/testing';

describe('console-welcome', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<console-welcome></console-welcome>');

    const element = await page.find('console-welcome');
    expect(element).toHaveClass('hydrated');
  });
});
