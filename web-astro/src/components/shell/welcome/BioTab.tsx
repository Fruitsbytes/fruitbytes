import { For, Show } from 'solid-js';
import { getBio, type JeffreyNode } from '../../../data/jeffrey-dom';

export default function BioTab(props: { node: JeffreyNode }) {
  const bio = () => getBio(props.node);
  return (
    <div class="p-3 text-[12px] leading-relaxed text-[var(--panel-text-strong)] space-y-3">
      <p class="m-0">{bio().summary}</p>
      <Show when={bio().facts && Object.keys(bio().facts!).length > 0}>
        <dl class="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-1 text-[11px] m-0">
          <For each={Object.entries(bio().facts!)}>
            {([k, v]) => (
              <>
                <dt class="text-[var(--panel-text)] uppercase tracking-wider text-[10px] self-baseline">{k}</dt>
                <dd class="m-0 text-[var(--panel-text-strong)]">{v}</dd>
              </>
            )}
          </For>
        </dl>
      </Show>
    </div>
  );
}
