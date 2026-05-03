// PORT TARGET: web-stencil/src/components/main-header/main-header.tsx
//
// Parity goals (must work after migration):
// - Mouse-tracking face animation (eyes follow cursor) — _throttle from lodash
// - Volume toggle button + mute icon swap (volume_off ↔ volume_up)
// - Menu open/close button + icon swap (close ↔ menu)
// - Profile dropdown with player name, type/flavor, digiCode
// - Hidden volume on mobile
// - Width responsive to menuWidth + menuOpened (CSS calc(100vw - {menuWidth}px))
// - emits toggle.menu and toggle.volume — replaced by store mutations here
// - Logo + title in top-left
//
// This is a STUB to enable the persistent-island architecture build.
// Real implementation pending — see issue/parity-checklist.

import { Show } from 'solid-js';
import { menuOpened, setMenuOpened, menuWidth, isMobile, volumeMuted, persistMute } from '../../stores/shell';

export default function MainHeader() {
  const hostStyle = () =>
    isMobile()
      ? 'width:100vw;top:0;'
      : `width:calc(100vw - ${menuOpened() ? menuWidth() : 0}px);top:0;`;

  return (
    <div class="fixed top-0 left-0 z-30" style={hostStyle()}>
      <header class="flex items-center justify-between px-4 py-2 bg-gray-400/10 backdrop-blur-lg">
        <div class="flex items-center gap-2">
          <img src="/favicon.svg" alt="FruitsBytes" class="w-8 h-8" />
          <span class="font-mono">FruitsBytes</span>
        </div>
        <div class="flex items-center gap-2">
          <Show when={!isMobile()}>
            <button
              type="button"
              class="p-2 hover:bg-white/10 rounded"
              onClick={() => persistMute(!volumeMuted())}
              aria-label={volumeMuted() ? 'Unmute' : 'Mute'}
            >
              <span class="material-symbols-rounded">
                {volumeMuted() ? 'volume_off' : 'volume_up'}
              </span>
            </button>
          </Show>
          <button
            type="button"
            class="p-2 hover:bg-white/10 rounded"
            onClick={() => setMenuOpened(!menuOpened())}
            aria-label={menuOpened() ? 'Close menu' : 'Open menu'}
          >
            <span class="material-symbols-rounded">
              {menuOpened() ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </header>
    </div>
  );
}
