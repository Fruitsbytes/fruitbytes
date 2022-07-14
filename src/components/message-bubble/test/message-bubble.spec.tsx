import { newSpecPage } from '@stencil/core/testing';
import { MessageBubble } from '../message-bubble';

describe('message-bubble', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MessageBubble],
      html: `<message-bubble></message-bubble>`,
    });
    expect(page.root).toEqualHtml(`
      <message-bubble>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </message-bubble>
    `);
  });
});
