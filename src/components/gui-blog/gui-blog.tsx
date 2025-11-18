import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'gui-blog',
  styleUrl: 'gui-blog.scss',
  shadow: true,
})
export class GuiBlog {
  @Prop() hash!: string;
  @Prop() menuOpened: boolean = true;
  @Prop() menuWidth!: number;

  render() {
    return (
      <Host
        style={{
          width: `calc(100vw - ${this.menuOpened ? this.menuWidth : 0}px)`,
          transition: 'width ease-out 1s',
        }}
      >
        <div class='container max-w-4xl mx-auto px-6 py-8'>
          <article id='claude-code-intro' class='blog-post'>
            <header class='mb-8'>
              <h1 class='text-4xl font-bold mb-4 text-blue-400'>
                Claude Code: The AI-Powered Development Assistant That's Changing the Game
              </h1>
              <div class='text-gray-400 mb-4'>
                <time datetime='2024-11-18'>November 18, 2024</time>
                <span class='mx-2'>•</span>
                <span>By Jeffrey Nicholson Carré</span>
              </div>
              <p class='text-xl text-gray-300 leading-relaxed'>
                An introduction to Claude Code and how to supercharge your WebStorm workflow with AI-powered coding assistance.
              </p>
            </header>

            <div class='content prose prose-invert max-w-none'>
              <h2 class='text-2xl font-bold mt-8 mb-4 text-green-400'>What is Claude Code?</h2>
              <p class='text-gray-300 leading-relaxed mb-4'>
                Claude Code is Anthropic's official command-line interface that brings the power of Claude AI directly into your development environment.
                Unlike traditional code completion tools, Claude Code understands context, can read and analyze your entire codebase, and provides intelligent
                suggestions that go far beyond simple autocomplete.
              </p>

              <p class='text-gray-300 leading-relaxed mb-4'>
                What makes Claude Code truly exceptional is its ability to:
              </p>

              <ul class='list-disc list-inside text-gray-300 mb-6 space-y-2'>
                <li>Understand complex codebases and architectural patterns</li>
                <li>Refactor code while maintaining functionality and best practices</li>
                <li>Debug issues by analyzing stack traces and code flow</li>
                <li>Generate comprehensive tests for your functions</li>
                <li>Explain code in natural language</li>
                <li>Suggest optimizations and performance improvements</li>
              </ul>

              <h2 class='text-2xl font-bold mt-8 mb-4 text-green-400'>Why Claude Code is Amazing</h2>

              <h3 class='text-xl font-semibold mt-6 mb-3 text-blue-300'>1. Context-Aware Intelligence</h3>
              <p class='text-gray-300 leading-relaxed mb-4'>
                Claude Code doesn't just look at individual lines - it understands your entire project structure. It can navigate through your files,
                understand relationships between components, and provide suggestions that make sense in the context of your architecture.
              </p>

              <h3 class='text-xl font-semibold mt-6 mb-3 text-blue-300'>2. Natural Language Interface</h3>
              <p class='text-gray-300 leading-relaxed mb-4'>
                You can communicate with Claude Code in plain English. Instead of memorizing commands, simply describe what you want to accomplish,
                and Claude will understand and execute accordingly.
              </p>

              <h3 class='text-xl font-semibold mt-6 mb-3 text-blue-300'>3. Multi-File Operations</h3>
              <p class='text-gray-300 leading-relaxed mb-4'>
                Need to refactor across multiple files? Claude Code can handle it. It understands import relationships, type dependencies,
                and can safely modify code across your entire project.
              </p>

              <h2 class='text-2xl font-bold mt-8 mb-4 text-green-400'>Getting Started with Claude Code in WebStorm</h2>

              <h3 class='text-xl font-semibold mt-6 mb-3 text-blue-300'>Installation</h3>
              <p class='text-gray-300 leading-relaxed mb-4'>
                First, you'll need to install Claude Code. Open your terminal and run:
              </p>

              <pre class='bg-gray-800 p-4 rounded-lg overflow-x-auto mb-6'>
                <code class='text-green-400'>npm install -g @anthropics/claude-code</code>
              </pre>

              <p class='text-gray-300 leading-relaxed mb-4'>
                Or if you prefer Homebrew (macOS):
              </p>

              <pre class='bg-gray-800 p-4 rounded-lg overflow-x-auto mb-6'>
                <code class='text-green-400'>brew install claude-code</code>
              </pre>

              <h3 class='text-xl font-semibold mt-6 mb-3 text-blue-300'>Configuring WebStorm</h3>
              <p class='text-gray-300 leading-relaxed mb-4'>
                While WebStorm doesn't have a dedicated Claude Code plugin yet, you can integrate it seamlessly through the built-in terminal:
              </p>

              <ol class='list-decimal list-inside text-gray-300 mb-6 space-y-3'>
                <li>
                  <strong>Open WebStorm Terminal:</strong> Press <code class='bg-gray-800 px-2 py-1 rounded'>Alt+F12</code> (Windows/Linux)
                  or <code class='bg-gray-800 px-2 py-1 rounded'>⌥F12</code> (macOS)
                </li>
                <li>
                  <strong>Navigate to your project:</strong> Ensure you're in your project root directory
                </li>
                <li>
                  <strong>Initialize Claude Code:</strong> Run <code class='bg-gray-800 px-2 py-1 rounded'>claude init</code>
                </li>
                <li>
                  <strong>Start coding with AI:</strong> Use <code class='bg-gray-800 px-2 py-1 rounded'>claude</code> to launch the interactive session
                </li>
              </ol>

              <h3 class='text-xl font-semibold mt-6 mb-3 text-blue-300'>Essential Commands</h3>

              <div class='space-y-4 mb-6'>
                <div class='bg-gray-800 p-4 rounded-lg'>
                  <code class='text-green-400'>claude "Explain this component"</code>
                  <p class='text-gray-400 text-sm mt-2'>Get a detailed explanation of any code file</p>
                </div>

                <div class='bg-gray-800 p-4 rounded-lg'>
                  <code class='text-green-400'>claude "Refactor this function to use async/await"</code>
                  <p class='text-gray-400 text-sm mt-2'>Transform callback-based code to modern async patterns</p>
                </div>

                <div class='bg-gray-800 p-4 rounded-lg'>
                  <code class='text-green-400'>claude "Find all unused imports"</code>
                  <p class='text-gray-400 text-sm mt-2'>Clean up your codebase automatically</p>
                </div>

                <div class='bg-gray-800 p-4 rounded-lg'>
                  <code class='text-green-400'>claude "Add TypeScript types to this file"</code>
                  <p class='text-gray-400 text-sm mt-2'>Migrate JavaScript to TypeScript effortlessly</p>
                </div>
              </div>

              <h2 class='text-2xl font-bold mt-8 mb-4 text-green-400'>Real-World Example</h2>
              <p class='text-gray-300 leading-relaxed mb-4'>
                Let's say you're working on a React component and want to add error boundaries. Instead of manually writing the boilerplate,
                you can simply ask:
              </p>

              <pre class='bg-gray-800 p-4 rounded-lg overflow-x-auto mb-6'>
                <code class='text-green-400'>claude "Wrap this component with an error boundary and add error logging"</code>
              </pre>

              <p class='text-gray-300 leading-relaxed mb-4'>
                Claude Code will analyze your component, create an appropriate error boundary, add proper error handling,
                and even integrate with your existing logging system.
              </p>

              <h2 class='text-2xl font-bold mt-8 mb-4 text-green-400'>Tips for Maximum Productivity</h2>

              <ul class='list-disc list-inside text-gray-300 mb-6 space-y-2'>
                <li><strong>Be specific:</strong> The more context you provide, the better Claude Code performs</li>
                <li><strong>Use project conventions:</strong> Claude learns from your codebase style and follows your patterns</li>
                <li><strong>Review suggestions:</strong> Always review AI-generated code before committing</li>
                <li><strong>Iterate:</strong> If the first suggestion isn't perfect, ask Claude to refine it</li>
                <li><strong>Leverage context:</strong> Claude remembers your conversation, so build on previous requests</li>
              </ul>

              <h2 class='text-2xl font-bold mt-8 mb-4 text-green-400'>Conclusion</h2>
              <p class='text-gray-300 leading-relaxed mb-4'>
                Claude Code represents a paradigm shift in how we write and maintain code. By combining the power of AI with
                deep code understanding, it enables developers to focus on architecture and problem-solving rather than boilerplate
                and syntax.
              </p>

              <p class='text-gray-300 leading-relaxed mb-4'>
                Whether you're building a new feature, refactoring legacy code, or debugging a complex issue, Claude Code is an
                invaluable teammate that's available 24/7. Give it a try in your WebStorm workflow - you might wonder how you ever
                coded without it.
              </p>

              <div class='bg-blue-900 bg-opacity-20 border-l-4 border-blue-400 p-4 mt-8 rounded'>
                <p class='text-gray-300'>
                  <strong>Pro Tip:</strong> Create custom keyboard shortcuts in WebStorm to quickly launch Claude Code commands
                  for your most common workflows. This can save you hours of repetitive work each week.
                </p>
              </div>
            </div>
          </article>
        </div>
      </Host>
    );
  }
}
