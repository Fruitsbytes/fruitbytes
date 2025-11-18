import { newE2EPage } from '@stencil/core/testing';

describe('background-activity', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<background-activity></background-activity>');

    const element = await page.find('background-activity');
    expect(element).toHaveClass('hydrated');
  });
});
