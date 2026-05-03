// PORT TARGET: web-stencil/src/components/console-about/console-about.tsx (menu only)
// The hierarchical about menu shown in the right panel when route is /about-me.
// Each leaf item links to /about-me#<hash>; the page-side HashScroll component
// handles smooth scrolling. CV download is deferred per migration plan.

import { For, Show, createSignal, onMount, onCleanup } from 'solid-js';
import { ABOUT_SECTION, type AboutMenuItem } from '../../data/about-section';

export default function AboutInspector() {
  const [activeHash, setActiveHash] = createSignal('');

  onMount(() => {
    if (typeof window === 'undefined') return;
    const update = () => {
      const hash = window.location.hash;
      if (hash !== activeHash()) setActiveHash(hash);
    };
    update();
    window.addEventListener('hashchange', update);
    document.addEventListener('astro:after-swap', update);
    document.addEventListener('astro:page-load', update);
    const pollId = window.setInterval(update, 200);
    onCleanup(() => {
      window.removeEventListener('hashchange', update);
      document.removeEventListener('astro:after-swap', update);
      document.removeEventListener('astro:page-load', update);
      clearInterval(pollId);
    });
  });

  return (
    <nav class="h-full overflow-y-auto py-1 text-[12px] text-[var(--panel-text)]">
      <ul class="m-0 p-0 list-none">
        <For each={ABOUT_SECTION}>
          {(section) => <SectionGroup section={section} activeHash={activeHash} />}
        </For>
      </ul>
    </nav>
  );
}

function SectionGroup(props: { section: AboutMenuItem; activeHash: () => string }) {
  return (
    <li class="my-1">
      <div class="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--panel-text)] opacity-70">
        {props.section.title}
      </div>
      <Show when={props.section.children}>
        <ul class="m-0 p-0 list-none">
          <For each={props.section.children}>
            {(child) => <LeafItem item={child} activeHash={props.activeHash} />}
          </For>
        </ul>
      </Show>
    </li>
  );
}

function LeafItem(props: { item: AboutMenuItem; activeHash: () => string }) {
  const isActive = () => props.activeHash() === `#${props.item.hash}`;
  return (
    <li>
      <a
        href={`/about-me#${props.item.hash}`}
        class={`flex items-center gap-2 px-3 py-1 truncate hover:bg-[var(--panel-tab-hover-bg)] hover:text-[var(--panel-text-strong)] transition-colors ${
          isActive() ? 'bg-[var(--panel-tab-selected-bg)] text-[var(--panel-tab-selected-text)] border-l-2 border-l-[#0078d7]' : ''
        }`}
        title={props.item.title}
      >
        <Show when={props.item.icon}>
          <span class="material-symbols-sharp text-[14px] opacity-70 flex-shrink-0">{props.item.icon}</span>
        </Show>
        <span class="truncate">{props.item.title}</span>
      </a>
    </li>
  );
}
