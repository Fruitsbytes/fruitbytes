// PORT TARGET: web-stencil/src/components/background-activity/background-activity.tsx (573 lines)
//
// Parity goals:
// - Three.js + enable3d + Ammo.js physics scene with the fruit tree
// - Only renders on /welcome (desktop only — disabled on mobile for performance)
// - Spawns fruit-item children, animates physics
// - Reacts to menuWidth (canvas resizes when right-panel resizes)
// - digiCode prop drives some procedural variation
//
// The 3D code itself is largely framework-agnostic (vanilla three/enable3d).
// The Solid wrapper just needs to:
//   1. Mount a div ref
//   2. Init the scene on mount (lazy-import enable3d to keep main bundle small)
//   3. Resize on menuWidth change
//   4. Cleanup on unmount
//
// Bundle size note: enable3d + Ammo.js ≈ 1.5 MB. We lazy-load it via
// dynamic import + client:visible directive so it only ships on /welcome.

import { onMount, onCleanup, createSignal, Show } from 'solid-js';
import { menuWidth, menuOpened, isMobile } from '../../stores/shell';

export default function BackgroundActivity() {
  let containerRef: HTMLDivElement | undefined;
  const [enabled, setEnabled] = createSignal(false);

  onMount(() => {
    // Only run 3D on welcome page, desktop only
    if (typeof window === 'undefined') return;
    if (isMobile()) return;
    if (window.location.pathname !== '/welcome' && window.location.pathname !== '/') return;

    setEnabled(true);

    // Lazy-load the heavy 3D bundle
    // import('../../scenes/fruit-tree-scene').then(({ FruitTreeScene }) => {
    //   if (!containerRef) return;
    //   const scene = new FruitTreeScene(containerRef, { menuWidth: menuWidth() });
    //   onCleanup(() => scene.dispose());
    // });

    // Stub for now — real scene port pending
    onCleanup(() => {
      /* dispose scene */
    });
  });

  return (
    <Show when={enabled()}>
      <div
        ref={containerRef}
        class="fixed inset-0 z-0 pointer-events-none"
        style={`right:${menuOpened() ? menuWidth() : 0}px;`}
        aria-hidden="true"
        data-stub="background-activity"
      />
    </Show>
  );
}
