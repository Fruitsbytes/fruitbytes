import { newSpecPage } from '@stencil/core/testing';
import { SimpleLink } from '../simple-link';

describe('simple-link', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SimpleLink],
      html: `<simple-link></simple-link>`,
    });
    expect(page.root).toEqualHtml(`
      <simple-link>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </simple-link>
    `);
  });
});
