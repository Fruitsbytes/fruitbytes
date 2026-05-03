// PORT TARGET: console viewer section of web-stencil/src/components/right-panel/right-panel.tsx
// Replicates DevTools' Console tab. All colors come from CSS variables
// in src/styles/global.css so the view adapts cleanly to both themes.

import { For, Show, createEffect, createSignal } from 'solid-js';
import { logs, clearLogs, addLog, menuWidth, setTheme, type Log } from '../../stores/shell';

const timeFmt = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

export default function ConsoleViewer() {
  let scrollerRef: HTMLDivElement | undefined;
  const [input, setInput] = createSignal('');
  const [history, setHistory] = createSignal<string[]>([]);
  const [historyIndex, setHistoryIndex] = createSignal(-1);

  // Auto-scroll to bottom on new log
  createEffect(() => {
    logs(); // dependency tracker
    queueMicrotask(() => {
      if (scrollerRef) {
        scrollerRef.scrollTop = scrollerRef.scrollHeight;
      }
    });
  });

  const escape = (s: string) =>
    s.replace(/[&<>"']/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!),
    );

  const runCommand = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;

    // Echo input
    addLog({
      message: `<span style="color:var(--console-prompt)">&gt;</span> <code>${escape(cmd)}</code>`,
      file: 'console.ts',
      time: new Date(),
      line: history().length + 1,
    });

    setHistory([...history(), cmd]);
    setHistoryIndex(-1);

    const [name, ...args] = cmd.toLowerCase().split(/\s+/);
    switch (name) {
      case 'clear':
      case 'cls':
        clearLogs();
        return;

      case 'help':
      case '?':
        addLog({
          message:
            'Available commands: <code>help</code> · <code>clear</code> · <code>whoami</code> · <code>theme &lt;dark|light&gt;</code> · <code>cv</code> · <code>contact</code> · <code>blog</code> · <code>joke</code> · <code>echo &lt;text&gt;</code>',
          file: 'console.ts',
          time: new Date(),
          line: 1,
        });
        return;

      case 'whoami':
        addLog({
          message:
            '<b>Jeffrey Nicholson Carré</b> — Senior Software Developer · Montréal, QC · <a href="/about-me" style="color:#5a8dee;text-decoration:underline">resume</a>',
          file: 'whoami',
          time: new Date(),
          line: 1,
        });
        return;

      case 'theme': {
        const t = args[0];
        if (t === 'dark' || t === 'light') {
          setTheme(t);
        } else {
          addLog({
            message: `Usage: <code>theme &lt;dark|light&gt;</code> — current: <b>${
              document.documentElement.dataset.theme ?? 'auto'
            }</b>`,
            file: 'console.ts',
            time: new Date(),
            line: 1,
            level: 'warning',
          });
        }
        return;
      }

      case 'cv':
      case 'resume':
        window.location.href = '/about-me';
        return;

      case 'contact':
      case 'mail':
        window.location.href = '/contact-me';
        return;

      case 'blog':
        window.location.href = '/my-blog';
        return;

      case 'joke': {
        const jokes = [
          'Why do programmers prefer dark mode? Because light attracts bugs. 🐛',
          'A SQL query walks into a bar, walks up to two tables and asks: "Can I JOIN you?"',
          'There are 10 kinds of people: those who understand binary and those who don\'t.',
          '99 little bugs in the code · 99 little bugs · take one down, patch it around · 117 little bugs in the code.',
          'How many programmers does it take to change a lightbulb? None — that\'s a hardware problem.',
        ];
        addLog({
          message: jokes[Math.floor(Math.random() * jokes.length)],
          file: 'jokes.ts',
          time: new Date(),
          line: 1,
        });
        return;
      }

      case 'echo':
        addLog({
          message: escape(args.join(' ')),
          file: 'echo',
          time: new Date(),
          line: 1,
        });
        return;

      default:
        addLog({
          message: `<code>${escape(name)}</code>: command not found. Type <code>help</code> for the list.`,
          file: 'console.ts',
          time: new Date(),
          line: 1,
          level: 'error',
        });
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      runCommand(input());
      setInput('');
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const h = history();
      if (h.length === 0) return;
      const idx = historyIndex() === -1 ? h.length - 1 : Math.max(0, historyIndex() - 1);
      setHistoryIndex(idx);
      setInput(h[idx]);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const h = history();
      const idx = historyIndex();
      if (idx === -1) return;
      const next = idx + 1;
      if (next >= h.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(next);
        setInput(h[next]);
      }
    }
  };

  return (
    <div class="flex flex-col h-full">
      {/* Sub-menu — Clear console button */}
      <div class="flex items-center min-h-[26px] bg-[var(--panel-toolbar)] border-b border-[var(--panel-border)] text-[var(--panel-text)]">
        <button
          type="button"
          onClick={clearLogs}
          title="Clear console."
          class="ml-1.5 w-7 h-6 flex items-center justify-center text-[var(--panel-icon)] hover:text-[var(--panel-text-strong)] transition-colors"
        >
          <span class="material-symbols-rounded thick text-[14px]">block</span>
        </button>
        <span class="text-[10px] uppercase tracking-wider text-[var(--panel-text)] opacity-80 ml-1">
          Console
        </span>
        <span class="flex-1" />
        <span class="text-[10px] text-[var(--panel-text)] opacity-60 mr-2 tabular-nums">
          {logs().length} entr{logs().length === 1 ? 'y' : 'ies'}
        </span>
      </div>

      <div ref={scrollerRef} id="console" class="flex-1 overflow-y-auto font-mono text-[11px] leading-[1.4]">
        <For each={logs()}>{(entry) => <ConsoleEntry log={entry} />}</For>
        <div class="flex items-center px-2 py-1 border-t border-[var(--console-divider)] text-[var(--panel-text)] sticky bottom-0 bg-[var(--panel-bg)]">
          <span class="text-[var(--console-prompt)] mr-1.5">&gt;</span>
          <input
            type="text"
            value={input()}
            onInput={(e) => setInput(e.currentTarget.value)}
            onKeyDown={onKeyDown}
            spellcheck={false}
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            class="flex-1 bg-transparent outline-none text-[var(--panel-text-strong)] placeholder:text-[var(--panel-icon)] caret-[var(--console-success-text)]"
            aria-label="Console command"
            placeholder="Type help"
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

  const levelIcon = () => {
    switch (props.log.level) {
      case 'error':
        return { glyph: 'error', cls: 'text-[var(--console-error-text)]' };
      case 'warning':
        return { glyph: 'warning', cls: 'text-[var(--console-warning-text)]' };
      case 'info':
        return { glyph: 'info', cls: 'text-[var(--console-file-link)]' };
      default:
        return null;
    }
  };

  return (
    <div class={`px-2 py-1 border-b border-[var(--console-divider)] ${variantClass()}`}>
      <div class="flex justify-between gap-3 items-baseline">
        <div class="flex items-baseline gap-1.5 min-w-0 flex-1">
          <span class="text-[10px] tabular-nums text-[var(--panel-text)] opacity-60 flex-shrink-0">
            {timeFmt.format(props.log.time)}
          </span>
          <Show when={levelIcon()}>
            {(icon) => (
              <span class={`material-symbols-rounded text-[12px] flex-shrink-0 ${icon().cls}`}>
                {icon().glyph}
              </span>
            )}
          </Show>
          <span class="message min-w-0 break-words" innerHTML={props.log.message} />
        </div>
        <span class="text-[var(--console-file-link)] hover:underline whitespace-nowrap text-[10px] flex-shrink-0">
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
