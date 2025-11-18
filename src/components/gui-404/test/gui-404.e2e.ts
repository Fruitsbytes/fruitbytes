import { newE2EPage } from '@stencil/core/testing';

describe('gui-404', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<gui-404></gui-404>');

    const element = await page.find('gui-404');
    expect(element).toHaveClass('hydrated');
  });
});
