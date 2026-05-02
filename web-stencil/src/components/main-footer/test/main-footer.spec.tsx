import { newSpecPage } from '@stencil/core/testing';
import { MainFooter } from '../main-footer';

describe('main-footer', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MainFooter],
      html: `<main-footer></main-footer>`,
    });
    expect(page.root).toEqualHtml(`
      <main-footer>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </main-footer>
    `);
  });
});
