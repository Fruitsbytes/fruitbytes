import { BlogPost, BlogMetadata } from '../interfaces/blog';

// This would normally fetch from your markdown files
// For now, we'll create the blog data directly from our markdown content
const blogPosts: BlogPost[] = [
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
  {
    id: 'angular-19-signals-revolution',
    metadata: {
      title: 'Angular 19: The Signals Revolution',
      description: 'Explore Angular 19\'s revolutionary Signals API and how it transforms reactive programming with better performance and developer experience.',
      author: 'Jeffrey Nicholson Carré',
      date: '2024-11-16',
      category: 'Frontend',
      tags: ['Angular', 'Signals', 'TypeScript', 'Web Development'],
      image: '/assets/images/blog/angular-signals.jpg',
      readTime: 6,
    },
    content: `<h2>The Power of Signals</h2>
<p>Angular's new Signals API represents a fundamental shift in how we think about state management and reactivity in Angular applications. Unlike the traditional Zone.js-based change detection, Signals provide fine-grained reactivity that only updates what actually changed.</p>

<h3>What Are Signals?</h3>
<p>Signals are reactive primitives that hold values and notify consumers when those values change. They're similar to reactive values in other frameworks like SolidJS or Vue 3's Composition API, but deeply integrated into Angular's architecture.</p>

<pre><code>import { signal, computed, effect } from '@angular/core';

// Create a signal
const count = signal(0);

// Create a computed signal
const doubleCount = computed(() => count() * 2);

// Create an effect that runs when signals change
effect(() => {
  console.log(\`Count is \${count()}, double is \${doubleCount()}\`);
});

// Update the signal
count.set(5); // Effect runs automatically</code></pre>

<h2>Key Benefits</h2>

<h3>1. Performance</h3>
<p>Signals enable zone-less Angular applications. By precisely tracking dependencies, Angular knows exactly what to update when state changes, eliminating unnecessary change detection cycles.</p>

<h3>2. Simplicity</h3>
<p>No more ChangeDetectorRef.markForCheck() or wrestling with Zone.js. Signals make reactivity explicit and predictable.</p>

<h3>3. TypeScript Integration</h3>
<p>Full type safety out of the box. TypeScript knows the type of your signal values and will catch errors at compile time.</p>

<h2>The Future is Reactive</h2>
<p>Angular 19's Signals represent the future of Angular development. They provide better performance, clearer code, and a more intuitive mental model for building reactive applications.</p>`,
    excerpt: 'Angular 19 brings a revolutionary change to reactive programming with Signals, offering unprecedented performance and developer experience improvements.',
  },
  {
    id: 'laravel-11-modern-php',
    metadata: {
      title: 'Laravel 11: Embracing Modern PHP Development',
      description: 'Dive into Laravel 11\'s streamlined structure, powerful new features, and how it continues to define modern PHP development.',
      author: 'Jeffrey Nicholson Carré',
      date: '2024-11-15',
      category: 'Backend',
      tags: ['Laravel', 'PHP', 'Backend', 'Web Development'],
      image: '/assets/images/blog/laravel-11.jpg',
      readTime: 7,
    },
    content: `<h2>What's New in Laravel 11?</h2>
<p>Laravel has always been at the forefront of modern PHP development, and version 11 takes it even further with a focus on simplicity and developer experience.</p>

<h3>Streamlined Application Structure</h3>
<p>Laravel 11 introduces a leaner application skeleton. Gone are many of the files and directories that were rarely customized:</p>
<ul>
<li>Simplified service providers (just one AppServiceProvider by default)</li>
<li>Removed unnecessary middleware classes</li>
<li>Cleaner bootstrap directory</li>
<li>Streamlined configuration files</li>
</ul>

<h3>Per-Second Rate Limiting</h3>
<pre><code>Route::middleware(['throttle:perSecond,10'])->group(function () {
    Route::get('/api/data', [DataController::class, 'index']);
});</code></pre>

<h2>Laravel's PHP 8.3 Features</h2>
<p>Laravel 11 requires PHP 8.2+, fully embracing modern PHP features:</p>

<h3>Typed Class Constants</h3>
<pre><code>class PaymentStatus
{
    public const string PENDING = 'pending';
    public const string COMPLETED = 'completed';
    public const string FAILED = 'failed';
}</code></pre>

<h2>Why Laravel Continues to Lead</h2>
<p>Laravel isn't just keeping up with modern PHP - it's defining what modern PHP looks like. The framework's commitment to developer happiness, combined with powerful features and excellent documentation, makes it the go-to choice for PHP developers worldwide.</p>

<h3>Ecosystem Advantages</h3>
<ul>
<li><strong>Laravel Forge</strong>: Automated server management</li>
<li><strong>Laravel Vapor</strong>: Serverless deployment for AWS</li>
<li><strong>Laravel Nova</strong>: Beautiful administration panel</li>
<li><strong>Livewire & Inertia</strong>: Modern frontend integration</li>
<li><strong>Octane</strong>: Supercharged application performance</li>
</ul>`,
    excerpt: 'Laravel 11 continues to push the boundaries of what\'s possible with PHP, introducing streamlined application structure and powerful new features.',
  },
  {
    id: 'threejs-webgl-performance',
    metadata: {
      title: 'Optimizing Three.js Performance for Production',
      description: 'Master essential techniques to optimize Three.js applications for smooth 60fps performance across all devices.',
      author: 'Jeffrey Nicholson Carré',
      date: '2024-11-12',
      category: 'Web Development',
      tags: ['Three.js', 'WebGL', 'Performance', '3D Graphics'],
      image: '/assets/images/blog/threejs-performance.jpg',
      readTime: 5,
    },
    content: `<h2>The Performance Challenge</h2>
<p>Three.js makes 3D graphics accessible, but achieving smooth performance requires understanding how to optimize your scene, geometry, materials, and render loop.</p>

<h2>Key Optimization Strategies</h2>

<h3>1. Geometry Optimization</h3>
<p>Reduce polygon count where possible:</p>
<pre><code>// Instead of high-poly sphere
const geometry = new THREE.SphereGeometry(1, 64, 64);

// Use appropriate detail level
const geometry = new THREE.SphereGeometry(1, 32, 32);</code></pre>

<h3>2. Texture Compression</h3>
<p>Use compressed texture formats and appropriate sizes:</p>
<pre><code>const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('/texture.jpg');

// Set appropriate filtering
texture.minFilter = THREE.LinearMipMapLinearFilter;
texture.magFilter = THREE.LinearFilter;

// Generate mipmaps
texture.generateMipmaps = true;</code></pre>

<h3>3. Instancing for Repeated Objects</h3>
<p>Use InstancedMesh for rendering multiple copies:</p>
<pre><code>const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const mesh = new THREE.InstancedMesh(geometry, material, 1000);

// Set individual instances
const dummy = new THREE.Object3D();
for (let i = 0; i < 1000; i++) {
  dummy.position.set(
    Math.random() * 100 - 50,
    Math.random() * 100 - 50,
    Math.random() * 100 - 50
  );
  dummy.updateMatrix();
  mesh.setMatrixAt(i, dummy.matrix);
}</code></pre>

<h2>Conclusion</h2>
<p>Optimizing Three.js applications is about finding the right balance between visual quality and performance. Start with these fundamentals, measure everything, and optimize based on real-world data.</p>`,
    excerpt: 'Learn essential techniques to optimize your Three.js applications for smooth 60fps performance on all devices.',
  },
  {
    id: 'stenciljs-web-components',
    metadata: {
      title: 'Building Scalable Web Components with StencilJS',
      description: 'Learn why StencilJS is the perfect tool for creating reusable, framework-agnostic web components that work everywhere.',
      author: 'Jeffrey Nicholson Carré',
      date: '2024-11-10',
      category: 'Web Development',
      tags: ['StencilJS', 'Web Components', 'TypeScript', 'Frontend'],
      image: '/assets/images/blog/stenciljs.jpg',
      readTime: 6,
    },
    content: `<h2>Why StencilJS?</h2>
<p>StencilJS combines the best ideas from popular frameworks into a simple compiler that generates standard Web Components. The result? Components that work in any framework - or no framework at all.</p>

<h3>The StencilJS Advantage</h3>
<ol>
<li><strong>Framework Agnostic</strong>: Your components work in React, Vue, Angular, or vanilla JS</li>
<li><strong>TypeScript First</strong>: Full TypeScript support out of the box</li>
<li><strong>Tiny Runtime</strong>: Components compile to native Web Components with minimal overhead</li>
<li><strong>Developer Experience</strong>: JSX, decorators, and modern tooling</li>
</ol>

<h2>Creating Your First Component</h2>
<pre><code>import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'my-button',
  styleUrl: 'my-button.scss',
  shadow: true,
})
export class MyButton {
  @Prop() label: string;
  @Prop() variant: 'primary' | 'secondary' = 'primary';

  render() {
    return (
      &lt;button class={\`btn btn-\${this.variant}\`}&gt;
        {this.label}
      &lt;/button&gt;
    );
  }
}</code></pre>

<p>Use it anywhere:</p>
<pre><code>&lt;!-- In any HTML --&gt;
&lt;my-button label="Click Me" variant="primary"&gt;&lt;/my-button&gt;

&lt;!-- In React --&gt;
&lt;MyButton label="Click Me" variant="primary" /&gt;

&lt;!-- In Vue --&gt;
&lt;my-button label="Click Me" variant="primary"&gt;&lt;/my-button&gt;</code></pre>

<h2>Performance Benefits</h2>
<p>StencilJS components are:</p>
<ul>
<li><strong>Lazy Loaded</strong>: Only load what you need</li>
<li><strong>Efficiently Updated</strong>: Virtual DOM with optimized diffing</li>
<li><strong>Small Bundle</strong>: Native Web Components with minimal runtime</li>
</ul>

<h2>Conclusion</h2>
<p>StencilJS represents the future of component development: write once, use anywhere. Whether you're building a design system, reusable widgets, or a full application, StencilJS provides the perfect balance of power and simplicity.</p>`,
    excerpt: 'Discover why StencilJS is the perfect tool for creating reusable, framework-agnostic web components that work everywhere.',
  },
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
   * Get all blog posts sorted by date (newest first)
   */
  getAllPosts(): BlogPost[] {
    return [...blogPosts].sort(
      (a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
    );
  }

  /**
   * Get a single blog post by ID
   */
  getPostById(id: string): BlogPost | undefined {
    return blogPosts.find(post => post.id === id);
  }

  /**
   * Get posts by category
   */
  getPostsByCategory(category: string): BlogPost[] {
    return blogPosts.filter(post => post.metadata.category === category)
      .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime());
  }

  /**
   * Get posts by tag
   */
  getPostsByTag(tag: string): BlogPost[] {
    return blogPosts.filter(post => post.metadata.tags.includes(tag))
      .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime());
  }

  /**
   * Get all unique categories
   */
  getAllCategories(): string[] {
    const categories = blogPosts.map(post => post.metadata.category);
    return Array.from(new Set(categories)).sort();
  }

  /**
   * Get all unique tags
   */
  getAllTags(): string[] {
    const tags = blogPosts.flatMap(post => post.metadata.tags);
    return Array.from(new Set(tags)).sort();
  }

  /**
   * Get recent posts (limit to N)
   */
  getRecentPosts(limit: number = 5): BlogPost[] {
    return this.getAllPosts().slice(0, limit);
  }

  /**
   * Search posts by title or description
   */
  searchPosts(query: string): BlogPost[] {
    const lowerQuery = query.toLowerCase();
    return blogPosts.filter(post =>
      post.metadata.title.toLowerCase().includes(lowerQuery) ||
      post.metadata.description.toLowerCase().includes(lowerQuery)
    );
  }
}
