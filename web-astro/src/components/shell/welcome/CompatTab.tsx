import { For, Show } from 'solid-js';
import { getCompat, type JeffreyNode } from '../../../data/jeffrey-dom';

export default function CompatTab(props: { node: JeffreyNode }) {
  const compat = () => getCompat(props.node);
  return (
    <div class="p-3 text-[11px] text-[var(--panel-text-strong)] space-y-3">
      <Show when={compat().languages?.length}>
        <Section icon="language" title="Languages">
          <Pills items={compat().languages!} />
        </Section>
      </Show>
      <Show when={compat().timeZones?.length}>
        <Section icon="schedule" title="Time zones">
          <Pills items={compat().timeZones!} />
        </Section>
      </Show>
      <Show when={compat().pairsWith?.length}>
        <Section icon="check_circle" title="Pairs with">
          <Pills items={compat().pairsWith!} accent />
        </Section>
      </Show>
      <Show when={compat().friction?.length}>
        <Section icon="block" title="Friction" muted>
          <Pills items={compat().friction!} muted />
        </Section>
      </Show>
    </div>
  );
}

function Section(props: { icon: string; title: string; muted?: boolean; children: any }) {
  return (
    <section>
      <header class={`flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider mb-1.5 ${props.muted ? 'text-[var(--panel-text)] opacity-50' : 'text-[var(--panel-text)] opacity-80'}`}>
        <span class="material-symbols-sharp text-[12px]">{props.icon}</span>
        {props.title}
      </header>
      {props.children}
    </section>
  );
}

function Pills(props: { items: string[]; accent?: boolean; muted?: boolean }) {
  return (
    <div class="flex flex-wrap gap-1">
      <For each={props.items}>
        {(item) => (
          <span
            class={`px-2 py-0.5 text-[11px] rounded border ${
              props.accent
                ? 'bg-[var(--console-success-text)]/10 border-[var(--console-success-text)]/40 text-[var(--console-success-text)]'
                : props.muted
                  ? 'bg-[var(--panel-toolbar)] border-[var(--panel-border)] text-[var(--panel-text)] opacity-70 line-through'
                  : 'bg-[var(--panel-toolbar)] border-[var(--panel-border)] text-[var(--panel-text-strong)]'
            }`}
          >
            {item}
          </span>
        )}
      </For>
    </div>
  );
}
