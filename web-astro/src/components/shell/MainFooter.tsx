// PORT TARGET: web-stencil/src/components/main-footer/main-footer.tsx
//
// Parity goals:
// - Hidden on mobile (display: none)
// - Width matches main content (calc(100vw - {menuWidth}px))
// - Backdrop blur + transparent background
// - "Built with 💖 and: StencilJS • TypeScript • ThreeJS • enable3d • AmmoJS • Tailwind"
//   (will need updating to reflect the new stack post-migration)

import { Show } from 'solid-js';
import { menuOpened, menuWidth, isMobile } from '../../stores/shell';

export default function MainFooter() {
  return (
    <Show when={!isMobile()}>
      <footer
        class="fixed bottom-0 left-0 z-20 px-4 py-2 bg-gray-400/10 backdrop-blur-lg text-xs text-gray-300"
        style={`width:calc(100vw - ${menuOpened() ? menuWidth() : 0}px);`}
      >
        Built with 💖 and:{' '}
        <span class="text-gray-400">
          StencilJS • TypeScript • ThreeJS • enable3d • AmmoJS • Tailwind
        </span>
      </footer>
    </Show>
  );
}
