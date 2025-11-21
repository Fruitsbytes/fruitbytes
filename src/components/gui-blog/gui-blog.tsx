import { Component, Host, h, Prop, State, Watch, Listen } from '@stencil/core';
import { BlogPost } from '../../interfaces/blog';
import { BlogService } from '../../services/blogService';
import { t, getCurrentLanguage } from '../../services/i18n';
import { Language } from '../../interfaces/translation';

@Component({
  tag: 'gui-blog',
  styleUrl: 'gui-blog.scss',
  shadow: true,
})
export class GuiBlog {
  @Prop() hash!: string;
  @Prop() menuOpened: boolean = true;
  @Prop() menuWidth!: number;

  @State() posts: BlogPost[] = [];
  @State() viewMode: 'list' | 'single' = 'list';
  @State() currentPost: BlogPost | null = null;
  @State() currentLanguage: Language = getCurrentLanguage();

  private blogService = BlogService.getInstance();

  @Listen('language.changed', { target: 'document' })
  handleLanguageChange(event: CustomEvent<Language>) {
    this.currentLanguage = event.detail;
  }

  componentWillLoad() {
    this.posts = this.blogService.getAllPosts();
    this.handleHashChange();
  }

  @Watch('hash')
  handleHashChange() {
    if (this.hash && this.hash !== '') {
      const postId = this.hash.replace('#', '');
      const post = this.blogService.getPostById(postId);
      if (post) {
        this.currentPost = post;
        this.viewMode = 'single';
      } else {
        this.viewMode = 'list';
        this.currentPost = null;
      }
    } else {
      this.viewMode = 'list';
      this.currentPost = null;
    }
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  private renderBlogCard(post: BlogPost) {
    return (
      <article key={post.id} class='blog-card'>
        <div class='blog-card-image'>
          {post.metadata.image && (
            <img
              src={post.metadata.image}
              alt={post.metadata.title}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/images/blog/default.png';
              }}
            />
          )}
          <div class='blog-card-category'>{post.metadata.category}</div>
        </div>

        <div class='blog-card-content'>
          <h2 class='blog-card-title'>{post.metadata.title}</h2>

          <div class='blog-card-meta'>
            <time dateTime={post.metadata.date}>{this.formatDate(post.metadata.date)}</time>
            <span class='separator'>•</span>
            <span>{post.metadata.readTime} {t('blogPage.minRead')}</span>
          </div>

          <p class='blog-card-excerpt'>{post.metadata.description}</p>

          <div class='blog-card-tags'>
            {post.metadata.tags.slice(0, 3).map(tag => (
              <span key={tag} class='tag'>
                #{tag}
              </span>
            ))}
          </div>

          <div class='blog-card-footer'>
            <span class='author'>{t('blogPage.by')} {post.metadata.author}</span>
            <simple-link link={`/my-blog#${post.id}`} label={t('blogPage.readArticle')}>
              <span class='read-more'>
                {t('blogPage.readArticle')}
                <span class='material-symbols-sharp'>arrow_forward</span>
              </span>
            </simple-link>
          </div>
        </div>
      </article>
    );
  }

  private renderSinglePost() {
    if (!this.currentPost) {
      return null;
    }

    const post = this.currentPost;

    return (
      <div class='single-post-container'>
        <div class='single-post-header'>
          <simple-link link='/my-blog' label='Back to Blog'>
            <button class='back-button'>
              <span class='material-symbols-sharp'>arrow_back</span>
              Back to Blog
            </button>
          </simple-link>

          <div class='post-category-badge'>{post.metadata.category}</div>
        </div>

        <article class='single-post'>
          <header class='post-header'>
            <h1 class='post-title'>{post.metadata.title}</h1>

            <div class='post-meta'>
              <span class='post-author'>{t('blogPage.by')} {post.metadata.author}</span>
              <span class='separator'>•</span>
              <time dateTime={post.metadata.date}>{this.formatDate(post.metadata.date)}</time>
              <span class='separator'>•</span>
              <span>{post.metadata.readTime} {t('blogPage.minRead')}</span>
            </div>

            <div class='post-tags'>
              {post.metadata.tags.map(tag => (
                <span key={tag} class='post-tag'>
                  #{tag}
                </span>
              ))}
            </div>
          </header>

          {post.metadata.image && (
            <div class='post-featured-image'>
              <img
                src={post.metadata.image}
                alt={post.metadata.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/images/blog/default.png';
                }}
              />
            </div>
          )}

          <div class='post-content' innerHTML={post.content}></div>
        </article>
      </div>
    );
  }

  render() {
    return (
      <Host
        style={{
          width: `calc(100vw - ${this.menuOpened ? this.menuWidth : 0}px)`,
          transition: 'width ease-out 1s',
        }}
      >
        <div class='blog-container mb-48'>
          {this.viewMode === 'list' ? (
            <div>
              {/* Header */}
              <header class='blog-header'>
                <h1 class='blog-main-title'>
                  <span class='gradient-text'>Blog</span>
                </h1>
                <p class='blog-subtitle'>Thoughts on web development, AI, and modern technology</p>
              </header>

              {/* Blog Grid */}
              <main class='blog-grid'>
                {this.posts.length > 0 ? (
                  this.posts.map(post => this.renderBlogCard(post))
                ) : (
                  <div class='no-posts'>
                    <span class='material-symbols-sharp'>article</span>
                    <p>No blog posts found</p>
                  </div>
                )}
              </main>
            </div>
          ) : (
            this.renderSinglePost()
          )}
        </div>
      </Host>
    );
  }
}
