import { newSpecPage } from '@stencil/core/testing';
import { LogoText } from '../logo-text';

describe('logo-text', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LogoText],
      html: `<logo-text></logo-text>`,
    });
    expect(page.root).toEqualHtml(`
      <logo-text>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </logo-text>
    `);
  });
});
