import { newSpecPage } from '@stencil/core/testing';
import { GuiWelcome } from '../gui-welcome';

describe('gui-welcome', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [GuiWelcome],
      html: `<gui-welcome></gui-welcome>`,
    });
    expect(page.root).toEqualHtml(`
      <gui-welcome>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </gui-welcome>
    `);
  });
});
