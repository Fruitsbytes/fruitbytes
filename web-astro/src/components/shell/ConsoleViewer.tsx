// PORT TARGET: console viewer section of web-stencil/src/components/right-panel/right-panel.tsx
//
// Replicates DevTools' Console tab. All colors come from CSS variables
// defined in src/styles/global.css so the view adapts cleanly to both
// dark and light themes.

import { For, Show, createEffect } from 'solid-js';
import { logs, clearLogs, menuWidth, type Log } from '../../stores/shell';

export default function ConsoleViewer() {
  let scrollerRef: HTMLDivElement | undefined;

  // Auto-scroll to bottom on new log
  createEffect(() => {
    logs(); // dependency tracker
    queueMicrotask(() => {
      if (scrollerRef) {
        scrollerRef.scrollTop = scrollerRef.scrollHeight;
      }
    });
  });

  return (
    <div class="flex flex-col h-full">
      {/* Sub-menu — Clear console button */}
      <div class="flex items-center min-h-[26px] bg-[var(--panel-toolbar)] border-b border-[var(--panel-border)] text-[var(--panel-text)]">
        <button
          type="button"
          onClick={clearLogs}
          title="Clear console."
          class="ml-1.5 w-7 h-6 flex items-center justify-center hover:text-[var(--panel-text-strong)]"
        >
          <span class="material-symbols-rounded text-[15px] [font-variation-settings:'wght'_700]">block</span>
        </button>
      </div>

      <div ref={scrollerRef} id="console" class="flex-1 overflow-y-auto font-mono text-[11px] leading-[1.4]">
        <For each={logs()}>{(entry) => <ConsoleEntry log={entry} />}</For>
        <div class="flex items-center px-2 py-0.5 border-t border-[var(--console-divider)] text-[var(--panel-text)]">
          <span class="text-[var(--console-prompt)] mr-1">&gt;</span>
          <input
            type="text"
            class="flex-1 bg-transparent outline-none text-[var(--panel-text-strong)] placeholder:text-[var(--panel-icon)]"
            aria-label="Console input (decorative)"
          />
        </div>
      </div>
    </div>
  );
}

function ConsoleEntry(props: { log: Log }) {
  const variantClass = () => {
    switch (props.log.level) {
      case 'error':
        return 'border-l-2 border-l-[var(--console-error-text)] bg-[var(--console-error-bg)] text-[var(--console-error-text)]';
      case 'warning':
        return 'border-l-2 border-l-[var(--console-warning-text)] bg-[var(--console-warning-bg)] text-[var(--console-warning-text)]';
      default:
        return 'text-[var(--panel-text-strong)]';
    }
  };

  return (
    <div class={`px-2 py-1 border-b border-[var(--console-divider)] ${variantClass()}`}>
      <div class="flex justify-between gap-3">
        <span class="message" innerHTML={props.log.message} />
        <span class="text-[var(--console-file-link)] hover:underline whitespace-nowrap text-[10px] mt-0.5">
          {props.log.file}:{props.log.line}
        </span>
      </div>
      <Show when={props.log.payload}>
        <div
          class="payload mt-1 text-[var(--console-payload-text)] overflow-hidden"
          style={`max-width: ${menuWidth() - 20}px;`}
          innerHTML={props.log.payload}
        />
      </Show>
    </div>
  );
}
