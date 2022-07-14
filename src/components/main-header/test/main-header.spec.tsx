import { newSpecPage } from '@stencil/core/testing';
import { MainHeader } from '../main-header';

describe('main-header', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MainHeader],
      html: `<main-header></main-header>`,
    });
    expect(page.root).toEqualHtml(`
      <main-header>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </main-header>
    `);
  });
});
