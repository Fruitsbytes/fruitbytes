// PORT TARGET: web-stencil/src/components/gui-welcome/gui-welcome.tsx — wave() method
// The 10-column technology grid with a wave animation that lights up cells
// row-by-row, then column-by-column. Replaces the original RxJS interval/repeat
// chain with a plain setInterval. Click any tool to trigger another wave from
// that point.

import { For, createSignal, onMount, onCleanup } from 'solid-js';
import { TOOLS, TOOLS_COLUMNS } from '../../data/tools';

interface Props {
  /** Number of full wave repeats. Stencil default was 3. */
  initialCount?: number;
}

export default function ToolsWave(props: Props) {
  const [selected, setSelected] = createSignal<Set<number>>(new Set());

  let runningInterval: ReturnType<typeof setInterval> | undefined;

  const wave = (point = 0, count = 3) => {
    if (runningInterval) return; // already animating

    const columns = TOOLS_COLUMNS;
    const rows = Math.ceil(TOOLS.length / columns);
    const start = point % columns;
    const totalTicks = (columns + rows) * count;
    let tick = 0;

    runningInterval = setInterval(() => {
      if (tick >= totalTicks) {
        clearInterval(runningInterval);
        runningInterval = undefined;
        setSelected(new Set());
        return;
      }
      const j = tick % (columns + rows);
      const a = new Set<number>();
      for (let i = 0; i < rows; i++) {
        const b = i * columns + j - i + start;
        if (b >= columns * i && b < columns * (i + 1)) {
          a.add(b);
        } else if (b >= columns * (i + 1)) {
          a.add(b - columns);
        }
      }
      setSelected(a);
      tick++;
    }, 200);
  };

  onMount(() => {
    const initial = props.initialCount ?? 3;
    setTimeout(() => wave(0, initial), 100);
  });

  onCleanup(() => {
    if (runningInterval) clearInterval(runningInterval);
  });

  return (
    <div
      id="accolades-grid"
      class="grid grid-cols-10 gap-x-1 gap-y-1.5 px-2 py-1.5 pb-12 bg-gradient-to-b from-[#000c66] to-[#0052d6] h-full"
      role="presentation"
    >
      <For each={TOOLS}>
        {(tool, index) => {
          const isSelected = () => selected().has(index());
          return (
            <button
              type="button"
              onClick={() => wave(index() + 1, 1)}
              class="relative flex items-center justify-center h-5 max-w-5 mx-auto group"
              data-tool={tool}
              aria-label={tool}
              title={tool}
            >
              {isSelected() && (
                <span class="absolute w-10 h-10 rounded-full bg-white pointer-events-none" />
              )}
              <img
                src={`/assets/logos/${tool}.png`}
                alt={tool}
                class={`relative block w-full object-cover transition-all duration-300 ${
                  isSelected() ? 'scale-200 z-10 drop-shadow-[1px_2px_2px_black]' : 'grayscale contrast-50 drop-shadow-[1px_1px_1px_black] group-hover:scale-200 group-hover:grayscale-0 group-hover:contrast-100 group-hover:z-10'
                }`}
                loading="lazy"
                onerror="this.style.opacity = '0.2'"
              />
            </button>
          );
        }}
      </For>
    </div>
  );
}
