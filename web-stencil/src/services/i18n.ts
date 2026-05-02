import { Language, TranslationKeys, DEFAULT_LANGUAGE } from '../interfaces/translation';

class I18nService {
  private currentLanguage: Language = DEFAULT_LANGUAGE;
  private translations: Map<Language, TranslationKeys> = new Map();
  private listeners: Set<(language: Language) => void> = new Set();
  private fallbackLanguage: Language = DEFAULT_LANGUAGE;

  constructor() {
    this.init();
  }

  /**
   * Initialize the service by loading the language from localStorage
   * and loading the corresponding translation file
   */
  private init(): void {
    // Priority: URL > localStorage > Browser > Default
    const urlLang = this.getLanguageFromURL();
    if (urlLang) {
      this.currentLanguage = urlLang;
      return;
    }

    const savedLanguage = this.getStoredLanguage();
    if (savedLanguage) {
      this.currentLanguage = savedLanguage;
    } else {
      // Try to detect browser language
      const browserLang = this.detectBrowserLanguage();
      if (browserLang) {
        this.currentLanguage = browserLang;
      }
    }
  }

  /**
   * Extract language from URL pathname
   * Supports formats: /en/welcome, /ht/about-me, etc.
   */
  getLanguageFromURL(): Language | null {
    const pathname = window.location.pathname;
    const segments = pathname.split('/').filter(s => s.length > 0);

    if (segments.length > 0) {
      const potentialLang = segments[0] as Language;
      const supportedLanguages: Language[] = ['en', 'ht', 'es', 'fr'];
      if (supportedLanguages.includes(potentialLang)) {
        return potentialLang;
      }
    }

    return null;
  }

  /**
   * Get the page path without language prefix
   * /en/welcome => /welcome
   */
  getPathWithoutLanguage(pathname?: string): string {
    const path = pathname || window.location.pathname;
    const segments = path.split('/').filter(s => s.length > 0);

    if (segments.length > 0) {
      const potentialLang = segments[0] as Language;
      const supportedLanguages: Language[] = ['en', 'ht', 'es', 'fr'];
      if (supportedLanguages.includes(potentialLang)) {
        return '/' + segments.slice(1).join('/');
      }
    }

    return path || '/';
  }

  /**
   * Build URL with language prefix
   * /welcome => /en/welcome (if current language is en)
   */
  buildURLWithLanguage(path: string, language?: Language): string {
    const lang = language || this.currentLanguage;
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    // Remove language prefix if already present
    const pathWithoutLang = this.getPathWithoutLanguage('/' + cleanPath);
    const cleanPathWithoutLang = pathWithoutLang.startsWith('/') ? pathWithoutLang.substring(1) : pathWithoutLang;

    return `/${lang}/${cleanPathWithoutLang}`;
  }

  /**
   * Detect browser language and return if it's supported
   */
  private detectBrowserLanguage(): Language | null {
    const browserLang = navigator.language.split('-')[0] as Language;
    const supportedLanguages: Language[] = ['en', 'ht', 'es', 'fr'];
    return supportedLanguages.includes(browserLang) ? browserLang : null;
  }

  /**
   * Get stored language from localStorage
   */
  private getStoredLanguage(): Language | null {
    const stored = localStorage.getItem('fruitbytes_language');
    return stored as Language | null;
  }

  /**
   * Store language preference in localStorage
   */
  private storeLanguage(language: Language): void {
    localStorage.setItem('fruitbytes_language', language);
  }

