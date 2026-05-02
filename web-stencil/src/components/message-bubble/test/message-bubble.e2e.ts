import { newE2EPage } from '@stencil/core/testing';

describe('message-bubble', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<message-bubble></message-bubble>');

    const element = await page.find('message-bubble');
    expect(element).toHaveClass('hydrated');
  });
});
