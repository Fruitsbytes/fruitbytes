// PORT TARGET: console viewer section of web-stencil/src/components/right-panel/right-panel.tsx
//
// Replicates DevTools' Console tab:
// - Each log entry: message (HTML allowed) + file:line on the right
// - Level color coding: info / warning / error / default
// - Optional payload renders below the message line
// - Auto-scrolls to bottom when new entries arrive
// - Clear button in sub-menu (block icon)

import { For, Show, createEffect, onMount } from 'solid-js';
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
      <div class="flex items-center min-h-[26px] bg-[var(--top-menu-bg)] border-b border-[var(--panel-border)] text-[var(--panel-text)]">
        <button
          type="button"
          onClick={clearLogs}
          title="Clear console."
          class="ml-1.5 w-7 h-6 flex items-center justify-center hover:text-white"
        >
          <span class="material-symbols-rounded text-[15px] [font-variation-settings:'wght'_700]">block</span>
        </button>
      </div>

      <div ref={scrollerRef} id="console" class="flex-1 overflow-y-auto font-mono text-[11px] leading-[1.4]">
        <For each={logs()}>
          {(entry) => <ConsoleEntry log={entry} />}
        </For>
        <div class="flex items-center px-2 py-0.5 border-t border-[var(--panel-border)] text-[var(--panel-text)]">
          <span class="text-[#919191] mr-1">&gt;</span>
          <input
            type="text"
            class="flex-1 bg-transparent outline-none text-[var(--panel-text)] placeholder:text-[#5a5d61]"
            aria-label="Console input (decorative)"
          />
        </div>
      </div>
    </div>
  );
}

function ConsoleEntry(props: { log: Log }) {
  const levelColor = () => {
    switch (props.log.level) {
      case 'error':
        return 'text-[#ff8080] border-l-2 border-l-[#ff4040] bg-[#3a1c1c]';
      case 'warning':
        return 'text-[#ffd866] border-l-2 border-l-[#ffaa00] bg-[#3a311a]';
      default:
        return '';
    }
  };

  return (
    <div class={`px-2 py-1 border-b border-[#2a2b2e] ${levelColor()}`}>
      <div class="flex justify-between gap-3">
        <span class="message" innerHTML={props.log.message} />
        <span class="text-[#5a8dee] hover:underline whitespace-nowrap text-[10px] mt-0.5">
          {props.log.file}:{props.log.line}
        </span>
      </div>
      <Show when={props.log.payload}>
        <div
          class="payload mt-1 text-[#9aa0a6] overflow-hidden"
          style={`max-width: ${menuWidth() - 20}px;`}
          innerHTML={props.log.payload}
        />
      </Show>
    </div>
  );
}
