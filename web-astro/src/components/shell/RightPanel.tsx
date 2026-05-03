// PORT TARGET: web-stencil/src/components/right-panel/right-panel.tsx (625 lines)
//
// Architecture (corrected 2026-05-03):
//   Right panel is the DevTools-style chrome — toolbar + tabs + per-route
//   inspector pane + console viewer. The page content (welcome bio, about
//   resume, blog list, contact form, etc.) renders in the LEFT main area,
//   not inside this panel.
//
// Per-route inspector content shown below the toolbar:
//   /welcome      → ConsoleWelcome stub (decorative code blocks)
//   /about-me     → AboutInspector stub (about menu)
//   /my-blog/...  → BlogInspector stub (categories, tags, recent posts)
//   /console-log  → ConsoleViewer (live logs)
//   other         → empty (just the tab bar)
//
// Faithful Chrome DevTools dark + light theme clone driven by CSS
// variables in global.css.
//
// Future polish:
// - Adaptive menu crunching with overflow chevron + dropdown
// - Mobile drawer (3 states + touch gestures)
// - Custom cursor.webp
// - Language selector inside the toolbar
// - Real implementations of ConsoleWelcome / AboutInspector / BlogInspector

import { For, Show, createSignal, createEffect, onMount, onCleanup } from 'solid-js';
import {
  menuOpened,
  setMenuOpened,
  menuWidth,
  persistMenuWidth,
  isMobile,
  theme,
  toggleTheme,
  addLog,
} from '../../stores/shell';
import ConsoleViewer from './ConsoleViewer';
import ConsoleWelcome from './ConsoleWelcome';
import AboutInspector from './AboutInspector';
import BlogInspector, { type BlogPostMeta } from './BlogInspector';
import ContactInspector from './ContactInspector';

interface Props {
  initialPath?: string;
  blogPosts?: BlogPostMeta[];
}

const MIN_WIDTH = 234;
const MAX_WIDTH = 800;

const MENU_ITEMS = [
  { key: 'welcome', title: 'Home', path: '/welcome' },
  { key: 'console', title: 'Console', path: '/console-log' },
  { key: 'about', title: 'About', path: '/about-me' },
  { key: 'contact', title: 'Contact', path: '/contact-me' },
  { key: 'blog', title: 'Blog', path: '/my-blog' },
  { key: 'projects', title: 'Projects', path: '/my-projects' },
];

