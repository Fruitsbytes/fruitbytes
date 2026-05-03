import { For, Index } from 'solid-js';
import { getStack, type JeffreyNode } from '../../../data/jeffrey-dom';

export default function StackTab(props: { node: JeffreyNode }) {
  const stack = () => getStack(props.node);
  return (
    <div class="p-3 text-[11px] text-[var(--panel-text-strong)] space-y-3">
      <For each={stack()}>
        {(group) => (
          <section>
            <header class="text-[10px] font-semibold uppercase tracking-wider text-[var(--panel-text)] opacity-80 mb-1">
              {group.group}
            </header>
            <ul class="m-0 p-0 list-none space-y-1">
              <For each={group.items}>
                {(item) => (
                  <li class="grid grid-cols-[1fr_auto] items-center gap-3">
                    <span class="truncate" title={item.name}>{item.name}</span>
                    <span class="flex gap-0.5" aria-label={`level ${item.level} of 5`}>
                      <Index each={[1, 2, 3, 4, 5]}>
                        {(_, idx) => (
                          <span
                            class={`block w-3 h-1.5 rounded-sm ${
                              idx < item.level ? 'bg-[#0078d7]' : 'bg-[var(--panel-border)]'
                            }`}
                          />
                        )}
                      </Index>
                    </span>
                  </li>
                )}
              </For>
            </ul>
          </section>
        )}
      </For>
    </div>
  );
}
