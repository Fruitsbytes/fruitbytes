// Top half of the Welcome inspector: collapsible DOM tree representing
// Jeffrey as nested custom elements. Click a row to select; click the
// triangle to toggle expansion. Tag/attribute coloring matches DevTools.

import { For, Show, createSignal, type Accessor } from 'solid-js';
import type { JeffreyNode } from '../../../data/jeffrey-dom';
import { JEFFREY_DOM } from '../../../data/jeffrey-dom';

interface Props {
  selectedPath: Accessor<number[]>;
  onSelect: (path: number[]) => void;
}

export default function DomTree(props: Props) {
  // Default expansion: top two depths expanded
  const [expanded, setExpanded] = createSignal<Set<string>>(
    new Set(['', '0', '1', '2', '3', '4']),
  );

  const toggle = (key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div class="h-full overflow-auto py-1 font-mono text-[12px] leading-[1.5] text-[var(--panel-text-strong)]">
      <NodeRow
        node={JEFFREY_DOM}
        path={[]}
        depth={0}
        expanded={expanded}
        toggle={toggle}
        selectedPath={props.selectedPath}
        onSelect={props.onSelect}
      />
    </div>
  );
}

interface NodeRowProps {
  node: JeffreyNode;
  path: number[];
  depth: number;
  expanded: Accessor<Set<string>>;
  toggle: (key: string) => void;
  selectedPath: Accessor<number[]>;
  onSelect: (path: number[]) => void;
}

function pathKey(path: number[]): string {
  return path.join('.');
}

function pathsEqual(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

function NodeRow(props: NodeRowProps) {
  const key = () => pathKey(props.path);
  const isExpanded = () => props.expanded().has(key());
  const isSelected = () => pathsEqual(props.selectedPath(), props.path);
  const hasChildren = () => !!props.node.children && props.node.children.length > 0;
  const indent = () => props.depth * 12 + 4;

  const onSelectClick = (e: MouseEvent) => {
    e.stopPropagation();
    props.onSelect(props.path);
  };

  const onToggleClick = (e: MouseEvent) => {
    e.stopPropagation();
    props.toggle(key());
  };

  return (
    <div>
      {/* Row */}
      <div
        class={`flex items-start cursor-default select-none whitespace-pre transition-colors ${
          isSelected()
            ? 'bg-[#1a73e8]/30 text-[var(--panel-text-strong)]'
            : 'hover:bg-[var(--panel-tab-hover-bg)]'
        }`}
        style={`padding-left: ${indent()}px; padding-right: 8px;`}
        onClick={onSelectClick}
      >
        {/* Expand/collapse triangle */}
        <Show
          when={hasChildren()}
          fallback={<span class="inline-block w-3 flex-shrink-0" />}
        >
          <button
            type="button"
            class="inline-block w-3 flex-shrink-0 text-[var(--panel-icon)] hover:text-[var(--panel-text-strong)] -ml-0.5 mt-[3px]"
            onClick={onToggleClick}
            aria-label={isExpanded() ? 'Collapse' : 'Expand'}
          >
            <span class={`material-symbols-rounded text-[10px] transition-transform inline-block ${isExpanded() ? 'rotate-90' : ''}`}>
              chevron_right
            </span>
          </button>
        </Show>

        {/* Opening tag */}
        <span class="text-[var(--panel-text)]">&lt;</span>
        <span class="text-[var(--console-file-link)]">{props.node.tag}</span>
        <For each={Object.entries(props.node.attrs ?? {})}>
          {([name, value]) => (
            <>
              <span> </span>
              <span class="text-[var(--console-error-text)]">{name}</span>
              <span class="text-[var(--panel-text)]">=</span>
              <span class="text-[var(--console-success-text)]">"{value}"</span>
            </>
          )}
        </For>
        <Show when={props.node.selfClosing} fallback={<span class="text-[var(--panel-text)]">&gt;</span>}>
          <span class="text-[var(--panel-text)]"> /&gt;</span>
        </Show>

        {/* Inline text content (for compact leaf nodes that fit on one line) */}
        <Show when={!hasChildren() && !props.node.selfClosing && props.node.text}>
          <span class="text-[var(--panel-text-strong)]">{props.node.text}</span>
          <span class="text-[var(--panel-text)]">&lt;/</span>
          <span class="text-[var(--console-file-link)]">{props.node.tag}</span>
          <span class="text-[var(--panel-text)]">&gt;</span>
        </Show>

        {/* "..." preview for collapsed parents */}
        <Show when={hasChildren() && !isExpanded()}>
          <span class="text-[var(--panel-text)]">…</span>
          <span class="text-[var(--panel-text)]">&lt;/</span>
          <span class="text-[var(--console-file-link)]">{props.node.tag}</span>
          <span class="text-[var(--panel-text)]">&gt;</span>
        </Show>
      </div>

      {/* Children */}
      <Show when={hasChildren() && isExpanded()}>
        <For each={props.node.children}>
          {(child, i) => (
            <NodeRow
              node={child}
              path={[...props.path, i()]}
              depth={props.depth + 1}
              expanded={props.expanded}
              toggle={props.toggle}
              selectedPath={props.selectedPath}
              onSelect={props.onSelect}
            />
          )}
        </For>
        {/* Closing tag for parent */}
        <div class="flex items-start whitespace-pre" style={`padding-left: ${indent()}px;`}>
          <span class="inline-block w-3 flex-shrink-0" />
          <span class="text-[var(--panel-text)]">&lt;/</span>
          <span class="text-[var(--console-file-link)]">{props.node.tag}</span>
          <span class="text-[var(--panel-text)]">&gt;</span>
        </div>
      </Show>
    </div>
  );
}
