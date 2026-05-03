// PORT TARGET: web-stencil/src/components/right-panel/right-panel.tsx (625 lines)
//
// Faithful port of the Chrome DevTools dark-theme clone, now with full
// dark + light theme support driven by CSS variables in global.css.
// Theme is set on <html data-theme="light|dark"> by an inline boot script
// in Layout.astro, then mirrored into the `theme` signal on hydration.
//
// Active tab uses the same CSS variables, so the visual matches DevTools
// in both modes:
//   dark  → tab black-ish (#000) over toolbar #292a2d
//   light → tab white over toolbar #f3f3f4
//
// Future polish:
// - Adaptive menu crunching with overflow chevron + dropdown
// - Mobile drawer (3 states + touch gestures)
// - Custom cursor.webp
// - Language selector inside the toolbar
// - Settings dropdown can host more options (font size, dock position, etc.)

import { For, Show, createSignal, createEffect, onMount, onCleanup } from 'solid-js';
import {
  menuOpened,
  setMenuOpened,
  menuWidth,
  persistMenuWidth,
  isMobile,
  theme,
  toggleTheme,
} from '../../stores/shell';
import ConsoleViewer from './ConsoleViewer';

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

export default function RightPanel() {
  const [dragging, setDragging] = createSignal(false);
  const [activePath, setActivePath] = createSignal('/welcome');
  const [settingsOpen, setSettingsOpen] = createSignal(false);

  // Read pathname on mount and on Astro navigation events
  onMount(() => {
    const updatePath = () => setActivePath(window.location.pathname);
    updatePath();
    window.addEventListener('astro:after-swap', updatePath);
    onCleanup(() => window.removeEventListener('astro:after-swap', updatePath));

    // Close settings on outside click
    const onDocClick = (e: MouseEvent) => {
      if (!(e.target as Element)?.closest?.('[data-settings-popup]')) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener('click', onDocClick, true);
    onCleanup(() => document.removeEventListener('click', onDocClick, true));
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

  const showConsole = () => activePath() === '/console-log';

  return (
    <aside
      class="fixed top-0 right-0 h-screen z-25 bg-[var(--panel-bg)] text-[var(--panel-text)] transition-[transform,background-color] duration-200 ease-in-out flex flex-col border-l border-[var(--panel-border)]"
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
        <div class="flex flex-1 overflow-hidden" id="crunching-menu">
          <For each={MENU_ITEMS}>
            {(item) => {
              const active = () => activePath() === item.path;
              return (
                <a
                  href={item.path}
                  data-key={item.key}
                  class={`h-[26px] px-3 flex items-center text-[12px] leading-4 whitespace-nowrap border-l-2 border-r-2 border-transparent transition-colors ${
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

      {/* Per-route content area */}
      <div class="flex-1 overflow-hidden">
        <Show when={showConsole()} fallback={<RoutePlaceholder path={activePath()} />}>
          <ConsoleViewer />
        </Show>
      </div>
    </aside>
  );
}

function RoutePlaceholder(props: { path: string }) {
  return (
    <div class="px-3 py-2 text-[11px] text-[var(--panel-text)] font-mono">
      <p class="opacity-70">
        Inspector content for <code>{props.path}</code> not yet ported.
      </p>
      <p class="opacity-40 mt-1">
        Console pane (<code>/console-log</code>) is the only fully-ported section so far.
      </p>
    </div>
  );
}
