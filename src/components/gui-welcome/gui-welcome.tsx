import { Component, Event, EventEmitter, h, Host, Prop, Element, State } from '@stencil/core';
import { Nullable } from '../../interfaces/geneneral-types';
import { Player } from '../../facade/character';
import { SoundLibraryService } from '../../services/soundLibraryService';
import { Log } from '../../interfaces/log';
import tools from './tools.json';
import { interval, repeat, Subscription, take } from 'rxjs';

@Component({
  tag: 'gui-welcome',
  styleUrl: 'gui-welcome.scss',
  shadow: true,
})
export class GuiWelcome {
  @Prop() menuOpened!: boolean;
  @Prop() menuWidth!: number;
  @Prop() player!: Nullable<Player>;
  @State()selected: number[] = [];
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

              <p>Hi, <code><b class='text-yellow-100'>{this.player?.name || 'Jon Doe'}</b></code> you decided to be
                known as
                the <b class='text-blue-200'>{this.player?.characterType.flavor || 'Fresh'}</b> <b
                  class='text-red-200'>{this.player?.characterType.type || 'Apple - Red Delicious'}</b>. Great choice!
              </p>
              <p>I am currently exploring video game programing and this website is my playground. It is a work in
                progress, always evolving</p>
              <br />
              <p>For the first time in a long time, I get to finally put my Civil Engineer Math/Physic classes to good
                use. My interest for video games started at 5 years old, when I received my first NES. Little did I know
                that the grim artifacts loaded by the corrupted cartridges would bring the same despair 14 years later,
                while compiling C++ on Borland. </p>
              <br />

              <div class='flex justify-center items-center'>
                <img src='../../assets/images/chokobo.png' alt='chokobo-final-fantasy'
                     title='Chokobo - Final Fantasy - PS2'
                     class='sims' />
                <img src='../../assets/images/whololo-monk.gif' alt='ages-of-empire' class='sims'
                     title='Whololo Monk  - Age of Empire - PC' />
              </div>

              <p>My first real coding experience stated circa 1998, when we finally upgraded to SNES. It was the year of
                the famous football match, Brasil vs France : 0 - 3. My cousin got a VTech and I was able to code using
                Basic. Growing up, I was introduced to Visual Basic and Ti-Basic on my graphing calculator during my
                last years in college. I always dreamed of the day when I would be able to help port StarCraft on the
                Ti-89.</p>
              <p>The team working on that task made a lot of progress. I wonder what type of version control they were
                using at the time. Video games were always my passion, my first username was <b
                  class='text-blue-700'>Bleuscyther</b> (Blue + Scyther), my favorate color and my favorite pokemon.</p>
              <br />

              <div class='flex justify-center items-center'>
                <img src='../../assets/images/scyther.gif' alt='scyther-pokemon' title='Pokemon' class='sims' />
                <img src='../../assets/images/starcraft.png' alt='star-craft-protoss' class='sims'
                     title='StarCaft Protos' />
              </div>

              <p>Now after 14 years of building softwares and websites professionally, I try to spend my free time on
                learning how to produce video games if i am not playing a Paradox game on ironman. My goal is to have
                enough
                skills to do a X-Com III preview , Tyranny II (by Obsidian) or even The Movies - Remastered (by
                LionHead) HD 😅</p>

              <br />

              <div class='flex justify-center items-center'>
                <img src='../../assets/images/luidgi.svg' alt='super-mario' class='sims'
                     title='Super Mario Mario BROS NES' />
              </div>

              <p>In the meantime if you need a software developer or consulting service on your software project hit me
                up.</p>

              <p class='text-center'>Thank you for reading this far, <br /> have a treat: </p>
              <button type='button' onClick={this.buba}
                      class='mx-auto block text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900'>
                Frosted fruit candies
              </button>
              <div class='flex justify-center items-center'>
                <img src='../../assets/images/civilization.png' alt='civilization' class='sims'
                     title="Sid Meier's  Civilization - PC" />
              </div>
            </div>

            <div class='links'>
              <simple-link link={'/about-me'}>
                <div class='special-link'>More about me</div>
              </simple-link>
              <simple-link link={'/my-projects'}>
                <div class='special-link'>My projects</div>
              </simple-link>
              <simple-link link={'/contact-me'}>
                <div class='special-link'>Contact me</div>
              </simple-link>
              <simple-link link={'/my-blog'}>
                <div class='special-link'>Check out my Blog</div>
              </simple-link>
            </div>
          </div>
        </div>


      </Host>
    );
  }
}
