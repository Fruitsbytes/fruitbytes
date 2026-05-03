// Minimal sound service. HTML5 Audio with lazy-load. Replaces the Howler-
// based web-stencil/src/services/soundLibraryService.ts for the welcome
// button and similar one-shot effects. Ambient music + 3D scene audio
// will need a richer service when the BackgroundActivity scene is ported.

const SOUND_PATHS: Record<string, string> = {
  jumpSoft: '/assets/sounds/jumpSoft.mp3',
  ping: '/assets/sounds/ping.mp3',
};

const cache = new Map<string, HTMLAudioElement>();

export function playSound(name: keyof typeof SOUND_PATHS, volume = 1): void {
  if (typeof window === 'undefined') return;
  const path = SOUND_PATHS[name];
  if (!path) return;

  let audio = cache.get(name);
  if (!audio) {
    audio = new Audio(path);
    audio.preload = 'auto';
    cache.set(name, audio);
  }

  // Reset to start; clone if user is hammering the button
  try {
    audio.currentTime = 0;
    audio.volume = Math.max(0, Math.min(1, volume));
    void audio.play();
  } catch {
    // Audio play failures are non-fatal (e.g., autoplay policy)
  }
}
