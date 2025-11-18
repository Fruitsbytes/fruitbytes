import { Component, Host, h, Element, State, EventEmitter, Event } from '@stencil/core';
import { FRUIT_FLAVORS, FRUIT_TYPES } from '../../interfaces/fruits';
import { animateCSS, capitalizeFirstLetter, dec2bin, getRandomArbitrary, getRandomInt, text2Binary } from '../../utils';
import { SoundLibraryService } from '../../services/soundLibraryService';

const names = ['candied',
  'fleshy', 'sour', 'forbidden',
  'fruit', 'raw', 'succulent',
  'glacé', 'rare', 'native',
  'green', 'poisonous',
  'in-season',
  'mealy',
  'out-of-season',
  'overripe',
  'pitted',
  'ripe',
  'seasonal',
  'seedless',
  'stoned',
  'sun-dried',
  'delicious',
  'bitter',
  'wild',
  'sweet',
  'luscious',
  'exotic',
  'canned',
  'unripe',
  'edible',
  'rotten',
  'waxy'];

import pl from './pl.json';
import cs from './cs.json';
import { Player } from '../../facade/character';
import { Nullable } from '../../interfaces/geneneral-types';

@Component({
  tag: 'character-selection',
  styleUrl: 'character-selection.scss',
  shadow: true,
})
export class CharacterSelection {

  @Element() el!: HTMLElement;
  @State() selectedFruit = 0;
  @State() selectedFlavor = 0;
  @State() name = '';
  private selectTypeEl: Nullable<HTMLSelectElement>;
  private selectFlavorEl: Nullable<HTMLSelectElement>;
  private soundLib: SoundLibraryService = SoundLibraryService.instance();
  @State() trees: any[] = [];
  @Event({ eventName: 'close.loading' }) close!: EventEmitter<boolean>;

  connectedCallback() {
    this.soundLib.preload(['menuSelect', 'roll', 'cheerfull', 'crush']).catch();
  }

  componentDidLoad() {

    this.populateTypeSelector();
    this.populateFlavorSelector();
    const avatar = this.el.shadowRoot?.querySelector('#avatar');

    if (avatar && avatar.parentElement) {
      animateCSS(avatar.parentElement, 'bounce slower delay-1s'.split(' ')).catch(e => console.warn(e));
    }

    setTimeout(() => {
      this.populateForest();
    }, 800);

  }

