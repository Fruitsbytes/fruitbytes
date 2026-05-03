// Mirrors web-stencil/src/components/gui-404/gui-404.tsx connectedCallback —
// logs an error entry into the console viewer when /404 mounts so the
// missing path shows up in the DevTools Console pane.

import { onMount } from 'solid-js';
import { addLog } from '../../stores/shell';

export default function NotFoundLogger() {
  onMount(() => {
    if (typeof window === 'undefined') return;
    addLog({
      message: `<span style="display:flex;gap:6px;"><span style="color:#ff8080">✘</span> Page <code style="color:#5a8dee">${window.location.pathname}</code> not found.</span>`,
      file: 'spike_spiegel.ts',
      time: new Date(),
      line: 404,
      level: 'error',
    });
  });
  return null;
}
