import { newE2EPage } from '@stencil/core/testing';

describe('gui-welcome', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<gui-welcome></gui-welcome>');

    const element = await page.find('gui-welcome');
    expect(element).toHaveClass('hydrated');
  });
});
