import { Component, Host, h, Element, State } from '@stencil/core';
import { FRUIT_FLAVORS, FRUIT_TYPES } from '../../interfaces/fruits';
import { animateCSS, getRandomArbitrary, getRandomInt } from '../../utils';
import { SoundLibraryService } from '../../services/soundLibraryService';

@Component({
  tag: 'character-selection',
  styleUrl: 'character-selection.scss',
  shadow: true,
})
export class CharacterSelection {

  @Element() el;
  @State() character;
  @State() selectedFruit = 0;
  @State() selectedFlavor = 0;
  private selectTypeEl: HTMLSelectElement;
  private selectFlavorEl: HTMLSelectElement;
  private soundLib: SoundLibraryService;


  connectedCallback() {
    this.soundLib = SoundLibraryService.instance();
    this.soundLib.preload(['menuSelect', 'roll', 'cheerfull']);
  }

  componentDidLoad() {
    this.populateForest();
    this.populateTypeSelector();
    this.popuplateFlavorSelector();
    const avatar = this.el.shadowRoot.querySelector('#avatar');

    if (avatar) {
      animateCSS(avatar.parentElement, 'bounce slower delay-1s'.split(' '));
    }
  }

  populateForest() {
    const leftPositions: number[] = [-330];
    const forest = this.el.shadowRoot.querySelector('#forest');
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
        const style = `z-index:${i * -2}; left:${left}px;` +
          `top: ${top}px;filter: hue-rotate(${hue}deg) saturate(${saturation});` +
          `transform: scale(${scale}) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg);`;

        forest.innerHTML += `<img data-tree-id='${i}' src='../../assets/images/tree.png' style='${style}' alt='tree' class='tree block' />`;
      }
    }
  }

  popuplateFlavorSelector() {
    this.selectFlavorEl = this.el.shadowRoot.querySelector('#flavor');

    if (this.selectFlavorEl) {
      for (const fruitFlavor of FRUIT_FLAVORS) {
        this.selectFlavorEl.innerHTML += `<option value='${fruitFlavor}'>${fruitFlavor}</option>`;
      }
    }
  }

  populateTypeSelector() {
    this.selectTypeEl = this.el.shadowRoot.querySelector('#type');
    if (this.selectTypeEl) {
      for (const fruitType of FRUIT_TYPES) {
        this.selectTypeEl.innerHTML += `<option value='${fruitType}'>${fruitType}</option>`;
      }
    }
  }

  pluck = () => {
    this.soundLib.sounds.cheerfull.play();
  };

  randomize = () => {
    this.soundLib.sounds.roll.play();
  };

  selectFruit = async (e) => {

    this.soundLib.sounds.menuSelect.play();
    const avatar = this.el.shadowRoot.querySelector('#avatar');

    if (avatar) {
      const value = e.target.value;
      let i = FRUIT_TYPES.indexOf(value);
      if (i < 0 || i > FRUIT_TYPES.length - 1) { // 😋 don't play with the code  in the inspection tool
        i = 0;
      }
      avatar.style.backgroundPositionX = i * -16 + 'px';
      animateCSS(avatar.parentElement, 'bounceIn'.split(' '));
      this.populateFuitsOnTrees();
      this.selectedFruit = i;
    }
  };

  selectFlavor = async (e) => {

    this.soundLib.sounds.menuSelect.play();
    const avatar = this.el.shadowRoot.querySelector('#avatar');

    if (avatar) {
      const value = e.target.value;
      let i = FRUIT_FLAVORS.indexOf(value);
      if (i < 0 || i > FRUIT_FLAVORS.length - 1) { // 😋 don't play with the code  in the inspection tool
        i = 0;
      }
      avatar.style.backgroundPositionY = i * -16 + 'px';
      animateCSS(avatar.parentElement, 'bounceIn'.split(' '));
      this.selectedFlavor = i;
    }
  };

  populateFuitsOnTrees() {
    const forest = this.el.shadowRoot.querySelector('#forest');
    const frontTree = this.el.shadowRoot.querySelector('#frontTree');
    const scale = 1.3;
    const foliages = this.el.shadowRoot.querySelectorAll('.foliage');

    for (const foliage of foliages) {
      foliage.remove();
    }

    if (forest && frontTree) {
      const trees: HTMLImageElement[] = forest.getElementsByClassName('tree');
      setTimeout(() => {
        for (const tree of trees) {
          forest.append(this.generateFruits(tree, [this.selectedFruit, this.selectedFlavor], scale));
        }
        frontTree.parentElement.append(this.generateFruits(frontTree, [this.selectedFruit, this.selectedFlavor], 1.4));
      });
    }
  }

  generateFruits(tree: HTMLElement, [selectedFruit, _selectedFlavor] = [0, 0], scale: number = 1, debug = false) {
    const treeId = tree.getAttribute('data-tree-id');

    const { zIndex, top, left } = getComputedStyle(tree);
    const { width, height } = tree.getBoundingClientRect();

    let foliage = document.createElement('div');
    foliage.classList.add('foliage');
    foliage.style.position = 'absolute';
    foliage.style.zIndex = (parseInt(zIndex || '0') + 1) + '';
    foliage.style.top = top;
    foliage.style.left = left;
    foliage.style.width = `${width}px`;
    foliage.style.height = `${(.6 * height)}px`;

    if (debug) {
      foliage.style.backgroundColor = 'rgba(227,8,15,0.47)';
    }

    const a = parseFloat(foliage.style.width) / 2 - 8;
    const b = parseFloat(foliage.style.height) / 2 - 8;

    const center = {
      x: 0,
      y: 0,
    };

    for (let i = 0; i < 8; i++) {
      const r = a * Math.sqrt(getRandomArbitrary(0, 1));
      const fi = 2 * Math.PI * getRandomArbitrary(0, 1);
      const aLeft = center.x + (r * Math.cos(fi)) + a;
      const aTop = center.y + ((b / a) * r * Math.sin(fi)) + b + (16 * scale);

      const x = selectedFruit * -16;
      const y = getRandomInt(0, 3) * -16;
      const style = `position:absolute;top:${aTop}px;left:${aLeft}px;background-position-x:${x}px;background-position-y:${y}px;transform: scale(${scale});"`;
      foliage.innerHTML += `<span class='fruits-sprite block' style='${style}' data-fruit-id='${treeId}-${i}'></span>`;
    }

    return foliage;
  }

  render() {
    return (
      <Host
        class='block animate__animated animate__slow animate__fadeInUp  flex'>
        <div
          class='p-5 ml-5 bg-gray-50 bg-opacity-90 firefox:bg-opacity-90 border-gray-300 rounded relative border-b-green-500 border-2'
          style={{ width: '392px' }}>

          <div>
            <p class='m-0  text-gray-800 font-mono'><span>I you were a</span></p>
            <h1 class='text-4xl m-0 font-black text-green-900 leading-tight'> Fruit</h1>
          </div>

          <div
            class='bg-blue-700 rounded-full ring-8 ring-blue-500 mx-auto mb-3 flex justify-center items-center h-24 w-24 '>
            <span class='block'>
                <span id='avatar' class='fruits-sprite fruits-avatar'></span>
            </span>
          </div>
          <img src='../../assets/images/tree.png' alt='tree' class='tree' id='frontTree' />
          <div class='forest' id='forest'></div>
          <div class=''>
            <div class='grid gap-6 mb-3 lg:grid-cols-1 pb-3'>
              <div>
                <label htmlFor='username' class='block mb-2 text-sm font-medium text-gray-700'>Name</label>
                <input type='text' id='username'
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
            <div class='pb-3'>
              <div>
                <label htmlFor='seed' class='block mb-2 text-sm font-medium text-gray-700'>Seeds</label>
                <input id='seed' type='range' min='0' max='5' step='0.5' value='2.5'
                       class='w-full h-3 bg-gray-300  rounded-lg appearance-none cursor-pointer range range-lg' />
              </div>
            </div>
          </div>
          <div class='flex justify-between mt-6 '>
            <button type='button' onClick={this.randomize}
                    class='text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 text-center inline-flex items-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800'>
              <svg class='w-6 h-6  mr-2 -ml-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'
                   xmlns='http://www.w3.org/2000/svg'>
                <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2'
                      d='M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z'></path>
              </svg>
              Randomize
            </button>
            <button type='button' onClick={this.pluck}
                    class='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 text-center inline-flex items-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
              <svg class="'w-6 h-6  mr-2 -ml-1" fill='none' stroke='currentColor' viewBox='0 0 24 24'
                   xmlns='http://www.w3.org/2000/svg'>
                <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2'
                      d='M13 10V3L4 14h7v7l9-11h-7z'></path>
              </svg>
              Pluck
            </button>
          </div>

        </div>

      </Host>
    );
  }

}
