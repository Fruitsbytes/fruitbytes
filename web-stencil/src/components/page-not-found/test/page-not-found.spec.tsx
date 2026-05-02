import { newSpecPage } from '@stencil/core/testing';
import { PageNotFound } from '../page-not-found';

describe('page-not-found', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PageNotFound],
      html: `<page-not-found></page-not-found>`,
    });
    expect(page.root).toEqualHtml(`
      <page-not-found>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </page-not-found>
    `);
  });
});
