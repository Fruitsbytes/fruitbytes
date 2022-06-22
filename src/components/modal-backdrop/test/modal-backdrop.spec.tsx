import { newSpecPage } from '@stencil/core/testing';
import { ModalBackdrop } from '../modal-backdrop';

describe('modal-backdrop', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ModalBackdrop],
      html: `<modal-backdrop></modal-backdrop>`,
    });
    expect(page.root).toEqualHtml(`
      <modal-backdrop>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </modal-backdrop>
    `);
  });
});
