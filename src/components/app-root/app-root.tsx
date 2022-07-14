import { Component, Element, Event, EventEmitter, h, Host, Listen, State } from '@stencil/core';
import { AVAILABLE_PATHS, DEFAULT_MENU_WIDTH, MENU_ITEMS, WAIT_READY_TIME } from '../../config';
import { Log } from '../../interfaces/log';
import { SoundLibraryService, SoundsHashMap } from '../../services/soundLibraryService';
import { devTools } from '@ngneat/elf-devtools';
import { AuthService } from '../../services/authService';
import { Player } from '../../facade/character';
import { Howl } from 'howler';

import { animateCSS } from '../../utils';
import { Nullable } from '../../interfaces/geneneral-types';

devTools();

/**
 * -  TODO aria
 * -  TODO first page + 404page links to back & home
 * -  TODO modals :  Upcoming features
 * -  TODO translate: FR, ES, EN, HT
 * - TODO settings menu : Language , resolution, FPS ...
 * - TODO Test new fonts:  Monument Grotesk
 * - TODO Add sound in open and close menu, change link...
 * - TODO Add my picture+ name
 */


@Component({
  tag: 'app-root',
  styleUrl: 'app-root.scss',
  shadow: true,
})
export class AppRoot {
  @State() progressText: string = 'Initializing...';
  @State() player: Nullable<Player>;
  @State() menuOpened: boolean = true;
  @State() loading: boolean = true;
  @State() activeRoute: string = location.pathname;
  @State() volumeMuted: boolean = !!localStorage.getItem('muted') && localStorage.getItem('muted') === '1';
  @State() menuWidth: number = parseInt(localStorage.getItem('menu-width') || '') || DEFAULT_MENU_WIDTH;
  @Element() el!: HTMLElement;
  @Event({ eventName: 'state.pushed' }) StatePushed!: EventEmitter<{ state: any; title: string; url?: string | URL | null; }>;
  @Event({ eventName: 'console.logged' }) log!: EventEmitter<Log>;
  @Event({ eventName: 'redraw.screen' }) Redraw!: EventEmitter<boolean>;

  soundLib: SoundLibraryService = SoundLibraryService.instance();
  progress: number = 0;
  rightP: Nullable<HTMLElement>;
  audioLib?: SoundsHashMap;
  private ambiance?: Howl;
  private ambiance_id?: number;
  private message?: {
    text?: string;
    content?: string
  };

  connectedCallback() {
    this.loading = true;
    this.audioLib = this.soundLib.sounds;
    AuthService.instance().player$.pipe().subscribe(_p => {
      this.player = _p ? new Player(_p) : null;

      if (this.player?.id) {
        if (this.progress >= 100) {
          this.closeLoading();
        }
      } else {
        this.openLoading();
      }
    });

  }

  componentDidLoad() {

    if (!location.pathname || location.pathname === '/') {
      history.replaceState({}, 'Welcome', '/welcome');
      this.StatePushed?.emit({ state: {}, url: '/welcome', title: 'Welcome' });
    } else if (!AVAILABLE_PATHS.includes(location.pathname)) {
      // TODO show 404
    }

    this.muteVolume(this.volumeMuted);
    this.rightP = this.el.shadowRoot?.querySelector('#rightP');


    setTimeout(this.init);
  }

  init = () => {

    this.progress = 0;

    const tasks = 2;

    const promises: Promise<any>[] = [];
    promises.push(this.soundLib.preload(['volumeUp', 'mute', 'open', 'ambiance', 'close', 'ping', 'crush', 'jumpSoft']).finally(() => {

      this.soundLib.sounds.ping.volume(.1);
      this.progressText = '🎵 General sound Loaded...';

      this.progress += (1 / tasks) * 100;

      this.ambiance = this.audioLib?.ambiance;

      if (this.ambiance) {
        this.ambiance_id = this.ambiance.play();
        this.ambiance.volume(.3, this.ambiance_id);
        this.ambiance.loop(this.ambiance_id);
        this.ambiance.once('playerror', () => {
          this.muteVolume(true);
          this.ambiance?.once('unlock', () => {
            this.muteVolume(localStorage.getItem('muted') === '1');
          }, this.ambiance_id);
        }, this.ambiance_id);

      }


      // TODO log to console
    }));

    // TODO preload other stuffs: like Textures...

    Promise.allSettled(promises).then(_ar => {
      setTimeout(_ => {
        this.progressText = '<b>FruitsBytes</b> is ready! 🎉';
        this.progress = 100;
        if (!!this.player?.id) {
          this.closeLoading();
        }
      }, 800);

    });
  };


