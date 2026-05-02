import { Component, Host, h, Event, EventEmitter, State, Listen } from '@stencil/core';
import { Log } from '../../interfaces/log';
import { t, getCurrentLanguage } from '../../services/i18n';
import { Language } from '../../interfaces/translation';

@Component({
  tag: 'gui-404',
  styleUrl: 'gui-404.scss',
  shadow: true,
})
export class Gui404 {
  @Event({ eventName: 'console.logged' }) log!: EventEmitter<Log>;
  @State() currentLanguage: Language = getCurrentLanguage();

  @Listen('language.changed', { target: 'document' })
  handleLanguageChange(event: CustomEvent<Language>) {
    this.currentLanguage = event.detail;
  }

  connectedCallback() {
    const errorMessage = t('notFound.consoleError', { path: location.pathname });
    this.log.emit({
      message: `<span style='display: flex'><span class='console-icon'></span> <span>${errorMessage}</span></span>`,
      file: 'spike_spiegel.ts',
      time: new Date(),
      line: 404,
      level: 'error',
    });
  }

  goBack = () => {
    history.back();
  };

  render() {
    return (
      <Host>
        <div style={{ maxWidth: '800px' }}>
          <img src='../../assets/images/crack2.png' alt='' class='img' />
          <h1 class='font-black text-9xl'>{t('notFound.title')}</h1>
          <h2 class='text-6xl font-mono text-gray-300'>
            {t('notFound.subtitle')}
          </h2>
          <p class='text-3xl'>{t('notFound.message')}</p>
          <p><i>{t('notFound.hint')}. </i></p>
          <div class='flex items-center justify-start'>
            <button type='button' onClick={this.goBack}
                    class='text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2'>
              {t('notFound.backButton')}
            </button>
            <simple-link link={'/welcome'}>
              <button type='button'
                      class='text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2'>
                {t('notFound.homeButton')}
              </button>
            </simple-link>

          </div>
        </div>
      </Host>
    );
  }

}
