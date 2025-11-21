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
    welcome: string;
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
    greeting: string;
    intro1: string;
    intro2: string;
    coding1: string;
    coding2: string;
    current: string;
    cta: string;
    thanks: string;
    treat: string;
    button: string;
    links: {
      moreAbout: string;
      myProjects: string;
      contactMe: string;
      checkBlog: string;
    };
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
  loading: {
    greeting: string;
    roles: {
      seniorDev: string;
      fullstack: string;
      gamer: string;
      haitian: string;
      wirelessTech: string;
      designer: string;
      freelancer: string;
    };
    welcomeMessage: string;
    soundOn: string;
  };
  character: {
    question1: string;
    question2: string;
    fruitWord: string;
    buildCharacter: string;
    nameLabel: string;
    namePlaceholder: string;
    typeLabel: string;
    selectFruit: string;
    flavorLabel: string;
    selectFlavor: string;
    randomizeButton: string;
    pluckButton: string;
  };
  resume: {
    downloadCV: string;
    targetLabel: string;
    languageLabel: string;
    roles: {
      frontend: string;
      fullStack: string;
      wireless: string;
    };
    downloadButton: string;
    generatingButton: string;
    copyLinkButton: string;
    errorMessage: string;
    versionLabel: string;
  };
  projectsPage: {
    title: string;
    subtitle: string;
    keyHighlights: string;
    technologies: string;
    viewProject: string;
    cta: {
      title: string;
      subtitle: string;
      button: string;
    };
  };
  blogPage: {
    readArticle: string;
    minRead: string;
    by: string;
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
