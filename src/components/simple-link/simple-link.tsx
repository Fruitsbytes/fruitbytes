import { Component, Host, h, Prop, EventEmitter, Event, Listen, State } from '@stencil/core';
import { SoundLibraryService } from '../../services/soundLibraryService';
import { buildURLWithLanguage, getCurrentLanguage, subscribeToLanguageChange } from '../../services/i18n';
import { Language } from '../../interfaces/translation';

@Component({
  tag: 'simple-link',
  styleUrl: 'simple-link.scss',
  shadow: true,
})
export class SimpleLink {

  @Prop() link: string = '/welcome#';
  @Prop() label: string = 'FruitsBytes';
  @Prop() state: Object = {};
  @State() currentLanguage: Language = getCurrentLanguage();
  @Event({ eventName: 'state.pushed' }) StatePushed?: EventEmitter<{ state: any; title: string; url?: string | URL | null; }>;

  soundLib: SoundLibraryService = SoundLibraryService.instance();
  private unsubscribe?: () => void;

  connectedCallback() {
    this.currentLanguage = getCurrentLanguage();
    // Subscribe to language changes
    this.unsubscribe = subscribeToLanguageChange((language) => {
      this.currentLanguage = language;
    });
  }

  disconnectedCallback() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  go = (e: MouseEvent | KeyboardEvent) => {
    e.preventDefault();

    // Build URL with current language prefix
    const linkWithLanguage = buildURLWithLanguage(this.link);

    let url;
    try {
      url = new URL(linkWithLanguage, window.location.origin);
    } catch (_) {
      url = new URL(linkWithLanguage, window.location.origin);
    }

    history.pushState(this.state, this.label, url);
    this.StatePushed?.emit({state: this.state, title: this.label, url})
  };

  handleKeyDown = (e: KeyboardEvent) => {
    // Activate link on Enter or Space key
    if (e.key === 'Enter' || e.key === ' ') {
      this.go(e);
    }
  };

  @Listen('mouseenter')
  bip(){
    this.soundLib.sounds.jumpSoft.play();
  }

  render() {
    const href = buildURLWithLanguage(this.link);

    return (
      <Host>
        <a
          href={href}
          class='simple-link'
          onClick={this.go}
          onKeyDown={this.handleKeyDown}
          role="link"
          tabindex="0"
          aria-label={this.label || this.link}
        >
          <slot></slot>
        </a>
      </Host>
    );
  }

}
