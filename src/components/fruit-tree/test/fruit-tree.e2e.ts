import { newE2EPage } from '@stencil/core/testing';

describe('fruit-tree', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<fruit-tree></fruit-tree>');

    const element = await page.find('fruit-tree');
    expect(element).toHaveClass('hydrated');
  });
});
