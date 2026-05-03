// PORT TARGET: web-stencil/src/components/right-panel/right-panel.tsx (625 lines)
//
// Faithful port of the Chrome DevTools dark theme clone.
//
// Design intent (per project_design_intent memory):
// - Dark theme palette matching DevTools (#202124 panel, #292a2d toolbar, #494c50 borders)
// - Top toolbar (26px) with menu items styled as DevTools tabs
// - Active tab has black background to mirror DevTools' selected tab
// - Resize handle on left edge with col-resize cursor (Stencil used custom cursor.webp;
//   not yet copied to web-astro/public — defer)
// - Right side has settings / more / close icons
// - Per-route content section below the toolbar (currently console viewer for /console-log;
//   other route-specific sections like console-welcome, console-about, blog-nav defer)
//
// Not yet ported (intentional):
// - Adaptive menu crunching (measures item widths, hides overflow into a "more" dropdown)
// - Mobile drawer with three states + touch gestures
// - Custom cursor image
// - Language selector, settings dropdown
// - Per-route content sections beyond /console-log

import { For, Show, createSignal, createEffect, onMount, onCleanup } from 'solid-js';
import {
  menuOpened,
  setMenuOpened,
  menuWidth,
  persistMenuWidth,
  isMobile,
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

  // Read pathname on mount and on Astro navigation events
  onMount(() => {
    const updatePath = () => setActivePath(window.location.pathname);
    updatePath();
    window.addEventListener('astro:after-swap', updatePath);
    onCleanup(() => window.removeEventListener('astro:after-swap', updatePath));
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
      class="fixed top-0 right-0 h-screen z-25 bg-[var(--panel-bg)] text-[var(--panel-text)] transition-transform duration-200 ease-in-out flex flex-col"
      style={`
        width:${menuWidth()}px;
        max-width:${MAX_WIDTH}px;
        min-width:${MIN_WIDTH}px;
        transform:translateX(${menuOpened() && !isMobile() ? 0 : menuWidth()}px);
        --panel-bg:#202124;
        --top-menu-bg:#292a2d;
        --panel-border:#494c50;
        --panel-text:#9aa0a6;
        --panel-icon:#919191;
      `}
      role="complementary"
      aria-label="DevTools-style navigation panel"
      aria-hidden={!menuOpened()}
    >
      {/* Resize handle on left edge */}
      <Show when={!isMobile()}>
        <div
          class={`absolute left-0 top-0 h-full w-2 cursor-ew-resize z-10 border-l border-[var(--panel-border)] transition-colors ${
            dragging() ? 'bg-blue-500/40' : 'hover:bg-white/5'
          }`}
          onPointerDown={onPointerDown}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize panel"
        />
      </Show>

      {/* Top toolbar — DevTools tab bar */}
      <div class="flex items-center min-h-[26px] bg-[var(--top-menu-bg)] border-b border-[var(--panel-border)] pl-2 select-none">
        {/* Home + Devices icons */}
        <a
          href="/welcome"
          class="w-7 h-6 flex items-center justify-center text-[var(--panel-icon)] hover:text-white"
          aria-label="Home"
        >
          <span class="material-symbols-rounded text-[20px]">home</span>
        </a>
        <span class="w-7 h-6 flex items-center justify-center text-[var(--panel-icon)] hover:text-white">
          <span class="material-symbols-rounded filled text-[20px]">devices</span>
        </span>

        {/* Vertical divider */}
        <div class="mx-1.5 my-1 w-px h-4 bg-[var(--panel-icon)] opacity-50" />

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
                      ? 'text-[#eaeaea] bg-black'
                      : 'text-[var(--panel-text)] hover:text-[#e8eaed] hover:bg-[#35363a]'
                  }`}
                >
                  {item.title}
                </a>
              );
            }}
          </For>
        </div>

        {/* Right-side icons */}
        <div class="flex ml-auto">
          <button
            type="button"
            class="w-7 h-6 flex items-center justify-center text-[var(--panel-icon)] hover:text-white"
            aria-label="Settings"
          >
            <span class="material-symbols-rounded filled text-[18px]">settings</span>
          </button>
          <button
            type="button"
            class="w-7 h-6 flex items-center justify-center text-[var(--panel-icon)] hover:text-white"
            aria-label="More options"
          >
            <span class="material-symbols-rounded text-[18px] [font-variation-settings:'wght'_700]">more_vert</span>
          </button>
          <button
            type="button"
            class="w-7 h-6 flex items-center justify-center text-[var(--panel-icon)] hover:text-white"
            aria-label="Close panel"
            onClick={() => setMenuOpened(false)}
          >
            <span class="material-symbols-rounded text-[16px] [font-variation-settings:'wght'_700] mt-1">close</span>
          </button>
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
      <p class="opacity-50">
        Inspector content for <code>{props.path}</code> not yet ported.
      </p>
      <p class="opacity-30 mt-1">
        Console pane (<code>/console-log</code>) is the only fully-ported section so far.
      </p>
    </div>
  );
}
