import { Component, Event, EventEmitter, h, Host, Listen, State } from '@stencil/core';
import { AVAILABLE_PATHS } from '../../config';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.scss',
  shadow: true,
})
export class AppRoot {
  @State() menuOpened: boolean = true;
  @Event({ eventName: 'state.pushed' }) StatePushed: EventEmitter<{ state: any; title: string; url?: string | URL | null; }>;

  componentDidLoad() {
    if (!location.pathname || location.pathname === '/') {
      history.replaceState({}, 'Welcome', '/welcome');
      this.StatePushed.emit({ state: {}, url: '/welcome', title: 'Welcome' });
    }else if(!AVAILABLE_PATHS.includes(location.pathname)){
      // TODO show 404
    }

  }

  private _toggleMenu = () => {
    this.menuOpened = !this.menuOpened;
  };

  @Listen('menu.closed', { target: 'document', capture: true })
  closeMenu() {
    this.menuOpened = false;
  }

  render() {
    return (
      <Host>
        <div id='background'></div>
        <modal-backdrop></modal-backdrop>
        <main>
          <div class='top-menu'>
            <button style={{ padding: '12px' }} onClick={this._toggleMenu}>
              {this.menuOpened ? 'Close' : 'Open'}
            </button>
          </div>
        </main>
        <right-panel isOpened={this.menuOpened}></right-panel>

      </Host>
    );
  }
}
