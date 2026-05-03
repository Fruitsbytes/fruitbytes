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

// Console log shape — mirrors web-stencil/src/interfaces/log.ts
export interface Log {
  line: number;
  message: string; // HTML allowed, rendered via innerHTML
  file: string;
  time: Date;
  level?: 'info' | 'warning' | 'error' | 'default';
  payload?: string; // HTML, rendered via innerHTML
}

const initialLog: Log = {
  payload: '<pre style="font-family:Roboto Mono,monospace;font-size:10px;line-height:1;color:#5aff5f;margin:0;">FruitsBytes</pre>',
  line: 1,
  time: new Date(),
  file: 'logo.txt',
  message: '<b style="color:#5aff5f;margin-right:8px">FruitsBytes</b><span>Welcome!</span>',
};

export const [logs, setLogs] = createSignal<Log[]>([initialLog]);

export const addLog = (entry: Log) => {
  setLogs((prev) => [...prev, entry]);
};

export const clearLogs = () => {
  setLogs([]);
};
