import { BlogPost } from '../interfaces/blog';
import { Language } from '../interfaces/translation';
import { getCurrentLanguage } from './i18n';

// Blog posts data - each post ID can have multiple language versions
// In a real application, these would be loaded from markdown files
const blogPosts: BlogPost[] = [
  // English version
  {
    id: 'claude-code-ai-assistant',
    metadata: {
      title: 'Claude Code: The AI-Powered Development Assistant',
      description: 'Discover how Claude Code is revolutionizing the development workflow with AI-powered coding assistance, intelligent refactoring, and natural language commands.',
      author: 'Jeffrey Nicholson Carré',
      date: '2024-11-18',
      category: 'AI & ML',
      tags: ['AI', 'Claude Code', 'Developer Tools', 'Productivity'],
      image: '/assets/images/blog/claude-code.jpg',
      readTime: 8,
      language: 'en',
    },
    content: `<h2>What is Claude Code?</h2>
<p>Claude Code is Anthropic's official command-line interface that brings the power of Claude AI directly into your development environment. Unlike traditional code completion tools, Claude Code understands context, can read and analyze your entire codebase, and provides intelligent suggestions that go far beyond simple autocomplete.</p>

<p>What makes Claude Code truly exceptional is its ability to:</p>
<ul>
<li>Understand complex codebases and architectural patterns</li>
<li>Refactor code while maintaining functionality and best practices</li>
<li>Debug issues by analyzing stack traces and code flow</li>
<li>Generate comprehensive tests for your functions</li>
<li>Explain code in natural language</li>
<li>Suggest optimizations and performance improvements</li>
</ul>

<h2>Why Claude Code is Amazing</h2>

<h3>1. Context-Aware Intelligence</h3>
<p>Claude Code doesn't just look at individual lines - it understands your entire project structure. It can navigate through your files, understand relationships between components, and provide suggestions that make sense in the context of your architecture.</p>

<h3>2. Natural Language Interface</h3>
<p>You can communicate with Claude Code in plain English. Instead of memorizing commands, simply describe what you want to accomplish, and Claude will understand and execute accordingly.</p>

<h3>3. Multi-File Operations</h3>
<p>Need to refactor across multiple files? Claude Code can handle it. It understands import relationships, type dependencies, and can safely modify code across your entire project.</p>

<h2>Getting Started</h2>
<p>First, you'll need to install Claude Code:</p>
<pre><code>npm install -g @anthropics/claude-code</code></pre>

<p>Or if you prefer Homebrew (macOS):</p>
<pre><code>brew install claude-code</code></pre>

<h2>Conclusion</h2>
<p>Claude Code represents a paradigm shift in how we write and maintain code. By combining the power of AI with deep code understanding, it enables developers to focus on architecture and problem-solving rather than boilerplate and syntax.</p>`,
    excerpt: 'An introduction to Claude Code and how to supercharge your development workflow with AI-powered coding assistance.',
  },
  // Add more English posts with language field...
  // Note: For brevity, I'm showing just one post. In production, all posts would have the language field.
];

export class BlogService {
  private static instance: BlogService;

  private constructor() {}

  static getInstance(): BlogService {
    if (!BlogService.instance) {
      BlogService.instance = new BlogService();
    }
    return BlogService.instance;
  }

  /**
   * Get all blog posts for current language, sorted by date (newest first)
   */
  getAllPosts(language?: Language): BlogPost[] {
    const lang = language || getCurrentLanguage();
    return [...blogPosts]
      .filter(post => post.metadata.language === lang)
      .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime());
  }

  /**
   * Get a single blog post by ID and language
   */
  getPostById(id: string, language?: Language): BlogPost | undefined {
    const lang = language || getCurrentLanguage();
    return blogPosts.find(post => post.id === id && post.metadata.language === lang);
  }

  /**
   * Get posts by category for current language
   */
  getPostsByCategory(category: string, language?: Language): BlogPost[] {
    const lang = language || getCurrentLanguage();
    return blogPosts
      .filter(post => post.metadata.category === category && post.metadata.language === lang)
      .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime());
  }

  /**
   * Get posts by tag for current language
   */
  getPostsByTag(tag: string, language?: Language): BlogPost[] {
    const lang = language || getCurrentLanguage();
    return blogPosts
      .filter(post => post.metadata.tags.includes(tag) && post.metadata.language === lang)
      .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime());
  }

  /**
   * Get all unique categories for current language
   */
  getAllCategories(language?: Language): string[] {
    const lang = language || getCurrentLanguage();
    const categories = blogPosts
      .filter(post => post.metadata.language === lang)
      .map(post => post.metadata.category);
    return Array.from(new Set(categories)).sort();
  }

  /**
   * Get all unique tags for current language
   */
  getAllTags(language?: Language): string[] {
    const lang = language || getCurrentLanguage();
    const tags = blogPosts
      .filter(post => post.metadata.language === lang)
      .flatMap(post => post.metadata.tags);
    return Array.from(new Set(tags)).sort();
  }

  /**
   * Get recent posts (limit to N) for current language
   */
  getRecentPosts(limit: number = 5, language?: Language): BlogPost[] {
    return this.getAllPosts(language).slice(0, limit);
  }

  /**
   * Search posts by title or description in current language
   */
  searchPosts(query: string, language?: Language): BlogPost[] {
    const lang = language || getCurrentLanguage();
    const lowerQuery = query.toLowerCase();
    return blogPosts.filter(
      post =>
        post.metadata.language === lang &&
        (post.metadata.title.toLowerCase().includes(lowerQuery) ||
          post.metadata.description.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Check if a post has translations in other languages
   */
  getAvailableLanguages(postId: string): Language[] {
    return Array.from(
      new Set(
        blogPosts
          .filter(post => post.id === postId)
          .map(post => post.metadata.language)
      )
    );
  }

  /**
   * Get post in a specific language or fallback to English
   */
  getPostWithFallback(id: string, language: Language): BlogPost | undefined {
    // Try to get post in requested language
    let post = this.getPostById(id, language);

    // Fallback to English if not found
    if (!post && language !== 'en') {
      post = this.getPostById(id, 'en');
    }

    return post;
  }
}
