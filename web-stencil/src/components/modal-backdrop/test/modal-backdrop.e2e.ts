import { newE2EPage } from '@stencil/core/testing';

describe('modal-backdrop', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<modal-backdrop></modal-backdrop>');

    const element = await page.find('modal-backdrop');
    expect(element).toHaveClass('hydrated');
  });
});
