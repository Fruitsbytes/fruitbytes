import { newSpecPage } from '@stencil/core/testing';
import { RightPanel } from '../right-panel';

describe('right-panel', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [RightPanel],
      html: `<right-panel></right-panel>`,
    });
    expect(page.root).toEqualHtml(`
      <right-panel>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </right-panel>
    `);
  });
});
