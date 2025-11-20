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
import { Language } from '../../interfaces/translation';
import i18nService, { getCurrentLanguage, loadTranslations, getLanguageFromURL, getPathWithoutLanguage, buildURLWithLanguage, t } from '../../services/i18n';
import metaTagsService from '../../services/metaTagsService';

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
  @State() activeRoute: string = getPathWithoutLanguage(location.pathname);
  @State() hash: string = location.hash;
  @State() routeLoading: boolean = false;
  @State() volumeMuted: boolean = !!localStorage.getItem('muted') && localStorage.getItem('muted') === '1';
  @State() menuWidth: number = parseInt(localStorage.getItem('menu-width') || '') || DEFAULT_MENU_WIDTH;
  @State() currentLanguage: Language = getCurrentLanguage();
  @Element() el!: HTMLElement;
  @Event({ eventName: 'state.pushed' }) StatePushed!: EventEmitter<{ state: any; title: string; url?: string | URL | null; }>;
  @Event({ eventName: 'console.logged' }) log!: EventEmitter<Log>;
  @Event({ eventName: 'redraw.screen' }) Redraw!: EventEmitter<boolean>;
  @Event({ eventName: 'language.changed' }) LanguageChanged!: EventEmitter<Language>;

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

    // Initialize i18n and load current language translations
    loadTranslations(this.currentLanguage).catch(err => {
      console.error('Failed to load translations:', err);
    });

    // Subscribe to language changes
    i18nService.subscribe((language) => {
      this.currentLanguage = language;
      this.LanguageChanged?.emit(language);

      // Update meta tags when language changes
      metaTagsService.updateLanguage(language);
      this.updateMetaTags();

      this.log?.emit({
        message: `🌐 <b>Language</b> changed to ${language.toUpperCase()}`,
        file: 'app-root.tsx',
        time: new Date(),
        line: 67,
      });
    });

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
    // Handle URL language prefix
    const urlLang = getLanguageFromURL();
    const pathWithoutLang = getPathWithoutLanguage();

    // If no language in URL, redirect to include language
    if (!urlLang) {
      const targetPath = pathWithoutLang === '/' || pathWithoutLang === '' ? '/welcome' : pathWithoutLang;
      const newURL = buildURLWithLanguage(targetPath);
      history.replaceState({}, '', newURL);
      this.StatePushed?.emit({ state: {}, url: newURL, title: '' });
    }
    // If URL has language, check if page path is valid
    else {
      const pagePath = pathWithoutLang || '/welcome';
      if (pagePath === '/' || pagePath === '') {
        const newURL = buildURLWithLanguage('/welcome');
        history.replaceState({}, 'Welcome', newURL);
        this.StatePushed?.emit({ state: {}, url: newURL, title: 'Welcome' });
      } else if (!AVAILABLE_PATHS.includes(pagePath)) {
        // TODO show 404
      }
    }

    this.muteVolume(this.volumeMuted);
    this.rightP = this.el.shadowRoot?.querySelector('#rightP');

    // Initialize meta tags
    this.updateMetaTags();

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
            this.ambiance?.loop(this.ambiance_id);
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

  /**
   * Update meta tags based on current route
   */
  updateMetaTags() {
    const pathWithoutLang = getPathWithoutLanguage();
    const baseTitle = 'FruitsBytes';

    // Route-specific meta tags
    const routeMetaTags: Record<string, { title: string; description: string; type: 'website' | 'article' | 'profile' }> = {
      '/welcome': {
        title: `${t('welcome.title')} | ${baseTitle}`,
        description: t('welcome.description'),
        type: 'website',
      },
      '/about-me': {
        title: `${t('about.title')} | ${baseTitle}`,
        description: t('about.description'),
        type: 'profile',
      },
      '/contact-me': {
        title: `${t('contact.title')} | ${baseTitle}`,
        description: t('contact.description'),
        type: 'website',
      },
      '/my-blog': {
        title: `${t('blog.title')} | ${baseTitle}`,
        description: t('blog.description'),
        type: 'website',
      },
      '/my-projects': {
        title: `${t('projects.title')} | ${baseTitle}`,
        description: t('projects.description'),
        type: 'website',
      },
      '/console-log': {
        title: `${t('console.title')} | ${baseTitle}`,
        description: t('console.description'),
        type: 'website',
      },
    };

    const currentMeta = routeMetaTags[pathWithoutLang] || {
      title: baseTitle,
      description: 'Developer Portfolio & Blog',
      type: 'website' as const,
    };

    metaTagsService.setMetaTags({
      title: currentMeta.title,
      description: currentMeta.description,
      type: currentMeta.type,
      locale: this.currentLanguage,
      url: window.location.href,
      siteName: baseTitle,
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
    const previousRoute = this.activeRoute;
    const newRoute = getPathWithoutLanguage(); // Extract path without language prefix

    // Update language if URL language changed
    const urlLang = getLanguageFromURL();
    if (urlLang && urlLang !== this.currentLanguage) {
      i18nService.setLanguage(urlLang, false); // Don't update URL since it's already correct
    }

    // Only show loading skeleton if the route actually changed (not just hash)
    if (previousRoute !== newRoute) {
      this.routeLoading = true;
    }

    // Simulate brief loading for UX (allows skeleton to be visible)
    setTimeout(() => {
      this.activeRoute = newRoute;
      this.hash = location.hash;
      this.soundLib.sounds.ping.play();

      // Update meta tags for new route
      this.updateMetaTags();

      // Hide skeleton after content loads
      if (this.routeLoading) {
        setTimeout(() => {
          this.routeLoading = false;
        }, 100);
      }
    }, previousRoute !== newRoute ? 200 : 0);
  }

  @Listen('popstate', { target: 'window', capture: true })
  onNavigate(_e: PopStateEvent) {
    this.hash = location.hash;
    const urlLang = getLanguageFromURL();
    if (urlLang && urlLang !== this.currentLanguage) {
      i18nService.setLanguage(urlLang, false); // Sync language from URL
    }
    this.StatePushed?.emit({ state: {}, title: '', url: location.pathname + location.hash });
  }

  @Listen('hashchange', { target: 'window', capture: true })
  onHashChange(_e: HashChangeEvent) {
    this.hash = location.hash;
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
        {/* Skip to main content link for accessibility */}
        <a href="#main-content" class="skip-link">Skip to main content</a>

        <div id='background' role="presentation">
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

        <main id="main-content"
              style={{ display: 'block' }}
              class='relative main'
              role="main"
              aria-label="Main content">
          {
            /* Show skeleton loader during route transitions */
            this.routeLoading && !this.loading ? (
              <div class="route-skeleton" style={{ width: `calc(100vw - ${this.menuOpened ? this.menuWidth : 0}px)` }}>
                <skeleton-loader type="card" count={2}></skeleton-loader>
              </div>
            ) : null
          }
          {
            this.activeRoute !== '/welcome' || this.loading || this.routeLoading?
              null : (
                <gui-welcome player={this.player} menuOpened={this.menuOpened} menuWidth={this.menuWidth}></gui-welcome>
              )
          }
          {
            this.activeRoute !== '/about-me' || this.loading || this.routeLoading?
              null : (
                <gui-about hash={this.hash} menuOpened={this.menuOpened} menuWidth={this.menuWidth}></gui-about>
              )
          }
          {
            this.activeRoute !== '/my-blog' || this.loading || this.routeLoading?
              null : (
                <gui-blog hash={this.hash} menuOpened={this.menuOpened} menuWidth={this.menuWidth}></gui-blog>
              )
          }
          {
            this.activeRoute !== '/my-projects' || this.loading || this.routeLoading?
              null : (
                <gui-projects hash={this.hash} menuOpened={this.menuOpened} menuWidth={this.menuWidth}></gui-projects>
              )
          }
          {
            /* Only load 3D background on welcome page to reduce initial bundle size */
            this.activeRoute === '/welcome' && !this.loading ? (
              <background-activity digiCode={this.player?.digiCode || ''}
                                   menuWidth={this.menuOpened ? this.menuWidth : 0}></background-activity>
            ) : null
          }
          {
            /* Show 404 only for invalid routes and not during loading */
            !this.loading && !this.routeLoading && this.activeRoute && !MENU_ITEMS.map(value => value.path).includes(this.activeRoute) ? <gui-404></gui-404> : null
          }
        </main>
        <right-panel id='rightP' isOpened={this.menuOpened} role="complementary" aria-label="Navigation menu"></right-panel>

        <main-footer menuOpened={this.menuOpened} menuWidth={this.menuWidth}></main-footer>

        {/* PWA Install Prompt */}
        {!this.loading && <pwa-install-prompt></pwa-install-prompt>}

      </Host>
    );
  }

}
