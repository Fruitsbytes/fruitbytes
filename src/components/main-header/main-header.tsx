import { Component, Host, h, Event, EventEmitter, Prop, Listen, Element, Watch } from '@stencil/core';
import { FRUIT_FLAVORS, FRUIT_TYPES } from '../../interfaces/fruits';
import { SoundLibraryService } from '../../services/soundLibraryService';
import { Nullable } from '../../interfaces/geneneral-types';
import { Player } from '../../facade/character';
import { Log } from '../../interfaces/log';
import _throttle from 'lodash/throttle';
import { getRandomInt } from '../../utils';

@Component({
  tag: 'main-header',
  styleUrl: 'main-header.scss',
  shadow: true,
})
export class MainHeader {
  soundLib: SoundLibraryService = SoundLibraryService.instance();
  private profilDropdownButton: Nullable<HTMLElement>;
  private ready = false;
  myProfile?: HTMLElement | null;
  @Prop() menuOpened!: boolean;
  @Prop() menuWidth!: number;
  @Prop() message?: {
    text?: string;
    content?: string
  };
  @Prop() player?: Nullable<Player>;
  @Prop() volumeMuted!: boolean;
  @Element() el!: HTMLElement;
  @Event({ eventName: 'pull.box.up' }) PullBoxUp!: EventEmitter<boolean>;
  @Event({ eventName: 'console.logged' }) log!: EventEmitter<Log>;
  @Event({ eventName: 'toggle.menu' }) ToggleMenu!: EventEmitter<void>;
  @Event({ eventName: 'toggle.volume' }) ToggleVolume!: EventEmitter<void>;


  componentDidLoad() {
    this.ready = true;
    setTimeout(() => this.re());
  }

  squashCharacter = () => {
    this.player?.delete();
  };

  getGift = () => {
    this.PullBoxUp?.emit(true);
    const id = this.soundLib.sounds.jumpSoft.play();
    this.soundLib.sounds.jumpSoft.volume(1, id);

    this.log?.emit({
      message: `Dattebayo! 🎁 🍜<br>Binary fruit ramen generated. <br><small style='color:#585858;line-height: .9'>${this.player?.digiCode}</small>`,
      file: 'daijōbu.wasm',
      time: new Date(),
      line: 501,
    });
  };


  @Listen('mousemove', { target: 'window', capture: true })
  moveEyes(e: MouseEvent) {
    this.recalculateAvaraEyes(e);
  }

  @Watch('menuOpened')
  @Watch('menuWidth')
  re() {
    if (this.ready)
      this.myProfile = this.el.shadowRoot?.querySelector('#myProfile');
  }


  recalculateAvaraEyes = _throttle((e: MouseEvent) => {
    this.myProfile = this.el.shadowRoot?.querySelector('#myProfile');
    this.profilDropdownButton = this.myProfile?.querySelector('button');
    if (this.profilDropdownButton) {

      const face: HTMLElement | null = this.profilDropdownButton.querySelector('.face');

      if (face) {
        const rect = face.getBoundingClientRect();
        const distance = window.innerWidth / 2;

        const t = Math.atan2(rect.top - e.pageY, distance);
        const t2 = Math.atan2(rect.left - e.pageX, distance);

        const p1 = ((e.pageX - (rect.left + rect.width / 2)) / window.innerWidth);
        const p2 = ((e.pageY - (rect.top + rect.height / 2)) / window.innerHeight);
        const x = (rect.width / 2) * p1;
        const y = (rect.height / 2) * p2;

        face.style.transform = `translateX(${x}px) translateY(${y}px) skewX(${Math.min(t * p1, 0.26)}rad) skewY(${Math.max(Math.min(t2 * p2, 0.30), -.3)}rad) scale(.8)`;

      }

    }
  }, getRandomInt(1500, 3000));

  _toggleMenu = () => {
    this.ToggleMenu.emit();
  };

  _toggleVolume = () => {
    this.ToggleVolume.emit();
  };

  render() {
    return (
      <Host style={{ width: `calc(100vw - ${this.menuOpened ? this.menuWidth : 0}px)`, top: '0px' }}>
        <header
          class='top-menu absolute bg-gray-400 backdrop-filter backdrop-blur-lg bg-opacity-10  firefox:bg-opacity-90'>
          <div class='logo'>
            <img src='../../assets/images/logo.png' alt='FruitsBytes' />
            <span>FruitsBytes</span>
          </div>

          <div class='flex flex-row'>
            <dropdown-button id='myProfile'>
              <button class='toggle-button relative volume animate__animated animate__pulse animate__delay-2s'

                      data-dropdown-toggle='profileDropDown' data-dropdown-placement='bottom'>
                <fruit-item
                  style={{ transform: 'scale(4)', top: '-2px', left: '-55%' }}
                  type={FRUIT_TYPES.indexOf(this.player?.characterType?.type || 'Apple - Red Delicious')}
                  flavor={FRUIT_FLAVORS.indexOf(this.player?.characterType?.flavor || 'Fresh')}></fruit-item>

                <div class='face'>
                  <div class='eyes'>
                    <div class='eye left'></div>
                    <div class='eye right'></div>
                  </div>
                  <div class='mouth'>
                    <div class='thong'></div>
                  </div>
                </div>
                <div id='profileDropDown'
                     class='z-10 hidden divide-y divide-gray-700 rounded shadow w-80 bg-gray-800'>
                  <div class='p-2 text-sm'>
                    <p class='m-0'>{this.player?.name}</p>
                    <p
                      class='m-0 text-gray-400'>{this.player?.characterType.type} • {this.player?.characterType.flavor}</p>
                    <p class='p-1 font-mono rounded bg-gray-900 text-green-800'
                       style={{ fontSize: '.6rem', lineHeight: '1' }}>{this.player?.digiCode}</p>
                  </div>

                  <ul class='py-1 text-sm text-gray-200 ' aria-labelledby='dropdownBottomButton'>
                    <li>
                      <span onClick={this.getGift}
                            class='block px-4 py-2 hover:bg-gray-600 hover:text-white flex items-center'>
                       <span class='material-symbols-rounded w-6 h-6  mr-2'>ramen_dining</span>
                        Frosted Binary Fruit Ramen
                      </span>
                    </li>
                    <li>
                      <span onClick={this.squashCharacter}
                            class='block px-4 py-2 hover:bg-gray-600 hover:text-white flex items-center'>

                        <span class='material-symbols-rounded w-6 h-6  mr-2'>logout</span>
                        Squash
                      </span>
                    </li>
                  </ul>
                </div>
              </button>
            </dropdown-button>

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
          this.ready?
            (
              <message-bubble class='hero-bubble' message={this.message?.text} character={this.myProfile}>
                <div innerHTML={this.message?.content}></div>
              </message-bubble>
            ): null
        }
      </Host>
    );
  }

}