  /**
   * Load translation file for a specific language
   */
  async loadTranslations(language: Language): Promise<TranslationKeys> {
    // Check if already loaded
    if (this.translations.has(language)) {
      return this.translations.get(language)!;
    }

    try {
      const response = await fetch(`/assets/translations/${language}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load translations for ${language}`);
      }
      const translations = await response.json();
      this.translations.set(language, translations);
      return translations;
    } catch (error) {
      console.error(`Error loading translations for ${language}:`, error);
      // If loading fails and it's not the fallback, try loading fallback
      if (language !== this.fallbackLanguage) {
        return this.loadTranslations(this.fallbackLanguage);
      }
      throw error;
    }
  }

  /**
   * Get current language
   */
  getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  /**
   * Set current language and load its translations
   * @param language - The language to switch to
   * @param updateURL - Whether to update the URL (default: true)
   */
  async setLanguage(language: Language, updateURL: boolean = true): Promise<void> {
    if (this.currentLanguage === language) {
      return;
    }

    await this.loadTranslations(language);
    this.currentLanguage = language;
    this.storeLanguage(language);

    // Update URL if requested
    if (updateURL) {
      const currentPath = this.getPathWithoutLanguage();
      const newPath = this.buildURLWithLanguage(currentPath, language);
      const hash = window.location.hash;
      window.history.replaceState({}, '', newPath + hash);
    }

    this.notifyListeners();
  }

  /**
   * Subscribe to language changes
   */
  subscribe(callback: (language: Language) => void): () => void {
    this.listeners.add(callback);
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Notify all listeners of language change
   */
  private notifyListeners(): void {
    this.listeners.forEach(callback => callback(this.currentLanguage));
  }

  /**
   * Get nested property from object using dot notation
   * e.g., "nav.home" returns translations.nav.home
   */
  private getNestedProperty(obj: any, path: string): string | undefined {
    const keys = path.split('.');
    let result = obj;

    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = result[key];
      } else {
        return undefined;
      }
    }

    return typeof result === 'string' ? result : undefined;
  }

  /**
   * Interpolate variables in translation string
   * e.g., "Hello {name}" with {name: "World"} => "Hello World"
   */
  private interpolate(text: string, variables?: Record<string, string | number>): string {
    if (!variables) {
      return text;
    }

    return text.replace(/\{(\w+)\}/g, (match, key) => {
      return variables[key] !== undefined ? String(variables[key]) : match;
    });
  }

  /**
   * Translate a key to the current language
   * @param key - Translation key in dot notation (e.g., "nav.home")
   * @param variables - Optional variables for interpolation
   * @param language - Optional language override
   * @returns Translated string or the key if translation not found
   */
  t(key: string, variables?: Record<string, string | number>, language?: Language): string {
    const lang = language || this.currentLanguage;
    const translations = this.translations.get(lang);

    if (!translations) {
      console.warn(`Translations not loaded for language: ${lang}`);
      return key;
    }

    const translated = this.getNestedProperty(translations, key);

    if (translated === undefined) {
      console.warn(`Translation key not found: ${key} for language: ${lang}`);
      // Try fallback language if available
      if (lang !== this.fallbackLanguage) {
        const fallbackTranslations = this.translations.get(this.fallbackLanguage);
        if (fallbackTranslations) {
          const fallbackTranslated = this.getNestedProperty(fallbackTranslations, key);
          if (fallbackTranslated !== undefined) {
            return this.interpolate(fallbackTranslated, variables);
          }
        }
      }
      return key;
    }

    return this.interpolate(translated, variables);
  }

  /**
   * Future: Hook for API-based translation
   * This can be called when a translation key is missing
   * and you want to fetch it from an AI API
   */
  async fetchTranslationFromAPI(key: string, _language: Language, _context?: string): Promise<string> {
    // TODO: Implement API integration for AI-based translations
    // Example:
    // const response = await fetch('/api/translate', {
    //   method: 'POST',
    //   body: JSON.stringify({ key, _language, _context })
    // });
    // return response.json();

    console.log('API translation not yet implemented');
    return key;
  }

  /**
   * Check if translations are loaded for a language
   */
  isLoaded(language: Language): boolean {
    return this.translations.has(language);
  }

  /**
   * Preload translations for multiple languages
   */
  async preloadLanguages(languages: Language[]): Promise<void> {
    await Promise.all(languages.map(lang => this.loadTranslations(lang)));
  }
}

// Create singleton instance
const i18nService = new I18nService();

// Export convenience functions
export const t = (key: string, variables?: Record<string, string | number>, language?: Language): string => {
  return i18nService.t(key, variables, language);
};

export const setLanguage = async (language: Language): Promise<void> => {
  return i18nService.setLanguage(language);
};

export const getCurrentLanguage = (): Language => {
  return i18nService.getCurrentLanguage();
};

export const subscribeToLanguageChange = (callback: (language: Language) => void): (() => void) => {
  return i18nService.subscribe(callback);
};

export const loadTranslations = async (language: Language): Promise<TranslationKeys> => {
  return i18nService.loadTranslations(language);
};

export const isLanguageLoaded = (language: Language): boolean => {
  return i18nService.isLoaded(language);
};

export const preloadLanguages = async (languages: Language[]): Promise<void> => {
  return i18nService.preloadLanguages(languages);
};

export const getLanguageFromURL = (): Language | null => {
  return i18nService.getLanguageFromURL();
};

export const getPathWithoutLanguage = (pathname?: string): string => {
  return i18nService.getPathWithoutLanguage(pathname);
};

export const buildURLWithLanguage = (path: string, language?: Language): string => {
  return i18nService.buildURLWithLanguage(path, language);
};

// Export the service instance as well for advanced usage
export default i18nService;
