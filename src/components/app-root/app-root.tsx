import { Component, Element, Event, EventEmitter, h, Host, Listen, State } from '@stencil/core';
import { AVAILABLE_PATHS } from '../../config';
import { Log } from '../../interfaces/log';
import { SoundLibraryService, SoundsHashMap } from '../../services/soundLibraryService';
import 'flowbite';

/**
 * 1) TODO aria
 * 2) TODO first page + 404page
 * 3) TODO modals :  Upcoming features
 * 4) TODO translate: FR, ES, EN, HT
 * 5) TODO settings menu : Language , resolution, FPS ...
 * 6) TODO Test new fonts:  Monument Grotesk
 * 7) TODO Add sound in open and close menu, change link...
 */


@Component({
  tag: 'app-root',
  styleUrl: 'app-root.scss',
  shadow: true,
})
export class AppRoot {
  soundLib: SoundLibraryService;
  @State() progressText: string = 'Initializing...';
  progress: number = 0;
  @State() menuOpened: boolean = false;
  @State() loading: boolean = true;
  @State() activeRoute: string = location.pathname;
  @State() volumeMuted: boolean = localStorage.getItem('muted') && localStorage.getItem('muted') === '1';
  @State() menuWidth: number = parseInt(localStorage.getItem('menu-width')) || 450;
  @Element() el: HTMLElement;
  @Event({ eventName: 'state.pushed' }) StatePushed: EventEmitter<{ state: any; title: string; url?: string | URL | null; }>;
  @Event({ eventName: 'console.logged' }) log: EventEmitter<Log>;

  rightP: HTMLElement;
  audioLib: SoundsHashMap;

  connectedCallback() {
    this.soundLib = SoundLibraryService.instance();
    this.audioLib = this.soundLib.sounds;

  }

  componentDidLoad() {
    if (!location.pathname || location.pathname === '/') {
      history.replaceState({}, 'Welcome', '/welcome');
      this.StatePushed.emit({ state: {}, url: '/welcome', title: 'Welcome' });
    } else if (!AVAILABLE_PATHS.includes(location.pathname)) {
      // TODO show 404
    }

    this.muteVolume(this.volumeMuted);
    setTimeout(this.init, 1500);
    this.rightP = this.el.shadowRoot.querySelector('#rightP');
  }

  init = () => {
    this.loading = true;
    this.progress = 0;

    const task = 2;

    const promises: Promise<any>[] = [];
    promises.push(this.soundLib.preload(['volumeUp', 'mute', 'open', 'ambiance', 'close', 'ping']).finally(() => {

      this.soundLib.sounds.ping.volume(.1);
      this.progressText = '🎵 General sound Loaded...';

      this.progress += (1 / task) * 100;

      const ambiance = this.audioLib.ambiance;

      ambiance.once('playerror', () => {
        this.muteVolume(true);
        ambiance.once('unlock', () => {
          this.muteVolume(localStorage.getItem('muted') === '1');
          ambiance.play();
        });
      });

      ambiance.volume(.3);
      ambiance.loop();
      ambiance.play();

      // TODO log to console
    }));

    // TODO preload other stuffs: like Textures...

    Promise.allSettled(promises).then(_ar => {
      setTimeout(_ => {
        this.progressText = 'Ready! 🎉';
        this.progress = 100;
      }, 300);

    });
  };

  @Listen('close.loading', { target: 'window', capture: true })
  closeLoading() {
    this.loading = false;
    const loadingElement: HTMLDivElement = this.el.shadowRoot.querySelector('#loading');
    loadingElement.classList.add('animate__fadeOut', 'animate__slow');
    loadingElement.style.pointerEvents = 'none';
    setTimeout(this._toggleMenu, 1500);
  };

  _toggleMenu = () => {
    const sound = this.menuOpened ? this.soundLib.sounds.close : this.soundLib.sounds.open;
    const id = sound.play();
    sound.volume(1, id);
    sound.pos(0.5, 0, 0, id);
    this.menuOpened = !this.menuOpened;
  };

  _toggleVolume = () => {
    this.muteVolume(!this.volumeMuted);
  };

  muteVolume(muted: boolean) {
    this.volumeMuted = muted;

    const _muted = localStorage.getItem('muted');

    if (muted === null || _muted === '1' && muted === false || _muted === '0' && muted === true) {
      localStorage.setItem('muted', muted ? '1' : '0');
    }

    if (muted) {
      this.audioLib?.mute?.play();
      setTimeout(() => {
        Howler.mute(true);
      }, 200);
    } else {
      Howler.mute(false);
      this.audioLib?.volumeUp?.play();
    }

    this.log.emit({
      message: `${muted ? '🔈' : '🔊'} <b>Volume</b> ${muted ? ' muted.' : 'un-muted.'}  `,
      file: 'menu.ts',
      time: new Date(),
      line: 26,
    });
  }


  @Listen('menu.resizing', { target: 'document', capture: true })
  handleMenuResized(e) {
    const [menuName, width] = e.detail;
    if (menuName === 'fruits-bytes-menu') {
      this.menuWidth = width;
      localStorage.setItem('menu-width', width);
    }
  }