export default function RightPanel(props: Props) {
  const [dragging, setDragging] = createSignal(false);
  // SSR and client must agree on initial activePath, otherwise the wrong
  // inspector is rendered server-side and hydration fails. Passed in by
  // Layout.astro from Astro.url.pathname.
  const [activePath, setActivePath] = createSignal(props.initialPath ?? '/welcome');
  const [settingsOpen, setSettingsOpen] = createSignal(false);
  const [overflowOpen, setOverflowOpen] = createSignal(false);
  const [overflowedKeys, setOverflowedKeys] = createSignal<Set<string>>(new Set());
  const hasOverflow = () => overflowedKeys().size > 0;

  let tabsRef: HTMLDivElement | undefined;

  // Read pathname on mount and on every navigation. We listen to multiple
  // signals because transition:persist + the various Astro lifecycle events
  // can be subtle: astro:after-swap and astro:page-load are both dispatched
  // on `document`, but timing differs. popstate handles back/forward. A
  // 200ms interval is the belt-and-suspenders fallback so we never miss a
  // navigation regardless of which signal lands first.
  onMount(() => {
    let firstLoad = true;
    const updatePath = () => {
      const path = window.location.pathname;
      if (path !== activePath()) {
        const previous = activePath();
        setActivePath(path);
        setOverflowOpen(false);
        if (!firstLoad) {
          addLog({
            message: `🧭 <b>Navigated</b> from <code style="color:#9aa0a6">${previous}</code> → <code style="color:#5a8dee">${path}</code>`,
            file: 'router.ts',
            time: new Date(),
            line: 1,
          });
        }
      }
      firstLoad = false;
    };
    updatePath();

    document.addEventListener('astro:after-swap', updatePath);
    document.addEventListener('astro:page-load', updatePath);
    window.addEventListener('popstate', updatePath);

    const pollId = window.setInterval(updatePath, 200);

    onCleanup(() => {
      document.removeEventListener('astro:after-swap', updatePath);
      document.removeEventListener('astro:page-load', updatePath);
      window.removeEventListener('popstate', updatePath);
      clearInterval(pollId);
    });

    // Close popups on outside click
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target?.closest?.('[data-settings-popup]')) setSettingsOpen(false);
      if (!target?.closest?.('[data-overflow-popup]')) setOverflowOpen(false);
    };
    document.addEventListener('click', onDocClick, true);
    onCleanup(() => document.removeEventListener('click', onDocClick, true));

    // Detect which tabs overflow via ResizeObserver. We measure each tab's
    // right edge against the container; the ones past clientWidth are the
    // overflow set displayed in the chevron dropdown (DevTools behavior:
    // dropdown shows only what doesn't fit, not the full list).
    if (tabsRef) {
      const checkOverflow = () => {
        if (!tabsRef) return;
        const limit = tabsRef.clientWidth;
        const next = new Set<string>();
        const tabs = tabsRef.querySelectorAll<HTMLAnchorElement>('a[data-key]');
        tabs.forEach((tab) => {
          if (tab.offsetLeft + tab.offsetWidth > limit + 1) {
            const key = tab.dataset.key;
            if (key) next.add(key);
          }
        });
        // Only update signal if changed (avoids unnecessary re-renders)
        const prev = overflowedKeys();
        if (prev.size !== next.size || ![...next].every((k) => prev.has(k))) {
          setOverflowedKeys(next);
        }
      };
      const ro = new ResizeObserver(checkOverflow);
      ro.observe(tabsRef);
      // Initial measurement after layout
      requestAnimationFrame(checkOverflow);
      onCleanup(() => ro.disconnect());
    }
  });

  // Sync effective menu width to a CSS custom property on <html>
  // so server-rendered pages can offset their content.
  createEffect(() => {
    if (typeof document === 'undefined') return;
    const effective = !isMobile() && menuOpened() ? menuWidth() : 0;
    document.documentElement.style.setProperty('--effective-menu-width', `${effective}px`);
  });

  const onPointerDown = (e: PointerEvent) => {
    e.preventDefault();
    setDragging(true);
    const startX = e.clientX;
    const startWidth = menuWidth();
    const onMove = (ev: PointerEvent) => {
      const next = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth - (ev.clientX - startX)));
      persistMenuWidth(next);
    };
    const onUp = () => {
      setDragging(false);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <aside
      class="fixed top-0 right-0 h-screen z-40 bg-[var(--panel-bg)] text-[var(--panel-text)] transition-[transform,background-color] duration-200 ease-in-out flex flex-col border-l border-[var(--panel-border)]"
      style={`
        width:${menuWidth()}px;
        max-width:${MAX_WIDTH}px;
        min-width:${MIN_WIDTH}px;
        transform:translateX(${menuOpened() && !isMobile() ? 0 : menuWidth()}px);
      `}
      role="complementary"
      aria-label="DevTools-style navigation panel"
      aria-hidden={!menuOpened()}
    >
      {/* Resize handle on left edge */}
      <Show when={!isMobile()}>
        <div
          class={`absolute left-0 top-0 h-full w-2 cursor-ew-resize z-10 transition-colors ${
            dragging() ? 'bg-blue-500/40' : 'hover:bg-white/5'
          }`}
          onPointerDown={onPointerDown}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize panel"
        />
      </Show>

      {/* Top toolbar — DevTools tab bar */}
      <div class="flex items-center min-h-[26px] bg-[var(--panel-toolbar)] border-b border-[var(--panel-border)] pl-1.5 select-none">
        {/* DevTools-style left icons: element-picker (decorative, like
            DevTools' Inspect Element) + responsive devices toggle */}
        <a
          href="/welcome"
          class="w-7 h-6 flex items-center justify-center text-[var(--panel-icon)] hover:text-[var(--panel-text-strong)] transition-colors"
          aria-label="Home"
          title="Home"
        >
          <span class="material-symbols-rounded text-[18px]">arrow_selector_tool</span>
        </a>
        <span
          class="w-7 h-6 flex items-center justify-center text-[var(--panel-icon)] hover:text-[var(--panel-text-strong)] transition-colors"
          aria-hidden="true"
          title="Toggle device toolbar"
        >
          <span class="material-symbols-rounded text-[18px]">devices</span>
        </span>

        {/* Vertical divider */}
        <div class="mx-1.5 w-px h-4 bg-[var(--panel-divider)] opacity-60" />

        {/* Tab buttons */}
        <div ref={tabsRef} class="flex flex-1 overflow-hidden min-w-0" id="crunching-menu">
          <For each={MENU_ITEMS}>
            {(item) => {
              const active = () => {
                if (item.path === '/welcome') return activePath() === '/welcome' || activePath() === '/';
                if (item.path === '/my-blog') return activePath().startsWith('/my-blog');
                return activePath() === item.path;
              };
              return (
                <a
                  href={item.path}
                  data-key={item.key}
                  class={`h-[26px] px-3 flex items-center text-[12px] leading-4 whitespace-nowrap border-l-2 border-r-2 border-transparent transition-colors flex-shrink-0 ${
                    active()
                      ? 'text-[var(--panel-tab-selected-text)] bg-[var(--panel-tab-selected-bg)]'
                      : 'hover:text-[var(--panel-text-strong)] hover:bg-[var(--panel-tab-hover-bg)]'
                  }`}
                >
                  {item.title}
                </a>
              );
            }}
          </For>
        </div>

        {/* Overflow chevron — appears when tabs don't fit */}
        <Show when={hasOverflow()}>
          <div class="relative flex-shrink-0" data-overflow-popup>
            <button
              type="button"
              class="w-6 h-6 flex items-center justify-center text-[var(--panel-icon)] hover:text-[var(--panel-text-strong)] hover:bg-[var(--panel-tab-hover-bg)] transition-colors"
              aria-label="Show all tabs"
              aria-expanded={overflowOpen()}
              onClick={(e) => {
                e.stopPropagation();
                setOverflowOpen(!overflowOpen());
              }}
            >
              <span class="material-symbols-rounded thick text-[16px]">keyboard_double_arrow_right</span>
            </button>
            <Show when={overflowOpen()}>
              <div
                class="absolute top-7 right-0 min-w-40 bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded shadow-lg text-[12px] py-1 z-30"
                role="menu"
                onClick={(e) => e.stopPropagation()}
              >
                <For each={MENU_ITEMS.filter((m) => overflowedKeys().has(m.key))}>
                  {(item) => {
                    const active = () => activePath() === item.path;
                    return (
                      <a
                        href={item.path}
                        class={`block px-3 py-1.5 hover:bg-[var(--panel-tab-hover-bg)] hover:text-[var(--panel-text-strong)] transition-colors ${
                          active() ? 'text-[#0078d7] font-medium' : 'text-[var(--panel-text-strong)]'
                        }`}
                        onClick={() => setOverflowOpen(false)}
                      >
                        {item.title}
                      </a>
                    );
                  }}
                </For>
              </div>
            </Show>
          </div>
        </Show>

        {/* Right-side icons */}
        <div class="flex ml-auto relative" data-settings-popup>
          <button
            type="button"
            class="w-7 h-6 flex items-center justify-center text-[var(--panel-icon)] hover:text-[var(--panel-text-strong)] transition-colors"
            aria-label="Settings"
            aria-expanded={settingsOpen()}
            onClick={(e) => {
              e.stopPropagation();
              setSettingsOpen(!settingsOpen());
            }}
          >
            <span class="material-symbols-rounded text-[18px]">settings</span>
          </button>
          <button
            type="button"
            class="w-7 h-6 flex items-center justify-center text-[var(--panel-icon)] hover:text-[var(--panel-text-strong)] transition-colors"
            aria-label="More options"
          >
            <span class="material-symbols-rounded thick text-[16px]">more_vert</span>
          </button>
          <button
            type="button"
            class="w-7 h-6 flex items-center justify-center text-[var(--panel-icon)] hover:text-[var(--panel-text-strong)] transition-colors"
            aria-label="Close panel"
            onClick={() => setMenuOpened(false)}
          >
            <span class="material-symbols-rounded thick text-[14px]">close</span>
          </button>

          {/* Settings dropdown */}
          <Show when={settingsOpen()}>
            <div
              class="absolute top-7 right-0 w-56 bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded shadow-lg text-[12px] py-1 z-20"
              role="menu"
              onClick={(e) => e.stopPropagation()}
            >
              <div class="px-3 py-1.5 text-[10px] uppercase tracking-wider text-[var(--panel-text)] opacity-70">
                Appearance
              </div>
              <button
                type="button"
                class="w-full px-3 py-1.5 flex items-center justify-between text-[var(--panel-text-strong)] hover:bg-[var(--panel-tab-hover-bg)]"
                onClick={() => {
                  toggleTheme();
                  setSettingsOpen(false);
                }}
              >
                <span class="flex items-center gap-2">
                  <span class="material-symbols-rounded text-[16px]">
                    {theme() === 'dark' ? 'light_mode' : 'dark_mode'}
                  </span>
                  Switch to {theme() === 'dark' ? 'light' : 'dark'} theme
                </span>
              </button>
            </div>
          </Show>
        </div>
      </div>

      {/* Per-route inspector content area */}
      <div class="flex-1 overflow-hidden">
        <Show when={activePath() === '/console-log'}>
          <ConsoleViewer />
        </Show>
        <Show when={activePath() === '/welcome' || activePath() === '/'}>
          <ConsoleWelcome />
        </Show>
        <Show when={activePath() === '/about-me'}>
          <AboutInspector />
        </Show>
        <Show when={activePath().startsWith('/my-blog')}>
          <BlogInspector posts={props.blogPosts ?? []} />
        </Show>
        <Show when={activePath() === '/contact-me'}>
          <ContactInspector />
        </Show>
        <Show when={
          activePath() !== '/console-log' &&
          activePath() !== '/welcome' &&
          activePath() !== '/' &&
          activePath() !== '/about-me' &&
          activePath() !== '/contact-me' &&
          !activePath().startsWith('/my-blog')
        }>
          <div class="px-3 py-3 text-[11px] text-[var(--panel-text)] font-mono">
            <p class="opacity-60 m-0 leading-relaxed">
              No specific inspector content for <code>{activePath()}</code>.
            </p>
          </div>
        </Show>
      </div>
    </aside>
  );
}
