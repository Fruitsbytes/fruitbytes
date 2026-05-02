import { newE2EPage } from '@stencil/core/testing';

describe('character-selection', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<character-selection></character-selection>');

    const element = await page.find('character-selection');
    expect(element).toHaveClass('hydrated');
  });
});
