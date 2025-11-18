import { newSpecPage } from '@stencil/core/testing';
import { LoadingModal } from '../loading-modal';

describe('loading-modal', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LoadingModal],
      html: `<loading-modal></loading-modal>`,
    });
    expect(page.root).toEqualHtml(`
      <loading-modal>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </loading-modal>
    `);
  });
});
