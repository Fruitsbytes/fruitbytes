import { newSpecPage } from '@stencil/core/testing';
import { ConsoleWelcome } from '../console-welcome';

describe('console-welcome', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ConsoleWelcome],
      html: `<console-welcome></console-welcome>`,
    });
    expect(page.root).toEqualHtml(`
      <console-welcome>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </console-welcome>
    `);
  });
});
