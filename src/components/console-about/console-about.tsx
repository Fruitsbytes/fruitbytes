import { Component, Host, h, Element, Listen } from '@stencil/core';
import { MenuItem2 } from '../../interfaces/menuItem';
import { ABOUT_SECTION } from '../../config';


function generateMenu(menuItems: MenuItem2[]): string {

  let parent = `<ul class='menu'>`;
  for (const menuItem of menuItems) {
    let li = '';
    if (menuItem.children) {
      li += `<li  class='menu-item menu-item-with-children ${menuItem.icon ? 'sub-section' : 'top-section'}'>`;
      if (menuItem.icon) {
        li += `<span class='menu-icon material-symbols-sharp'>${menuItem.icon}</span>`;
      }
      li += `<span class='menu-title'>${menuItem.title}</span>`;
      li += generateMenu(menuItem.children);
      li += '</li>';
    } else {
      li += `<simple-link link='/about-me#${menuItem.hash}'><li class='menu-item menu-link' data-hash='#${menuItem.hash}'>`;
      if (menuItem.icon) {
        li += `<span class='menu-icon material-symbols-sharp'>${menuItem.icon}</span>`;
      }
      li += `<span class='menu-title'>${menuItem.title}</span>`;
      li += '</li></simple-link>';
    }

    parent += li;
  }

  parent += `</ul>`;

  return parent;
}

let generatedMenu = generateMenu(ABOUT_SECTION);

@Component({
  tag: 'console-about',
  styleUrl: 'console-about.scss',
  shadow: true,
})
export class ConsoleAbout {

  @Element() el!: HTMLElement;

  componentDidLoad() {
    this.selectMenuItem();
  }

  @Listen('popstate', { target: 'window', capture: true })
  @Listen('state.pushed', { target: 'document' })
  selectMenuItem() {
    const url = new URL(window.location.href);
    const currentHash = url.hash;
    const links = this.el.shadowRoot?.querySelectorAll<HTMLElement>('.menu-link') || [];

    links.forEach((value, index) => {
      if ((!currentHash || currentHash === '#') && index === 0) {
        value.classList.remove('selected');
        return;
      }
      if (value.dataset.hash === currentHash) {
        value.classList.add('selected');
      } else {
        value.classList.remove('selected');
      }
    });

  }

  render() {
    return (
      <Host>
        <div innerHTML={generatedMenu} style={{ paddingTop: '2px', maxHeight: 'calc(100% - 470px)', overflowY: 'scroll', overflowX: 'auto' }}></div>
        <div class='cvs absolute bottom-0 px-3'>

          <div class='rounded border p-2 my-3 bb relative'>
            <h1 class='font-medium text-lg flex justify-between py-1'>Download CV <pre
              class='text-sm text-orange-400 font-mono'>v1.0.1</pre></h1>

            <div class='grid grid-cols-5'>
              <div class='py-2 mr-2 col-span-3'>
                <label htmlFor='speciality' class='block mb-2 text-sm font-medium  text-gray-400'>Target</label>
                <select id='speciality'
                        class='bb border text-sm rounded-lg bg-opacity-0 block w-full p-2.5 bg-gray-900 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500'>
                  <option value='frontend'>Frontend Software Developer</option>
                  <option value='fullStack'>FullStack Software Developer</option>
                  <option value='wireless'>WirelessNetwork engineer/instructor</option>
                </select>
              </div>

              <div class='py-2  col-span-2'>
                <label htmlFor='lang' class='block mb-2 text-sm font-medium  text-gray-400'>Language</label>
                <select id='lang'
                        class='bb border text-sm rounded-lg block bg-opacity-0 w-full p-2.5 bg-gray-900 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500'>
                  <option value='en'>English</option>
                  <option value='fr'>Français</option>
                  <option value='es'>Español</option>
                </select>
              </div>

              <div class='mb-5 col-span-4 flex'>
                <button
                  class='text-white flex items-center  focus:ring-4  font-medium rounded-lg text-sm px-5 py-2 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800'>

                  <svg class='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'
                       xmlns='http://www.w3.org/2000/svg'>
                    <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2'
                          d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'></path>
                  </svg>
                  Download
                </button>
                <button type='button'
                        class='ml-2 flex items-center justify-center hover:text-white border  hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 text-center border-blue-500 text-blue-500  hover:bg-blue-600 :focus:ring-blue-800'>
                  <span class='material-symbols-rounded'>content_copy</span>
                  <span>Copy Link</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </Host>
    );
  }

}