  populateForest() {
    const leftPositions: number[] = [-330];
    const forest = this.el.shadowRoot?.querySelector('#forest');
    const trees = [];
    if (forest) {
      for (let i = 0; i < 8; i++) {
        let left = -330;
        let rotateY = 180;
        let rotateZ = 5;
        let scale = 1.1;
        let top = 0;

        if (i !== 0) {
          while (leftPositions.includes(left) || leftPositions.includes(left + 2) || leftPositions.includes(left - 2)) {
            left = getRandomInt(-330, 100);
          }
          leftPositions.push(left);
          rotateY = getRandomInt(0, 1) ? 180 : 0;
          rotateZ = getRandomArbitrary(-2, 2);
          scale = getRandomArbitrary(.7, 1.2);
          top = getRandomArbitrary(-80, -15);
        }

        const hue = getRandomInt(128, 340);
        const saturation = getRandomArbitrary(.2, .8);
        // const style = `z-index:${i * -2}; left:${left}px;` +
        //   `top: ${top}px;filter: hue-rotate(${hue}deg) saturate(${saturation});` +
        //   `transform: scale(${scale}) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg);`;


        trees.push({
          top,
          left,
          key: (crypto as any).randomUUID(),
          zIndex: i * -2,
          filter: `hue-rotate(${hue}deg) saturate(${saturation})`,
          transform: `scale(${scale}) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
        });


      }


    }

    this.trees = [...trees];
  }

  populateFlavorSelector() {
    this.selectFlavorEl = this.el.shadowRoot?.querySelector('#flavor') as Nullable<HTMLSelectElement>;


    if (this.selectFlavorEl) {
      for (const fruitFlavor of FRUIT_FLAVORS) {
        this.selectFlavorEl.innerHTML += `<option value='${fruitFlavor}'>${fruitFlavor}</option>`;
      }
    }
  }

  populateTypeSelector() {
    this.selectTypeEl = this.el.shadowRoot?.querySelector('#type') as Nullable<HTMLSelectElement>;
    if (this.selectTypeEl) {
      for (const fruitType of FRUIT_TYPES) {
        this.selectTypeEl.innerHTML += `<option value='${fruitType}'>${fruitType}</option>`;
      }
    }
  }

  pluck = () => {
    if (!this.name) {
      this.soundLib.sounds.crush.play();
      return;
    }
    this.soundLib.sounds.cheerfull.play();

    const player = new Player({
      name: this.name,
      characterType: {
        type: FRUIT_TYPES[this.selectedFruit],
        flavor: FRUIT_FLAVORS[this.selectedFlavor],
        seed: 8,
      },
    });

    player.save();

    //TODO loading
  };

  randomize = async () => {
    this.soundLib.sounds.roll.play();

    this.name = `${capitalizeFirstLetter(names[getRandomInt(0, names.length - 1)])} ${pl[getRandomInt(0, pl.length - 1)]} ${cs[getRandomInt(0, cs.length - 1)]}`;

    if (this.selectFlavorEl) {
      this.selectFlavorEl.value = FRUIT_FLAVORS[getRandomInt(0, FRUIT_FLAVORS.length - 1)];
    }
    if (this.selectTypeEl) {
      this.selectTypeEl.value = FRUIT_TYPES[getRandomInt(0, FRUIT_TYPES.length - 1)];
      await this.selectFruit(this.selectTypeEl.value);
    }
  };

  selectFruit = async (e: any) => {

    this.soundLib.sounds.menuSelect.play();
    const avatar = this.el.shadowRoot?.querySelector('#avatar');

    if (avatar) {
      const value = e.target?.value || e;
      let i = FRUIT_TYPES.indexOf(value);
      if (i < 0 || i > FRUIT_TYPES.length - 1) { // 😋 don't play with the code  in the inspection tool
        i = 0;
      }

      if (avatar.parentElement) animateCSS(avatar.parentElement, 'bounceIn'.split(' ')).catch( e=> console.warn(e));
      // this.populateFruitsOnTrees();
      this.selectedFruit = i;
    }
  };

  selectFlavor = async (e: any) => {

    this.soundLib.sounds.menuSelect.play();
    const avatar = this.el.shadowRoot?.querySelector('#avatar') as Nullable<HTMLElement>;

    if (avatar) {
      const value = e.target.value;
      let i = FRUIT_FLAVORS.indexOf(value);
      if (i < 0 || i > FRUIT_FLAVORS.length - 1) { // 😋 don't play with the code  in the inspection tool
        i = 0;
      }
      avatar.style.backgroundPositionY = i * -16 + 'px';
      if(avatar.parentElement) animateCSS(avatar.parentElement, 'bounceIn'.split(' ')).catch( e=>{ console.warn(e)});
      this.selectedFlavor = i;
    }
  };

  render() {
    return (
      <Host
        class='block animate__animated animate__slow animate__fadeInUp  flex'>
        <div
          class='p-5 ml-5 bg-gray-50 bg-opacity-90 firefox:bg-opacity-90 border-gray-300 rounded relative border-b-green-500 border-b-8'
          style={{ width: '392px' }}>

          <div>
            <p class='m-0   text-green-800 font-mono leading-none'><span>Which one would it be,</span></p>
            <p class='m-0  text-green-800 font-mono leading-none'><span>if you could be a</span></p>
            <h1 class='text-4xl m-0 font-black text-green-800 leading-noe'> Fruit ?</h1>
            <p class='mb-6 text-gray-800 font-mono leading-none text-sm'><i>(Build your character)</i></p>
          </div>

          <div
            class='bg-blue-700 rounded-full ring-8 ring-blue-500 mx-auto mb-3 flex justify-center items-center h-24 w-24 mb-5'>
            <span class='block'>
                <fruit-item id='avatar' type={this.selectedFruit} flavor={this.selectedFlavor}
                            class='fruits-sprite fruits-avatar'></fruit-item>
            </span>
          </div>

          <fruit-tree id='frontTree' filter='saturate(.4) hue-rotate(325deg'
                      debug={true} fruit={this.selectedFruit} numberOfFruits={8}></fruit-tree>

          <div class='forest' id='forest'>
            {
              this.trees.map((tree) => {
                return <fruit-tree key={tree.key} style={{
                  position: 'absolute',
                  top: tree.top + 'px',
                  left: tree.left + 'px',
                  zIndex: tree.zIndex,
                }}
                                   fruit={this.selectedFruit} filter={tree.filter}
                                   transform={tree.transform}></fruit-tree>;
              })
            }
          </div>
          <div class=''>
            <div class='grid gap-6 mb-3 lg:grid-cols-1 pb-3'>
              <div>
                <label htmlFor='username' class='block mb-2 text-sm font-medium text-gray-700'>Name</label>
                <input type='text' id='username' value={this.name} maxlength={50}
                       onKeyUp={(e) => this.name = (e.target as any).value}
                       class='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                       placeholder='John' required />
              </div>
            </div>

            <div class='grid gap-6 mb-3 lg:grid-cols-2 pb-3'>
              <div>
                <label htmlFor='type' class='block mb-2 text-sm font-medium text-gray-700'>Type + Variety</label>
                <select onChange={this.selectFruit}
                        class='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                        id='type'>
                  <option value=''>Select a fruit</option>
                </select>
              </div>
              <div>
                <label htmlFor='flavor' class='block mb-2 text-sm font-medium text-gray-700'>Flavor</label>
                <select onChange={this.selectFlavor}
                        class='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                        id='flavor'>
                  <option value=''>Select a flavor</option>
                </select>
              </div>
            </div>
          </div>
          <div class='flex justify-between mt-6 pt-5 border-t-green-500 border-t'>
            <button type='button' onClick={this.randomize}
                    class='text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2 text-center inline-flex items-center mr-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800'>
              <svg class='w-6 h-6  mr-2 -ml-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'
                   xmlns='http://www.w3.org/2000/svg'>
                <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2'
                      d='M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z'></path>
              </svg>
              GMO
            </button>
            <button type='button' onClick={this.pluck}
                    class='text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2 text-center inline-flex items-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-green700 dark:focus:ring-green-800'>
              <svg class="'w-6 h-6  mr-2 -ml-1" fill='none' stroke='currentColor' viewBox='0 0 24 24'
                   xmlns='http://www.w3.org/2000/svg'>
                <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2'
                      d='M13 10V3L4 14h7v7l9-11h-7z'></path>
              </svg>
              Pluck
            </button>
          </div>
          <div class='text-left font-mono absolute numnum'>
            <p class='m-0 compu'>C:\Users\me{'>'} <span class='text-yellow-500'>run</span> echo process <span
              class='text-gray-700'>--hash</span></p>
            {text2Binary(`${this.name}`.replace(/\s/g, '')) + dec2bin(this.selectedFruit * 10 + this.selectedFlavor)}
            <span class='animate-flicker text-white'>|</span>
          </div>
        </div>


      </Host>
    );
  }

}
