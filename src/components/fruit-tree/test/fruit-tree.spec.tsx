import { newSpecPage } from '@stencil/core/testing';
import { FruitTree } from '../fruit-tree';

describe('fruit-tree', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [FruitTree],
      html: `<fruit-tree></fruit-tree>`,
    });
    expect(page.root).toEqualHtml(`
      <fruit-tree>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </fruit-tree>
    `);
  });
});
