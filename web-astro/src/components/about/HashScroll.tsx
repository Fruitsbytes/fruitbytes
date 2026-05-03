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
        const offset = 80;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }, 100);
    };

    if (window.location.hash) scrollToHash(window.location.hash);

    const onHash = () => scrollToHash(window.location.hash);
    window.addEventListener('hashchange', onHash);
    onCleanup(() => window.removeEventListener('hashchange', onHash));
  });

  return null;
}
