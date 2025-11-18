import { newSpecPage } from '@stencil/core/testing';
import { GuiAbout } from '../gui-about';

describe('gui-about', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [GuiAbout],
      html: `<gui-about></gui-about>`,
    });
    expect(page.root).toEqualHtml(`
      <gui-about>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </gui-about>
    `);
  });
});
