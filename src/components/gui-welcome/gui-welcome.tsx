import { Component, Event, EventEmitter, h, Host, Prop, Element, State } from '@stencil/core';
import { Nullable } from '../../interfaces/geneneral-types';
import { Player } from '../../facade/character';
import { SoundLibraryService } from '../../services/soundLibraryService';
import { Log } from '../../interfaces/log';
import tools from './tools.json';
import { interval, repeat, Subscription, take } from 'rxjs';
import { t, getCurrentLanguage } from '../../services/i18n';
import { Language } from '../../interfaces/translation';

@Component({
  tag: 'gui-welcome',
  styleUrl: 'gui-welcome.scss',
  shadow: true,
})
export class GuiWelcome {
  @Prop() menuOpened!: boolean;
  @Prop() menuWidth!: number;
  @Prop() player!: Nullable<Player>;
  @State() selected: number[] = [];
  @State() currentLanguage: Language = getCurrentLanguage();
  @Event({ eventName: 'pull.box.up' }) PullBoxUp!: EventEmitter<boolean>;
  @Event({ eventName: 'console.logged' }) Log!: EventEmitter<Log>;
  @Element() el!: HTMLElement;
  private soundLib = SoundLibraryService.instance();
  private subscription?: Subscription;

  componentDidLoad() {
    const accolades = this.el.shadowRoot?.querySelector<HTMLElement>('#accolades-grid');
    const text = this.el.shadowRoot?.querySelector<HTMLElement>('#text');

    if (text && accolades) {
      text.onscroll = (_e) => {
        // console.log(text.scrollHeight - text.clientHeight, text.scrollTop);
        accolades.scrollTop = Math.round(accolades.scrollHeight * (text.scrollTop / (text.scrollHeight - text.clientHeight)));
      };
    }

    setTimeout(this.wave);

  }

  @Listen('language.changed', { target: 'document' })
  handleLanguageChange(event: CustomEvent<Language>) {
    this.currentLanguage = event.detail;
  }

  wave = (point= 0, count = 3) => {
    if(this.selected.length > 0){
      return;
    }
    const columns = 10;
    const rows = Math.ceil((tools as unknown as string[]).length / columns);

    const start = point %  columns;

    this.subscription = interval(200).pipe(
      take(columns + rows),
      repeat({ delay: 0, count })
    ).subscribe({
      next:(j) => {
        const a = [];
        for (let i = 0; i < rows; i++) {
          const b= ((i * columns) + j - i) + start;
          if(b >= (columns * i) && b < (columns * (i+1))){
            a.push(b)
          }else if(b >= (columns * (i+1))){
            a.push( b - columns)
          }
        }
        this.selected = a
      },
      complete: ()=>{
        this.selected =[];
      }
    });

  };

  disconnectedCallback(){
    this.subscription?.unsubscribe();
  }

  buba = () => {

    this.PullBoxUp?.emit(true);
    const id = this.soundLib.sounds.jumpSoft.play();
    this.soundLib.sounds.jumpSoft.volume(1, id);

    this.Log?.emit({
      message: `Dattebayo! 🍭🍬 <br>Binary fruit frosties generated. <br><small style='color:#585858;line-height: .9'>${this.player?.digiCode}</small>`,
      file: 'daijōbu.wasm',
      time: new Date(),
      line: 501,
    });
  };

  render() {

    return (
      <Host style={{ width: `calc(100vw - ${this.menuOpened ? this.menuWidth : 0}px)` }}>
        <div class='menu animate__animated animate__fadeInUp bg-gray-800 bg-opacity-70 text-gray-200'>

          <div class='me'>
            <img src='../../assets/images/me_game.png' class='avatar' alt='Jeffrey Nicholson Carre' />
            <div class='buffer'>
              <div id='accolades' class='accolades'>
                <div class='overlay'></div>
                <div class='overlay-1'></div>
                <div id='accolades-grid' class='gr'>
                  {
                    (tools as unknown as string[]).map((value , index) => <div key={value} onClick={()=> this.wave(index + 1, 1)} class={`holder ${this.selected.includes(index) ? 'selected' : ''}`}><img
                      src={`../../assets/logos/${value}.png`} alt={value} title={value} /></div>)
                  }
                </div>

              </div>
            </div>
            <div id='text' class='text font-mono text-sm'>

              <div class='flex justify-center items-center'>
                <img src='../../assets/images/samus.gif' alt='super-metroid' class='sims'
                     title='Samus - Super Metroid - SNES' />
                <img src='../../assets/images/sims.gif' alt='sims-gem' class='sims' title='The Sims - PC' />
                <img src='../../assets/images/megaman.gif' alt='megaman' class='sims' title='Megaman' />
              </div>

              <p dangerouslySetInnerHTML={{
                __html: t('welcome.greeting', {
                  name: `<code><b class='text-yellow-100'>${this.player?.name || 'Jon Doe'}</b></code>`,
                  flavor: `<b class='text-blue-200'>${this.player?.characterType.flavor || 'Fresh'}</b>`,
                  type: `<b class='text-red-200'>${this.player?.characterType.type || 'Apple - Red Delicious'}</b>`
                })
              }}></p>
              <p>{t('welcome.intro1')}</p>
              <br />
              <p>{t('welcome.intro2')}</p>
              <br />

              <div class='flex justify-center items-center'>
                <img src='../../assets/images/chokobo.png' alt='chokobo-final-fantasy'
                     title='Chokobo - Final Fantasy - PS2'
                     class='sims' />
                <img src='../../assets/images/whololo-monk.gif' alt='ages-of-empire' class='sims'
                     title='Whololo Monk  - Age of Empire - PC' />
              </div>

              <p>{t('welcome.coding1')}</p>
              <p>{t('welcome.coding2')}</p>
              <br />

              <div class='flex justify-center items-center'>
                <img src='../../assets/images/scyther.gif' alt='scyther-pokemon' title='Pokemon' class='sims' />
                <img src='../../assets/images/starcraft.png' alt='star-craft-protoss' class='sims'
                     title='StarCaft Protos' />
              </div>

              <p>{t('welcome.current')}</p>

              <br />

              <div class='flex justify-center items-center'>
                <img src='../../assets/images/luidgi.svg' alt='super-mario' class='sims'
                     title='Super Mario Mario BROS NES' />
              </div>

              <p>{t('welcome.cta')}</p>

              <p class='text-center'>{t('welcome.thanks')} <br /> {t('welcome.treat')} </p>
              <button type='button' onClick={this.buba}
                      class='mx-auto block text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900'>
                {t('welcome.button')}
              </button>
              <div class='flex justify-center items-center'>
                <img src='../../assets/images/civilization.png' alt='civilization' class='sims'
                     title="Sid Meier's  Civilization - PC" />
              </div>
            </div>

            <div class='links'>
              <simple-link link={'/about-me'}>
                <div class='special-link'>{t('welcome.links.moreAbout')}</div>
              </simple-link>
              <simple-link link={'/my-projects'}>
                <div class='special-link'>{t('welcome.links.myProjects')}</div>
              </simple-link>
              <simple-link link={'/contact-me'}>
                <div class='special-link'>{t('welcome.links.contactMe')}</div>
              </simple-link>
              <simple-link link={'/my-blog'}>
                <div class='special-link'>{t('welcome.links.checkBlog')}</div>
              </simple-link>
            </div>
          </div>
        </div>


      </Host>
    );
  }
}