  @Listen('close.loading', { target: 'window', capture: true })
  closeLoading() {

    if (!this.loading) {
      return;
    }
    const loadingElement: Nullable<HTMLDivElement> = this.el.shadowRoot?.querySelector('#loading');
    if (loadingElement) {
      animateCSS(loadingElement, ['fadeOut', 'slow']).then(() => {
        this.loading = false;
        loadingElement.style.pointerEvents = 'none';

        setTimeout(_ => {
          this.message = {
            text: 'Hello, world!',
          };
        }, WAIT_READY_TIME);
      });
    }

  }

  openLoading = () => {
    if (this.loading) {
      return;
    }
    this.soundLib.sounds.crush.play();
    this.loading = true;

    setTimeout(() => {
      const loadingElement: Nullable<HTMLDivElement> = this.el.shadowRoot?.querySelector('#loading');
      if (loadingElement) {
        animateCSS(loadingElement, ['fadeIn', 'slow']).then(() => {
          loadingElement.style.pointerEvents = 'auto';
        });
      }

    });

  };


  @Listen('toggle.menu', { target: 'document', capture: true })
  toggleMenu() {
    this._toggleMenu();
  }

  _toggleMenu = () => {
    const sound = this.menuOpened ? this.soundLib.sounds.close : this.soundLib.sounds.open;
    const id = sound.play();
    sound.volume(1, id);
    sound.pos(0.5, 0, 0, id);
    this.menuOpened = !this.menuOpened;
    setTimeout(_ => this.Redraw?.emit(), 2000);
  };

  @Listen('toggle.volume', { target: 'document', capture: true })
  toggleVolume() {
    this._toggleVolume();
  }

  _toggleVolume = () => {
    this.muteVolume(!this.volumeMuted);
  };

  muteVolume(muted: boolean) {
    this.volumeMuted = muted;

    const _muted = localStorage.getItem('muted');

    if (muted === null || _muted === '1' && !muted || _muted === '0' && muted) {
      localStorage.setItem('muted', muted ? '1' : '0');
    }

    if (muted) {
      this.ambiance?.pause(this.ambiance_id);
      this.audioLib?.mute?.play();
      setTimeout(() => {
        Howler.mute(true);
      }, 200);
    } else {
      Howler.mute(false);
      this.audioLib?.volumeUp?.play();
      this.ambiance?.play(this.ambiance_id);
      this.ambiance?.loop(this.ambiance_id);
    }

    this.log?.emit({
      message: `${muted ? '🔈' : '🔊'} <b>Volume</b> ${muted ? ' muted.' : 'un-muted.'}  `,
      file: 'menu.ts',
      time: new Date(),
      line: 26,
    });
  }

  @Listen('menu.resizing', { target: 'document', capture: true })
  handleMenuResized(e: CustomEvent<[string, number]>) {
    const [menuName, width] = e.detail;
    if (menuName === 'fruits-bytes-menu') {
      this.menuWidth = width;
      localStorage.setItem('menu-width', `${width}`);
      setTimeout(_ => this.Redraw?.emit(), 2000);
    }
  }

  @Listen('state.pushed', { target: 'document' })
  handleRouteChange(_e: CustomEvent<{ state: any; title: string; url?: string | URL | null; }>) {
    this.activeRoute = location.pathname;
    this.soundLib.sounds.ping.play();
  }

  @Listen('popstate', { target: 'window', capture: true })
  onNavigate(_e: PopStateEvent) {
    this.activeRoute = location.pathname;
    this.StatePushed?.emit({ state: {}, title: '', url: location.pathname });
  }

  @Listen('menu.closed', { target: 'document', capture: true })
  closeMenu() {
    this.menuOpened = false;
  }

  @Listen('storage', { target: 'window', capture: true })
  onTabMute(e: StorageEvent) {
    this.muteVolume(e.newValue === '1');
  }

  render() {
    return (
      <Host>
        <div id='background'>
          <div class='stars'></div>
        </div>

        <modal-backdrop></modal-backdrop>

        <main-header message={this.message} menuOpened={this.menuOpened} menuWidth={this.menuWidth}
                     volumeMuted={this.volumeMuted} player={this.player}></main-header>

        {
          this.loading ? (
            <loading-modal progressText={this.progressText} progress={this.progress} volumeMuted={this.volumeMuted}
                           player={this.player}></loading-modal>
          ) : null
        }

        <main style={{ display: 'block' }}
              class='relative main'>
          {
            this.activeRoute !== '/welcome' || this.loading?
              null : (
                <gui-welcome player={this.player} menuOpened={this.menuOpened} menuWidth={this.menuWidth}></gui-welcome>
              )
          }
          <background-activity digiCode={this.player?.digiCode || ''}
                               menuWidth={this.menuOpened ? this.menuWidth : 0}></background-activity>
          {
            MENU_ITEMS.map(value => value.path).includes(this.activeRoute) ? null : <gui-404></gui-404>
          }
        </main>
        <right-panel id='rightP' isOpened={this.menuOpened}></right-panel>

        <main-footer menuOpened={this.menuOpened} menuWidth={this.menuWidth}></main-footer>

      </Host>
    );
  }

}
