import { newSpecPage } from '@stencil/core/testing';
import { ConsoleAbout } from '../console-about';

describe('console-about', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ConsoleAbout],
      html: `<console-about></console-about>`,
    });
    expect(page.root).toEqualHtml(`
      <console-about>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </console-about>
    `);
  });
});
