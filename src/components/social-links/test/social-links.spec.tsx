import { newSpecPage } from '@stencil/core/testing';
import { SocialLinks } from '../social-links';

describe('social-links', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SocialLinks],
      html: `<social-links></social-links>`,
    });
    expect(page.root).toEqualHtml(`
      <social-links>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </social-links>
    `);
  });
});
