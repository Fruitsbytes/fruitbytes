import { createSignal } from 'solid-js';

// Shared shell state — the equivalent of app-root's @State() in Stencil.
// Persisted across navigations because the islands consuming these signals
// use transition:persist.

const STORAGE_KEY = 'menu-width';
const DEFAULT_MENU_WIDTH = 600;

const readStoredWidth = () => {
  if (typeof window === 'undefined') return DEFAULT_MENU_WIDTH;
  const raw = localStorage.getItem(STORAGE_KEY);
  const parsed = raw ? Number.parseInt(raw, 10) : NaN;
  return Number.isFinite(parsed) ? parsed : DEFAULT_MENU_WIDTH;
};

export const [menuOpened, setMenuOpened] = createSignal(true);
export const [menuWidth, setMenuWidth] = createSignal(readStoredWidth());
export const [volumeMuted, setVolumeMuted] = createSignal(
  typeof window !== 'undefined' && localStorage.getItem('muted') === '1',
);
export const [isMobile, setIsMobile] = createSignal(
  typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches,
);

export const persistMenuWidth = (width: number) => {
  setMenuWidth(width);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, String(width));
  }
};

export const persistMute = (muted: boolean) => {
  setVolumeMuted(muted);
  if (typeof window !== 'undefined') {
    localStorage.setItem('muted', muted ? '1' : '0');
  }
};
