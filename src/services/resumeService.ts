import { marked } from 'marked';
import matter from 'gray-matter';
import { ResumeConfig, ResumeCacheEntry, ResumeMetadata, ResumeRole, ResumeLanguage } from '../interfaces/resume';
import resumeConfig from '../data/resumes/config.json';

export class ResumeService {
  private static _instance: ResumeService;
  private config: ResumeConfig;
  private readonly CACHE_PREFIX = 'resume_cache_';

  private constructor() {
    this.config = resumeConfig as ResumeConfig;
    this.configureMarked();
  }

  public static instance(): ResumeService {
    if (!ResumeService._instance) {
      ResumeService._instance = new ResumeService();
    }
    return ResumeService._instance;
  }

  private configureMarked(): void {
    marked.setOptions({
      gfm: true,
      breaks: true,
    });
  }

  /**
   * Get all available roles
   */
  public getRoles(): ResumeRole[] {
    return this.config.roles;
  }

  /**
   * Get all available languages
   */
  public getLanguages(): ResumeLanguage[] {
    return this.config.languages;
  }

  /**
   * Get resume by role and language
   */
  public async getResume(roleId: string, languageCode: string): Promise<ResumeCacheEntry> {
    const cacheKey = this.getCacheKey(roleId, languageCode);

    // Check cache first
    const cached = this.getFromCache(cacheKey);
    if (cached && this.isCacheValid(cached)) {
      console.log(`Resume loaded from cache: ${roleId}/${languageCode}`);
      return cached;
    }

    // Fetch and parse resume
    const markdown = await this.fetchResumeMarkdown(roleId, languageCode);
    const { content, data } = matter(markdown);
    const html = await marked(content);

    const metadata: ResumeMetadata = {
      role: data.role || roleId,
      language: data.language || languageCode,
      lastUpdated: data.lastUpdated || new Date().toISOString(),
      version: data.version || '1.0',
    };

    const cacheEntry: ResumeCacheEntry = {
      html,
      markdown: content,
      metadata,
      cachedAt: Date.now(),
    };

    // Save to cache
    this.saveToCache(cacheKey, cacheEntry);

    return cacheEntry;
  }

  /**
   * Fetch resume markdown from file
   */
  private async fetchResumeMarkdown(roleId: string, languageCode: string): Promise<string> {
    try {
      const path = `/assets/resumes/${roleId}/${languageCode}.md`;
      const response = await fetch(path);

      if (!response.ok) {
        throw new Error(`Failed to fetch resume: ${response.statusText}`);
      }

      return await response.text();
    } catch (error) {
      console.error(`Error fetching resume for ${roleId}/${languageCode}:`, error);
      throw new Error(`Resume not found for role: ${roleId}, language: ${languageCode}`);
    }
  }

  /**
   * Get cache key for role and language
   */
  private getCacheKey(roleId: string, languageCode: string): string {
    return `${this.CACHE_PREFIX}${roleId}_${languageCode}`;
  }

  /**
   * Get resume from localStorage cache
   */
  private getFromCache(cacheKey: string): ResumeCacheEntry | null {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (!cached) {
        return null;
      }
      return JSON.parse(cached) as ResumeCacheEntry;
    } catch (error) {
      console.error('Error reading from cache:', error);
      return null;
    }
  }

  /**
   * Save resume to localStorage cache
   */
  private saveToCache(cacheKey: string, entry: ResumeCacheEntry): void {
    try {
      localStorage.setItem(cacheKey, JSON.stringify(entry));
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  }

  /**
   * Check if cache entry is still valid based on TTL
   */
  private isCacheValid(entry: ResumeCacheEntry): boolean {
    const now = Date.now();
    const age = now - entry.cachedAt;
    return age < this.config.cacheTTL;
  }

  /**
   * Clear cache for specific role/language or all
   */
  public clearCache(roleId?: string, languageCode?: string): void {
    if (roleId && languageCode) {
      const cacheKey = this.getCacheKey(roleId, languageCode);
      localStorage.removeItem(cacheKey);
      console.log(`Cache cleared for ${roleId}/${languageCode}`);
    } else {
      // Clear all resume caches
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.CACHE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
      console.log('All resume caches cleared');
    }
  }

  /**
   * Get default role ID
   */
  public getDefaultRole(): string {
    return this.config.defaultRole;
  }

  /**
   * Get default language code
   */
  public getDefaultLanguage(): string {
    return this.config.defaultLanguage;
  }

  /**
   * Future: Generate AI-customized resume
   * This is a placeholder for future AI integration
   */
  public async generateCustomResume(
    roleId: string,
    languageCode: string,
    jobDescription?: string,
    force?: boolean,
  ): Promise<ResumeCacheEntry> {
    // TODO: Implement AI generation logic
    // For now, just return the regular resume
    console.warn('AI resume generation not yet implemented, returning standard resume');
    return this.getResume(roleId, languageCode);
  }
}
