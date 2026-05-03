import { For } from 'solid-js';
import { getRoutine, type JeffreyNode } from '../../../data/jeffrey-dom';

export default function RoutineTab(props: { node: JeffreyNode }) {
  const routine = () => getRoutine(props.node);
  return (
    <div class="p-3 text-[11px] text-[var(--panel-text-strong)] space-y-3">
      {/* Segmented bar */}
      <div class="flex w-full h-7 rounded-sm overflow-hidden border border-[var(--panel-border)]">
        <For each={routine()}>
          {(seg) => (
            <div
              class="flex items-center justify-center text-[10px] font-medium text-black/80 truncate"
              style={`width:${seg.pct}%; background:${seg.color};`}
              title={`${seg.label} ${seg.pct}%`}
            >
              {seg.pct >= 10 ? seg.label : ''}
            </div>
          )}
        </For>
      </div>

      {/* Legend */}
      <ul class="m-0 p-0 list-none space-y-1 text-[11px]">
        <For each={routine()}>
          {(seg) => (
            <li class="grid grid-cols-[12px_1fr_auto] items-center gap-2">
              <span class="block w-3 h-3 rounded-sm" style={`background:${seg.color};`} />
              <span class="truncate">{seg.label}</span>
              <span class="text-[var(--panel-text)] tabular-nums">{seg.pct}%</span>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
}
