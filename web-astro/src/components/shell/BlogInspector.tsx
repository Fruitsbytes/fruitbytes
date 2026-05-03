// PORT TARGET: blog-navigation section of web-stencil/src/components/right-panel/right-panel.tsx
// Sidebar shown in the right panel when route is /my-blog/*. Three sections:
// Categories (with post counts), Tags (#-prefixed), Recent Posts (last 5).
// Data comes from a `posts` prop populated at build time by Layout.astro.

import { For, createMemo } from 'solid-js';

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string; // ISO string (Date doesn't serialize cleanly across Astro boundary)
  category: string;
  tags: string[];
  readTime: number;
}

interface Props {
  posts: BlogPostMeta[];
}

export default function BlogInspector(props: Props) {
  const sortedPosts = createMemo(() =>
    [...props.posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  );

  const categories = createMemo(() => {
    const counts = new Map<string, number>();
    for (const post of props.posts) {
      counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
    }
    return Array.from(counts.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  });

  const tags = createMemo(() => {
    const set = new Set<string>();
    for (const post of props.posts) for (const t of post.tags) set.add(t);
    return Array.from(set).sort();
  });

  const dateFmt = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div class="h-full overflow-y-auto py-1 text-[12px] text-[var(--panel-text)]">

      <Section icon="category" title="Categories">
        <For each={categories()}>
          {([cat, count]) => (
            <div class="flex items-center justify-between px-3 py-1 hover:bg-[var(--panel-tab-hover-bg)] hover:text-[var(--panel-text-strong)] cursor-default">
              <span class="truncate" title={cat}>{cat}</span>
              <span class="text-[10px] opacity-60 ml-2 flex-shrink-0">{count}</span>
            </div>
          )}
        </For>
      </Section>

      <Section icon="label" title="Tags">
        <div class="flex flex-wrap gap-1 px-3 py-1">
          <For each={tags()}>
            {(tag) => (
              <span class="px-1.5 py-0.5 text-[10px] bg-[var(--panel-toolbar)] border border-[var(--panel-border)] rounded text-[var(--panel-text)]">
                #{tag}
              </span>
            )}
          </For>
        </div>
      </Section>

      <Section icon="schedule" title="Recent Posts">
        <For each={sortedPosts().slice(0, 5)}>
          {(post) => (
            <a
              href={`/my-blog/${post.slug}`}
              class="block px-3 py-1.5 hover:bg-[var(--panel-tab-hover-bg)] transition-colors"
            >
              <div class="text-[var(--panel-text-strong)] text-[12px] leading-tight truncate" title={post.title}>
                {post.title}
              </div>
              <div class="text-[10px] opacity-70 mt-0.5 flex items-center gap-1.5">
                <span>{dateFmt.format(new Date(post.date))}</span>
                <span>•</span>
                <span>{post.readTime} min</span>
              </div>
            </a>
          )}
        </For>
      </Section>

    </div>
  );
}

function Section(props: { icon: string; title: string; children: any }) {
  return (
    <section class="mb-2">
      <header class="flex items-center gap-1.5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--panel-text)] opacity-70 border-b border-[var(--panel-border)]">
        <span class="material-symbols-sharp text-[12px]">{props.icon}</span>
        {props.title}
      </header>
      <div class="py-0.5">{props.children}</div>
    </section>
  );
}