  @Listen('state.pushed ', { target: 'document' })
  handleRouteChange(_e) {
    this.activeRoute = location.pathname;
    this.soundLib.sounds.ping.play();
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

        <header
          style={{ width: `calc(100vw - ${this.menuOpened ? this.menuWidth : 0}px)`, top: '0px' }}
          class='top-menu select-none absolute bg-gray-400 backdrop-filter backdrop-blur-lg bg-opacity-10  firefox:bg-opacity-90'>
          <div class='logo'>
            <img src='../../assets/images/logo.png' alt='FruitsBytes' />
            <span>FruitsBytes</span>
          </div>
          <div class='flex flex-row'>
            <button class='toggle-button volume animate__animated animate__pulse animate__delay-2s'
                    onClick={this._toggleVolume}>
              <span class='material-symbols-rounded'>
                {
                  this.volumeMuted ? 'volume_off' : 'volume_up'
                }
              </span>
            </button>
            <button class='toggle-button inspection ml-2' onClick={this._toggleMenu}>
              <span class='material-symbols-rounded'>
               {
                 this.menuOpened ? 'close' : 'menu'
               }
              </span>
            </button>
          </div>

        </header>
        {
          this.loading || true ? (
            <div
              class='loading bg-indigo-900 backdrop-filter backdrop-blur-lg bg-opacity-40  firefox:bg-opacity-90 animate__animated'
              id='loading'>
              <div class='flex flex-col justify-center items-center'>
                <div class='relative w-100 p-1'>
                  <img src='../../assets/images/logo.png' alt='FruitsBytes'
                       class='loadingImg animate__animated animate__zoomIn animate__delay-1s'
                       style={{ filter: `grayscale(${1 - (this.progress / 100)})` }} />
                </div>

                {
                  this.progress == 100 ? null : (
                    <div class='my-5 border border-indigo-300 bg-gray-200 rounded-full h-1.5 dark:bg-gray-700'
                         style={{ width: '200px' }}>
                      <div class='smooth bg-indigo-900 h-1.5 rounded-full dark:bg-gray-300'
                           style={{ width: `${this.progress}%` }}></div>
                    </div>
                  )
                }
                <div class='progress-text text-center'>{this.progressText}</div>

                {
                  this.progress !== 100 ? null : (
                    <div id='alert-1' class='p-2 mt-4 bg-transparent rounded-lg' role='alert'>
                      <div class='flex items-center'>
                        <svg class='mr-2 w-5 h-5 text-gray-50' fill='currentColor' viewBox='0 0 20 20'
                             xmlns='http://www.w3.org/2000/svg'>
                          <path fill-rule='evenodd'
                                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                                clip-rule='evenodd'></path>
                        </svg>
                        <h3 class='text-lg font-medium text-gray-50 '>Hi, I am Jeffrey N. Carré</h3>
                      </div>
                      <div class='mt-2 text-sm text-gray-200'>
                        <div>
                          <span
                            class='bg-gray-100 text-gray-800 text-xs font-semibold inline-block mr-1 mb-1 px-2.5 py-0.5 rounded'>Senior Software Developer</span>
                          <span
                            class='bg-gray-100 text-gray-800 text-xs font-semibold inline-block mr-1 mb-1 px-2.5 py-0.5 rounded'>FullStack</span>
                          <span
                            class='bg-gray-100 text-gray-800 text-xs font-semibold inline-block mr-1 mb-1 px-2.5 py-0.5 rounded'>Graphic Designer</span>
                          <span
                            class='bg-gray-100 text-gray-800 text-xs font-semibold inline-block mr-1 mb-1 px-2.5 py-0.5 rounded'>Network Tech</span>
                        </div>
                        <p>This is my personal website where I showcase things I am currently working on. Enjoy!</p>
                      </div>
                      <div class='flex justify-between mt-3 items-center'>
                        <button type='button' onClick={this._toggleVolume}
                                class='text-gray-300 border border-gray-300 hover:bg-gray-50 hover:text-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center'>
                          {
                            this.volumeMuted ? (
                              <svg class='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'
                                   xmlns='http://www.w3.org/2000/svg'>
                                <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2'
                                      d='M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z'
                                      clip-rule='evenodd'></path>
                                <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2'
                                      d='M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2'></path>
                              </svg>
                            ) : (
                              <svg class='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'
                                   xmlns='http://www.w3.org/2000/svg'>
                                <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2'
                                      d='M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z'></path>
                              </svg>
                            )
                          }
                        </button>

                        {
                          this.volumeMuted ? (
                            <span
                              class='text-xs text-gray-300 inline-block animate__animated animate__pulse animate__infinite'>
                             <svg class='w-5 h-5 inline-block '
                                  fill='none' stroke='currentColor' viewBox='0 0 24 24'
                                  xmlns='http://www.w3.org/2000/svg'><path stroke-linecap='round'
                                                                           stroke-linejoin='round' stroke-width='2'
                                                                           d='M11 19l-7-7 7-7m8 14l-7-7 7-7'></path></svg>
                          <i>Better with sound <b>ON</b></i>
                        </span>
                          ) : null
                        }
                      </div>
                    </div>
                  )
                }


              </div>
              {
                this.progress == 100 ? (
                  <character-selection></character-selection>
                ) : null
              }

            </div>
          ) : null
        }

        <main style={{ display: 'block' }}
              class='relative main'>
          {
            this.activeRoute !== '/welcome' ?
              null : (
                <gui-welcome menuWidth={this.menuOpened ? this.menuWidth : 0}></gui-welcome>
              )
          }
        </main>
        <right-panel id='rightP' isOpened={this.menuOpened}></right-panel>

        <footer style={{ width: `calc(100vw - ${this.menuOpened ? this.menuWidth : 0}px)` }}
                class='footer bg-gray-400 backdrop-filter backdrop-blur-lg bg-opacity-10  firefox:bg-opacity-90'>
          <div>
            Built with 💖 and :
            <p style={{ fontSize: '.8rem' }}>
              <span>StencilJS</span> • <span>TypeScript</span> • <span>ThreeJS</span> • <span>enable3d</span> <br />
              <span>AmmoJS</span> • <span>Tailwind</span>
            </p>
          </div>
        </footer>

      </Host>
    );
  }
}
