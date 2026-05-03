// Welcome page right-panel inspector: a Chrome DevTools "Elements" clone
// where Jeffrey himself is the inspected DOM. Top half = collapsible DOM
// tree. Bottom half = tabbed sub-panel (Bio / Stack / Routine / Triggers /
// Compat). See plan: ok-now-let-focus-jaunty-narwhal.md

import { For, Show, createSignal, createMemo } from 'solid-js';
import { getNodeAtPath } from '../../data/jeffrey-dom';
import DomTree from './welcome/DomTree';
import BioTab from './welcome/BioTab';
import StackTab from './welcome/StackTab';
import RoutineTab from './welcome/RoutineTab';
import TriggersTab from './welcome/TriggersTab';
import CompatTab from './welcome/CompatTab';

type Tab = 'bio' | 'stack' | 'routine' | 'triggers' | 'compat';

const TABS: Array<{ key: Tab; label: string }> = [
  { key: 'bio', label: 'Bio' },
  { key: 'stack', label: 'Stack' },
  { key: 'routine', label: 'Routine' },
  { key: 'triggers', label: 'Triggers' },
  { key: 'compat', label: 'Compat' },
];

export default function ConsoleWelcome() {
  const [selectedPath, setSelectedPath] = createSignal<number[]>([]);
  const [tab, setTab] = createSignal<Tab>('bio');

  const selectedNode = createMemo(() => getNodeAtPath(selectedPath()));

  return (
    <div class="h-full flex flex-col">
      {/* Top half: DOM tree */}
      <div class="flex-1 min-h-0 border-b border-[var(--panel-border)]">
        <DomTree selectedPath={selectedPath} onSelect={setSelectedPath} />
      </div>

      {/* Sub-toolbar */}
      <div class="flex items-center min-h-[26px] bg-[var(--panel-toolbar)] border-b border-[var(--panel-border)] select-none">
        <For each={TABS}>
          {(t) => {
            const active = () => tab() === t.key;
            return (
              <button
                type="button"
                onClick={() => setTab(t.key)}
                class={`h-[26px] px-3 flex items-center text-[11px] leading-4 whitespace-nowrap transition-colors border-l-2 border-r-2 border-transparent ${
                  active()
                    ? 'text-[var(--panel-tab-selected-text)] bg-[var(--panel-tab-selected-bg)]'
                    : 'text-[var(--panel-text)] hover:text-[var(--panel-text-strong)] hover:bg-[var(--panel-tab-hover-bg)]'
                }`}
              >
                {t.label}
              </button>
            );
          }}
        </For>
      </div>

      {/* Bottom half: active tab content */}
      <div class="flex-1 min-h-0 overflow-y-auto">
        <Show when={tab() === 'bio'}><BioTab node={selectedNode()} /></Show>
        <Show when={tab() === 'stack'}><StackTab node={selectedNode()} /></Show>
        <Show when={tab() === 'routine'}><RoutineTab node={selectedNode()} /></Show>
        <Show when={tab() === 'triggers'}><TriggersTab node={selectedNode()} /></Show>
        <Show when={tab() === 'compat'}><CompatTab node={selectedNode()} /></Show>
      </div>
    </div>
  );
}
