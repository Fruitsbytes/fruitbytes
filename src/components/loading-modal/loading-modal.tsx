import { Component, Host, h, Prop, Event, EventEmitter, Element } from '@stencil/core';
import { Nullable } from '../../interfaces/geneneral-types';
import { Player } from '../../facade/character';

@Component({
  tag: 'loading-modal',
  styleUrl: 'loading-modal.scss',
  shadow: true,
})
export class LoadingModal {

  @Prop() progressText !: string;
  @Prop() progress !: number;
  @Prop() volumeMuted!: boolean;
  @Prop() player?: Nullable<Player>;
  @Element() el!: HTMLElement;
  @Event({ eventName: 'toggle.volume' }) ToggleVolume!: EventEmitter<void>;

  _toggleVolume = () => {
    this.ToggleVolume.emit();
  };

  render() {
    return (
      <Host id='loading'>

        <div class='loading bg-indigo-900 backdrop-filter backdrop-blur-lg bg-opacity-40  firefox:bg-opacity-90'>
          <div class='flex flex-col justify-center items-center cartouche'>
            <div class='relative w-100 p-1 animate__animated animate__zoomIn animate__delay-1s'>
              <img src='../../assets/images/logo.png' alt='FruitsBytes'
                   class='loadingImg '
                   style={{ filter: `grayscale(${1 - (this.progress / 100)})` }} />
            </div>

            {
              this.progress === 100 ? null : (
                <div class='my-5 border border-gray-100 bg-indigo-900  rounded-full h-1.5'
                     style={{ width: '200px' }}>

                  <div class='smooth bg-gray-200 h-1.5 rounded-full'
                       style={{ width: `${this.progress}%` }}></div>
                </div>
              )
            }
            <div class='progress-text text-center' innerHTML={this.progressText}></div>

            {
              this.progress !== 100 ? null : (
                <div>
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
                          class='bg-gray-100 text-gray-800 text-xs font-semibold inline-block mr-1 mb-1 px-2.5 py-0.5 rounded'>Gamer</span>
                        <span
                          class='bg-gray-100 text-gray-800 text-xs font-semibold inline-block mr-1 mb-1 px-2.5 py-0.5 rounded'>Haitian</span>
                        <span
                          class='bg-gray-100 text-gray-800 text-xs font-semibold inline-block mr-1 mb-1 px-2.5 py-0.5 rounded'>Wireless Network Trainer</span>

                        <span
                          class='bg-gray-100 text-gray-800 text-xs font-semibold inline-block mr-1 mb-1 px-2.5 py-0.5 rounded'>Graphic Designer</span>
                        <span
                          class='bg-gray-100 text-gray-800 text-xs font-semibold inline-block mr-1 mb-1 px-2.5 py-0.5 rounded'>Freelance</span>

                      </div>
                      <p class='text-justify mt-3 mb-1'>Welcome to my personal website. Here I showcase my projects,
                        passions,
                        hobbies and everything that motivates me in life. Enjoy!</p>
                    </div>
                    <div class='flex justify-center w-full mt-3 items-center volume'>
                      <button type='button' onClick={this._toggleVolume}
                              class='text-gray-300 border mr-1 border-gray-300 hover:bg-gray-50 hover:text-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center'>
                        <svg class='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'
                             xmlns='http://www.w3.org/2000/svg'>
                          <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2'
                                d='M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129'></path>
                        </svg>
                      </button>
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
                            class='text-xs text-gray-300 inline-block ml-2 animate__animated animate__pulse animate__infinite animate__slow'>
                             <svg class='w-5 h-5 inline-block '
                                  fill='none' stroke='currentColor' viewBox='0 0 24 24'
                                  xmlns='http://www.w3.org/2000/svg'><path stroke-linecap='round'
                                                                           stroke-linejoin='round' stroke-width='2'
                                                                           d='M11 19l-7-7 7-7m8 14l-7-7 7-7'></path></svg>
                          <i class='mr-4'>Sound <b>ON</b></i>
                        </span>
                        ) : null
                      }
                    </div>
                  </div>
                  <social-links></social-links>
                </div>
              )
            }
          </div>
          {
            this.progress === 100 && !this.player?.id ? (
              <character-selection></character-selection>
            ) : null
          }
        </div>

      </Host>
    );
  }

}
