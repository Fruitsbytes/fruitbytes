import { newSpecPage } from '@stencil/core/testing';
import { Gui404 } from '../gui-404';

describe('gui-404', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [Gui404],
      html: `<gui-404></gui-404>`,
    });
    expect(page.root).toEqualHtml(`
      <gui-404>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </gui-404>
    `);
  });
});
