export type Language = 'en' | 'ht' | 'es' | 'fr';

export interface TranslationKeys {
  common: {
    loading: string;
    error: string;
    success: string;
    close: string;
    open: string;
    save: string;
    cancel: string;
  };
  nav: {
    home: string;
    console: string;
    about: string;
    contact: string;
    blog: string;
    projects: string;
  };
  welcome: {
    title: string;
    subtitle: string;
    description: string;
  };
  about: {
    title: string;
    description: string;
  };
  contact: {
    title: string;
    description: string;
  };
  blog: {
    title: string;
    description: string;
    readMore: string;
    postedOn: string;
  };
  projects: {
    title: string;
    description: string;
    viewProject: string;
    sourceCode: string;
  };
  console: {
    title: string;
    description: string;
    clear: string;
    level: {
      info: string;
      warning: string;
      error: string;
      default: string;
    };
  };
  errors: {
    '404': string;
    '404Description': string;
    goHome: string;
  };
  language: {
    select: string;
    en: string;
    ht: string;
    es: string;
    fr: string;
  };
}

export interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
}

export const AVAILABLE_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ht', name: 'Haitian Creole', nativeName: 'Kreyòl Ayisyen' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
];

export const DEFAULT_LANGUAGE: Language = 'en';
