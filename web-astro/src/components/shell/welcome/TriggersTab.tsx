import { For } from 'solid-js';
import { getTriggers, type JeffreyNode } from '../../../data/jeffrey-dom';

export default function TriggersTab(props: { node: JeffreyNode }) {
  const triggers = () => getTriggers(props.node);
  return (
    <div class="p-3 font-mono text-[11px] leading-relaxed text-[var(--panel-text-strong)]">
      <ul class="m-0 p-0 list-none space-y-1">
        <For each={triggers()}>
          {(t) => (
            <li class="grid grid-cols-[max-content_1fr] gap-x-3">
              <span class="text-[var(--console-error-text)] tabular-nums">{t.event}</span>
              <span class="text-[var(--console-success-text)] truncate" title={t.action}>{t.action}</span>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
}
