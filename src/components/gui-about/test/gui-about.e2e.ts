import { newE2EPage } from '@stencil/core/testing';

describe('gui-about', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<gui-about></gui-about>');

    const element = await page.find('gui-about');
    expect(element).toHaveClass('hydrated');
  });
});
