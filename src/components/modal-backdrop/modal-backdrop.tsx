import { Component, Host, h, Listen, State, Event, EventEmitter } from '@stencil/core';
import { BackDropOptions } from '../../interfaces/options';
import cleanDeep from 'clean-deep';
import { deleteProperty, Z_INDEX } from '../../utils';
import { Log } from '../../interfaces/log';

@Component({
  tag: 'modal-backdrop',
  styleUrl: 'modal-backdrop.scss',
  shadow: true,
})
export class ModalBackdrop {

  @State() backdrops: { [id: string]: BackDropOptions } = {};
  @Event({ eventName: 'console.logged' }) log: EventEmitter<Log>;

  //TODO whitelist id for reserved names

  @Listen('menu.resizing.start', { target: 'document', capture: true })
  async handleMenuResizing(e: CustomEvent) {
    const {id} = e.detail;
    this.log.emit({
      message: '⌛  Resizing <b>right-menu</b>...',
      file: 'menu.ts',
      time: new Date(),
      line: 26
    })
    const options: BackDropOptions = {
      id,
      target: 'menu',
      shield: true,
      cursor: ' w-resize',
      zIndex: Z_INDEX.MENU_BACKDROP_ELEVATED,
      override: { background: '#e70303', opacity: .05 },
    };

    await this.add(options);
  }

  @Listen('menu.resized', { target: 'document' })
  handleMenuResized(e: CustomEvent) {
    const {id} = e.detail;
    this.log.emit({
      message: 'Resizing <b>right-menu</b> finished.',
      file: 'menu.ts',
      time: new Date(),
      line: 47
    })
    return this.remove(id);
  }

  @Listen('modal.opened', { target: 'document' })
  handleModalOpened(e:CustomEvent) {
    const {options: _options} =  e.detail as {options: Partial<BackDropOptions>};
    const options: Partial<BackDropOptions> = {
      target: 'modal',
      shield: true,
      override: { background: '#000000', opacity: .5 }, ...cleanDeep(_options),
    };
    if (!options.id) {
      console.warn('Missing ID for modal');
      return;
    }
  }

  async add(backdrop: BackDropOptions) {

    this.backdrops = { ...this.backdrops, [backdrop.id]: backdrop };
  }

  async remove(id: string) {
    this.backdrops = deleteProperty(id, this.backdrops);
  }

  render() {

    const keys = Object.keys(this.backdrops);

    return (
      <Host style={{ zIndex: `${Z_INDEX.BACKDROP}` }}>
        {
          keys.map(key => {
            const { shield, override, cursor } = this.backdrops[key];
            const style: Partial<CSSStyleDeclaration> = {
              pointerEvents: shield ? 'auto' : 'none',
              background: override.background,
              opacity: `${override.opacity}`,
              cursor: cursor || 'default',
            };
            return (
              <div class='backdrop' key={key} style={style as any} />
            );
          })
        }
      </Host>
    );
  }

}
