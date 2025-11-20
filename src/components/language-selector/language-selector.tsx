import { Component, h, State, Listen, Element } from '@stencil/core';
import { Language, AVAILABLE_LANGUAGES } from '../../interfaces/translation';
import { setLanguage, getCurrentLanguage } from '../../services/i18n';

@Component({
  tag: 'language-selector',
  styleUrl: 'language-selector.scss',
  shadow: true,
})
export class LanguageSelector {
  @Element() el!: HTMLElement;
  @State() currentLanguage: Language = getCurrentLanguage();
  @State() isOpen: boolean = false;

  componentWillLoad() {
    this.currentLanguage = getCurrentLanguage();
  }

  @Listen('language.changed', { target: 'document' })
  handleLanguageChange(event: CustomEvent<Language>) {
    this.currentLanguage = event.detail;
  }

  private handleLanguageSelect = async (language: Language) => {
    if (language !== this.currentLanguage) {
      await setLanguage(language);
      this.currentLanguage = language;
      this.isOpen = false;
    }
  };

  private toggleDropdown = (event: Event) => {
    event.stopPropagation();
    this.isOpen = !this.isOpen;
  };

  private handleClickOutside = (event: Event) => {
    // Check if the click is outside the component
    const path = event.composedPath();
    const clickedInside = path.includes(this.el);

    if (!clickedInside && this.isOpen) {
      this.isOpen = false;
    }
  };

  componentDidLoad() {
    document.addEventListener('click', this.handleClickOutside, true);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleClickOutside, true);
  }

  render() {
    const currentLang = AVAILABLE_LANGUAGES.find(lang => lang.code === this.currentLanguage);

    return (
      <div class="language-selector">
        <button
          class="language-button"
          onClick={this.toggleDropdown}
          aria-label="Select language"
          aria-haspopup="true"
          aria-expanded={this.isOpen ? 'true' : 'false'}
        >
          <span class="material-symbols-sharp">language</span>
          <span class="language-label">{currentLang?.code.toUpperCase()}</span>
          <span class={`arrow ${this.isOpen ? 'open' : ''}`}>▼</span>
        </button>

        {this.isOpen && (
          <div class="language-dropdown" role="menu">
            {AVAILABLE_LANGUAGES.map(lang => (
              <button
                key={lang.code}
                class={`language-option ${lang.code === this.currentLanguage ? 'active' : ''}`}
                onClick={() => this.handleLanguageSelect(lang.code)}
                role="menuitem"
              >
                <span class="language-code">{lang.code.toUpperCase()}</span>
                <span class="language-native-name">{lang.nativeName}</span>
                {lang.code === this.currentLanguage && (
                  <span class="checkmark">✓</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
}
