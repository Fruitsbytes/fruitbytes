import { newSpecPage } from '@stencil/core/testing';
import { FruitItem } from '../fruit-item';

describe('fruit-item', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [FruitItem],
      html: `<fruit-item></fruit-item>`,
    });
    expect(page.root).toEqualHtml(`
      <fruit-item>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </fruit-item>
    `);
  });
});
