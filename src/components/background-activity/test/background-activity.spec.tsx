import { newSpecPage } from '@stencil/core/testing';
import { BackgroundActivity } from '../background-activity';

describe('background-activity', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BackgroundActivity],
      html: `<background-activity></background-activity>`,
    });
    expect(page.root).toEqualHtml(`
      <background-activity>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </background-activity>
    `);
  });
});
