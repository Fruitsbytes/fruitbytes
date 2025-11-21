/**
 * SEO Service for FruitsBytes
 * Manages dynamic meta tags, Open Graph, Twitter Cards, and JSON-LD structured data
 */

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  author?: string;
  type?: 'website' | 'article' | 'profile';
  image?: string;
  url?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

export class SEOService {
  private static instance: SEOService;
  private readonly baseUrl = 'https://fruitsbytes.com';
  private readonly defaultImage = '/assets/icon/icon-512x512.png';
  private readonly siteName = 'FruitsBytes';
  private readonly author = 'Jeffrey Nicholson Carré';
  private readonly twitterHandle = '@fruitsbytes';

  private constructor() {}

  static getInstance(): SEOService {
    if (!SEOService.instance) {
      SEOService.instance = new SEOService();
    }
    return SEOService.instance;
  }

  /**
   * Update all meta tags for the current page
   */
  updateMetaTags(metadata: SEOMetadata): void {
    // Title
    document.title = `${metadata.title} | ${this.siteName}`;

    // Basic meta tags
    this.setMetaTag('description', metadata.description);
    if (metadata.keywords) {
      this.setMetaTag('keywords', metadata.keywords.join(', '));
    }
    this.setMetaTag('author', metadata.author || this.author);

    // Open Graph
    this.setMetaTag('og:title', metadata.title, 'property');
    this.setMetaTag('og:description', metadata.description, 'property');
    this.setMetaTag('og:type', metadata.type || 'website', 'property');
    this.setMetaTag('og:url', metadata.url || window.location.href, 'property');
    this.setMetaTag('og:image', this.getFullUrl(metadata.image || this.defaultImage), 'property');
    this.setMetaTag('og:site_name', this.siteName, 'property');

    if (metadata.publishedTime) {
      this.setMetaTag('article:published_time', metadata.publishedTime, 'property');
    }
    if (metadata.modifiedTime) {
      this.setMetaTag('article:modified_time', metadata.modifiedTime, 'property');
    }
    if (metadata.section) {
      this.setMetaTag('article:section', metadata.section, 'property');
    }
    if (metadata.tags) {
      metadata.tags.forEach(tag => {
        this.setMetaTag('article:tag', tag, 'property');
      });
    }

    // Twitter Cards
    this.setMetaTag('twitter:card', 'summary_large_image', 'name');
    this.setMetaTag('twitter:site', this.twitterHandle, 'name');
    this.setMetaTag('twitter:creator', this.twitterHandle, 'name');
    this.setMetaTag('twitter:title', metadata.title, 'name');
    this.setMetaTag('twitter:description', metadata.description, 'name');
    this.setMetaTag('twitter:image', this.getFullUrl(metadata.image || this.defaultImage), 'name');

    // Canonical URL
    this.setLinkTag('canonical', metadata.url || window.location.href);
  }

  /**
   * Add JSON-LD structured data to the page
   */
  addStructuredData(data: any): void {
    // Remove existing structured data
    const existing = document.querySelector('script[type="application/ld+json"]');
    if (existing) {
      existing.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
  }

  /**
   * Generate Person schema for About page
   */
  getPersonSchema(): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Jeffrey Nicholson Carré',
      jobTitle: 'Senior Software Developer',
      description: 'Full-stack developer specializing in frontend development, 3D graphics, and video game creation',
      url: `${this.baseUrl}/about-me`,
      image: `${this.baseUrl}/assets/icon/icon-512x512.png`,
      email: 'jeffrey.carre@anbapyezanman.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Montréal',
        addressRegion: 'QC',
        addressCountry: 'CA'
      },
      alumniOf: [
        {
          '@type': 'EducationalOrganization',
          name: 'Faculté des Sciences de l\'Université d\'État d\'Haïti',
          location: 'Port-au-Prince, Haiti'
        }
      ],
      knowsAbout: [
        'Angular', 'React', 'TypeScript', 'JavaScript',
        'Three.js', 'WebGL', 'StencilJS', 'PHP', 'Laravel',
        'Node.js', 'Mobile Development', 'Wireless Networks'
      ],
      sameAs: [
        'https://github.com/fruitsbytes',
        'https://linkedin.com/in/jeffrey-carre',
        'https://twitter.com/fruitsbytes'
      ]
    };
  }

  /**
   * Generate Article schema for blog posts
   */
  getBlogPostSchema(metadata: SEOMetadata): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: metadata.title,
      description: metadata.description,
      image: this.getFullUrl(metadata.image || this.defaultImage),
      datePublished: metadata.publishedTime,
      dateModified: metadata.modifiedTime || metadata.publishedTime,
      author: {
        '@type': 'Person',
        name: metadata.author || this.author,
        url: `${this.baseUrl}/about-me`
      },
      publisher: {
        '@type': 'Organization',
        name: this.siteName,
        logo: {
          '@type': 'ImageObject',
          url: `${this.baseUrl}${this.defaultImage}`
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': metadata.url || window.location.href
      },
      keywords: metadata.tags?.join(', ') || '',
      articleSection: metadata.section || 'Technology'
    };
  }

  /**
   * Generate WebSite schema
   */
  getWebSiteSchema(): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: this.siteName,
      description: 'Developer portfolio showcasing web development, 3D graphics, and software engineering projects',
      url: this.baseUrl,
      author: {
        '@type': 'Person',
        name: this.author
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${this.baseUrl}/my-blog?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    };
  }

  /**
   * Set or update a meta tag
   */
  private setMetaTag(name: string, content: string, attributeName: 'name' | 'property' = 'name'): void {
    let element = document.querySelector(`meta[${attributeName}="${name}"]`);

    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attributeName, name);
      document.head.appendChild(element);
    }

    element.setAttribute('content', content);
  }

  /**
   * Set or update a link tag
   */
  private setLinkTag(rel: string, href: string): void {
    let element = document.querySelector(`link[rel="${rel}"]`);

    if (!element) {
      element = document.createElement('link');
      element.setAttribute('rel', rel);
      document.head.appendChild(element);
    }

    element.setAttribute('href', href);
  }

  /**
   * Get full URL from relative path
   */
  private getFullUrl(path: string): string {
    if (path.startsWith('http')) {
      return path;
    }
    return `${this.baseUrl}${path}`;
  }

  /**
   * Add RSS feed link
   */
  addRSSFeed(): void {
    this.setLinkTag('alternate', `${this.baseUrl}/rss.xml`);
    const link = document.querySelector('link[rel="alternate"]') as HTMLLinkElement;
    if (link) {
      link.setAttribute('type', 'application/rss+xml');
      link.setAttribute('title', `${this.siteName} RSS Feed`);
    }
  }
}

export const seoService = SEOService.getInstance();
