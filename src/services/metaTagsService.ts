import { Language, AVAILABLE_LANGUAGES } from '../interfaces/translation';
import { buildURLWithLanguage } from './i18n';

export interface MetaTagsOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  locale?: Language;
  url?: string;
  siteName?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

class MetaTagsService {
  private defaultSiteName = 'FruitsBytes';
  private defaultImage = '/assets/icon/icon.png';
  private baseURL = typeof window !== 'undefined' ? window.location.origin : '';

  /**
   * Set the HTML lang attribute
   */
  setHtmlLang(language: Language): void {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }

  /**
   * Update or create a meta tag
   */
  private updateMetaTag(selector: string, content: string, attribute: 'name' | 'property' = 'name'): void {
    if (typeof document === 'undefined') return;

    let meta = document.querySelector(selector) as HTMLMetaElement;

    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attribute, selector.replace(/\[.*?=["']|["']\]/g, ''));
      document.head.appendChild(meta);
    }

    meta.content = content;
  }

  /**
   * Update or create a link tag
   */
  private updateLinkTag(rel: string, href: string, hreflang?: string): void {
    if (typeof document === 'undefined') return;

    const selector = hreflang
      ? `link[rel="${rel}"][hreflang="${hreflang}"]`
      : `link[rel="${rel}"]`;

    let link = document.querySelector(selector) as HTMLLinkElement;

    if (!link) {
      link = document.createElement('link');
      link.rel = rel;
      if (hreflang) link.hreflang = hreflang;
      document.head.appendChild(link);
    }

    link.href = href;
  }

  /**
   * Remove all existing alternate language links
   */
  private clearAlternateLinks(): void {
    if (typeof document === 'undefined') return;

    const alternates = document.querySelectorAll('link[rel="alternate"]');
    alternates.forEach(link => link.remove());
  }

  /**
   * Get locale string for Open Graph (e.g., 'en_US', 'es_ES')
   */
  private getOGLocale(language: Language): string {
    const localeMap: Record<Language, string> = {
      en: 'en_US',
      ht: 'ht_HT',
      es: 'es_ES',
      fr: 'fr_FR',
    };
    return localeMap[language] || 'en_US';
  }

  /**
   * Set all meta tags for a page
   */
  setMetaTags(options: MetaTagsOptions): void {
    const {
      title = this.defaultSiteName,
      description = 'Developer Portfolio & Blog',
      keywords = [],
      author = 'Jeffrey Nicholson Carré',
      image = this.defaultImage,
      type = 'website',
      locale = 'en',
      url = window.location.href,
      siteName = this.defaultSiteName,
      publishedTime,
      modifiedTime,
      section,
      tags = [],
    } = options;

    // Set HTML lang attribute
    this.setHtmlLang(locale);

    // Standard meta tags
    document.title = title;
    this.updateMetaTag('[name="description"]', description);
    if (keywords.length > 0) {
      this.updateMetaTag('[name="keywords"]', keywords.join(', '));
    }
    this.updateMetaTag('[name="author"]', author);
    this.updateMetaTag('[name="language"]', locale);

    // Open Graph meta tags
    this.updateMetaTag('[property="og:title"]', title, 'property');
    this.updateMetaTag('[property="og:description"]', description, 'property');
    this.updateMetaTag('[property="og:type"]', type, 'property');
    this.updateMetaTag('[property="og:url"]', url, 'property');
    this.updateMetaTag('[property="og:site_name"]', siteName, 'property');
    this.updateMetaTag('[property="og:locale"]', this.getOGLocale(locale), 'property');

    // Image
    const fullImageUrl = image.startsWith('http') ? image : `${this.baseURL}${image}`;
    this.updateMetaTag('[property="og:image"]', fullImageUrl, 'property');
    this.updateMetaTag('[property="og:image:secure_url"]', fullImageUrl, 'property');
    this.updateMetaTag('[property="og:image:type"]', 'image/jpeg', 'property');
    this.updateMetaTag('[property="og:image:width"]', '1200', 'property');
    this.updateMetaTag('[property="og:image:height"]', '630', 'property');
    this.updateMetaTag('[property="og:image:alt"]', title, 'property');

    // Twitter Card meta tags
    this.updateMetaTag('[name="twitter:card"]', 'summary_large_image');
    this.updateMetaTag('[name="twitter:title"]', title);
    this.updateMetaTag('[name="twitter:description"]', description);
    this.updateMetaTag('[name="twitter:image"]', fullImageUrl);
    this.updateMetaTag('[name="twitter:image:alt"]', title);

    // Article-specific tags
    if (type === 'article') {
      if (publishedTime) {
        this.updateMetaTag('[property="article:published_time"]', publishedTime, 'property');
      }
      if (modifiedTime) {
        this.updateMetaTag('[property="article:modified_time"]', modifiedTime, 'property');
      }
      if (section) {
        this.updateMetaTag('[property="article:section"]', section, 'property');
      }
      if (tags.length > 0) {
        tags.forEach((tag) => {
          this.updateMetaTag(`[property="article:tag"][content="${tag}"]`, tag, 'property');
        });
      }
      this.updateMetaTag('[property="article:author"]', author, 'property');
    }

    // Set canonical URL
    this.updateLinkTag('canonical', url);

    // Set alternate language links
    this.setAlternateLanguageLinks(url);

    // Set alternate locales for Open Graph
    this.setOGAlternateLocales(locale);
  }

  /**
   * Set hreflang links for all available languages
   */
  private setAlternateLanguageLinks(currentUrl: string): void {
    // Clear existing alternate links
    this.clearAlternateLinks();

    // Extract the path without language
    const urlObj = new URL(currentUrl, this.baseURL);
    const pathname = urlObj.pathname;
    const segments = pathname.split('/').filter(s => s.length > 0);

    // Determine the page path (remove language prefix if present)
    let pagePath = '/';
    if (segments.length > 0) {
      const potentialLang = segments[0];
      const supportedLangs = AVAILABLE_LANGUAGES.map(l => l.code);
      if (supportedLangs.includes(potentialLang as Language)) {
        pagePath = '/' + segments.slice(1).join('/');
      } else {
        pagePath = pathname;
      }
    }

    // Add x-default for default language
    const defaultUrl = `${this.baseURL}${buildURLWithLanguage(pagePath, 'en')}`;
    this.updateLinkTag('alternate', defaultUrl, 'x-default');

    // Add alternate links for each language
    AVAILABLE_LANGUAGES.forEach(lang => {
      const langUrl = `${this.baseURL}${buildURLWithLanguage(pagePath, lang.code)}`;
      this.updateLinkTag('alternate', langUrl, lang.code);
    });
  }

  /**
   * Set OG alternate locales
   */
  private setOGAlternateLocales(currentLocale: Language): void {
    AVAILABLE_LANGUAGES.forEach(lang => {
      if (lang.code !== currentLocale) {
        this.updateMetaTag(
          `[property="og:locale:alternate"][content="${this.getOGLocale(lang.code)}"]`,
          this.getOGLocale(lang.code),
          'property'
        );
      }
    });
  }

  /**
   * Update meta tags when language changes
   */
  updateLanguage(language: Language): void {
    this.setHtmlLang(language);

    // Update og:locale
    this.updateMetaTag('[property="og:locale"]', this.getOGLocale(language), 'property');

    // Update alternate language links
    const currentUrl = window.location.href;
    this.setAlternateLanguageLinks(currentUrl);
    this.setOGAlternateLocales(language);
  }

  /**
   * Clear specific meta tag
   */
  clearMetaTag(selector: string): void {
    if (typeof document === 'undefined') return;

    const meta = document.querySelector(selector);
    if (meta) {
      meta.remove();
    }
  }
}

// Create singleton instance
const metaTagsService = new MetaTagsService();

export default metaTagsService;
