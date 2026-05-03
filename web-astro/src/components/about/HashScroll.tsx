// Smooth-scroll to the hash target on initial load and on hashchange.
// Mirrors web-stencil/src/components/gui-about/gui-about.tsx scrollToElement().

import { onMount, onCleanup } from 'solid-js';

export default function HashScroll() {
  onMount(() => {
    if (typeof window === 'undefined') return;

    const scrollToHash = (hash: string) => {
      const id = (hash || '').replace('#', '');
      if (!id) return;
      // Allow paint to complete after navigation
      setTimeout(() => {
        const el = document.getElementById(id);
        if (!el) return;
        // <main> now owns the scroll (body is overflow:hidden), so target it
        // directly. scrollIntoView would also work but explicit math gives
        // us a tunable header offset.
        const main = document.getElementById('main-content');
        const offset = 24;
        if (main) {
          const elRect = el.getBoundingClientRect();
          const mainRect = main.getBoundingClientRect();
          const top = elRect.top - mainRect.top + main.scrollTop - offset;
          main.scrollTo({ top, behavior: 'smooth' });
        } else {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    };

    if (window.location.hash) scrollToHash(window.location.hash);

    const onHash = () => scrollToHash(window.location.hash);
    window.addEventListener('hashchange', onHash);
    const onAfterSwap = () => {
      if (window.location.hash) scrollToHash(window.location.hash);
    };
    document.addEventListener('astro:after-swap', onAfterSwap);
    onCleanup(() => {
      window.removeEventListener('hashchange', onHash);
      document.removeEventListener('astro:after-swap', onAfterSwap);
    });
  });

  return null;
}
