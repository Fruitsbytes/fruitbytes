// PORT TARGET: web-stencil/src/components/right-panel/right-panel.tsx (625 lines)
//
// Parity goals (this is the most complex component):
// - Resizable panel: 234px – 800px, drag handle on left edge with col-resize cursor
// - Adaptive menu crunching algorithm: hides menu items when space is constrained
// - Console log viewer: renders Log[] entries when route is /console-log
//   - Log levels: info / warning / error / default
//   - Each entry: line, message (HTML allowed), file, time, level, optional payload
//   - Listen for `console.logged` events from elsewhere — replace with a logs signal here
// - Material Symbols icons for each menu item
// - Mobile: bottom drawer instead of right panel
// - Persists width to localStorage (key: menu-width)
// - Emits menu.opened / menu.closed / menu.resizing / menu.resized
//   — replace with store mutations / shared signals
//
// This is a STUB. Real port involves:
// 1. Menu items from web-astro/src/data/menu-items.ts (mirror web-stencil/src/config.ts MENU_ITEMS)
// 2. Mouse drag handler that updates menuWidth signal
// 3. Conditional rendering of console viewer when location.pathname matches /console-log
// 4. Mobile bottom-drawer variant

import { For, createSignal, createEffect } from 'solid-js';
import { menuOpened, setMenuOpened, menuWidth, persistMenuWidth, isMobile } from '../../stores/shell';

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

  // Sync the panel's effective width to a CSS custom property on <html>
  // so server-rendered pages can offset their content with
  // `padding-right: var(--effective-menu-width, 600px)`.
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
      class="fixed top-0 right-0 h-screen z-25 bg-[#1e1e1e] border-l border-gray-700 transition-transform"
      style={`width:${menuWidth()}px;transform:translateX(${menuOpened() && !isMobile() ? 0 : menuWidth()}px);`}
      role="complementary"
      aria-label="Navigation menu"
      aria-hidden={!menuOpened()}
    >
      <div
        class={`absolute left-0 top-0 h-full w-1 cursor-col-resize ${dragging() ? 'bg-blue-500' : 'hover:bg-gray-600'}`}
        onPointerDown={onPointerDown}
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize panel"
      />
      <nav class="p-4 pt-16">
        <ul class="space-y-1">
          <For each={MENU_ITEMS}>
            {(item) => (
              <li>
                <a
                  href={item.path}
                  class="block px-3 py-2 text-sm hover:bg-white/5 rounded text-gray-200"
                  onClick={() => isMobile() && setMenuOpened(false)}
                >
                  {item.title}
                </a>
              </li>
            )}
          </For>
        </ul>
      </nav>
    </aside>
  );
}
