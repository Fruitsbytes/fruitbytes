import { newSpecPage } from '@stencil/core/testing';
import { CharacterSelection } from '../character-selection';

describe('character-selection', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CharacterSelection],
      html: `<character-selection></character-selection>`,
    });
    expect(page.root).toEqualHtml(`
      <character-selection>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </character-selection>
    `);
  });
});
