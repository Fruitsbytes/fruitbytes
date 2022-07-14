import { newE2EPage } from '@stencil/core/testing';

describe('dropdown-button', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dropdown-button></dropdown-button>');

    const element = await page.find('dropdown-button');
    expect(element).toHaveClass('hydrated');
  });
});
