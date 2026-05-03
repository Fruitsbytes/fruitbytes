// PORT TARGET: a fresh, personal-website take on the Welcome page right-panel
// inspector. Jeffrey rendered as a custom-element DOM tree with per-tab
// content for Bio / Stack / Routine / Triggers / Compat.
// Per plan: C:\Users\bleus\.claude\plans\ok-now-let-focus-jaunty-narwhal.md

export interface BioContent {
  summary: string;
  facts?: Record<string, string>;
}

export interface StackGroup {
  group: string;
  items: Array<{ name: string; level: 1 | 2 | 3 | 4 | 5 }>;
}

export interface RoutineSegment {
  label: string;
  pct: number;
  color: string;
}

export interface TriggerEntry {
  event: string;
  action: string;
}

export interface CompatContent {
  languages?: string[];
  timeZones?: string[];
  pairsWith?: string[];
  friction?: string[];
}

export interface JeffreyNode {
  tag: string;
  attrs?: Record<string, string>;
  selfClosing?: boolean;
  text?: string;
  children?: JeffreyNode[];
  // Per-node tab content. Falls back to the root's content when absent.
  bio?: BioContent;
  stack?: StackGroup[];
  routine?: RoutineSegment[];
  triggers?: TriggerEntry[];
  compat?: CompatContent;
}

export const JEFFREY_DOM: JeffreyNode = {
  tag: 'jeffrey-carre',
  attrs: { lang: 'en', theme: 'auto', status: 'employed', remote: 'ok' },
  children: [
    {
      tag: 'identity',
      children: [
        { tag: 'name', text: 'Jeffrey Nicholson Carré' },
        { tag: 'location', attrs: { lat: '45.50', lon: '-73.58' }, text: 'Montréal, QC' },
        { tag: 'speaks', text: 'en, fr, es, ht' },
      ],
    },
    {
      tag: 'skills',
      attrs: { priority: 'high' },
      children: [
        { tag: 'frontend', text: 'Angular, React, TypeScript, Three.js, StencilJS, Astro' },
        { tag: 'backend', text: 'PHP, Laravel, Node.js, Express' },
        { tag: 'design', text: 'UI/UX, Adobe CC, 3D modeling' },
        { tag: 'wireless', text: 'Ubiquiti UniFi, airMAX, network design' },
      ],
      // Skills selection focuses the Stack tab; stack content is the same data
      bio: {
        summary:
          'Frontend-leaning fullstack with deep Angular and React experience, plus 3D graphics, fintech backend, and wireless network design.',
      },
    },
    {
      tag: 'currently-at',
      attrs: { company: 'CGI Inc.', since: '2023' },
      children: [{ tag: 'role', text: 'Senior Consultant' }],
      bio: {
        summary:
          'Currently consulting at CGI Inc. on enterprise Angular applications. Lead frontend architecture, code reviews, and mentor junior developers.',
        facts: {
          role: 'Senior Consultant',
          team: 'Frontend / Angular',
          since: '2023',
          location: 'Montréal',
        },
      },
    },
    {
      tag: 'hobbies',
      children: [
        { tag: 'games', text: '3D, Indie, Retro' },
        { tag: 'reading', text: 'SF, Tech, Manga' },
        { tag: 'music', selfClosing: true },
        { tag: 'outdoors', selfClosing: true },
      ],
      bio: {
        summary:
          'Outside coding: video games (3D + indie), reading sci-fi and manga, music, and the outdoors when the weather agrees.',
      },
    },
    {
      tag: 'links',
      children: [
        { tag: 'a', attrs: { href: 'https://github.com/Fruitsbytes' }, text: 'github.com/Fruitsbytes' },
        {
          tag: 'a',
          attrs: { href: 'https://www.linkedin.com/in/jeffrey-nicholson-carre/' },
          text: 'linkedin.com/in/jeffrey-nicholson-carre',
        },
        { tag: 'a', attrs: { href: 'https://stackoverflow.com/users/1427338' }, text: 'stackoverflow.com/users/1427338' },
      ],
      bio: { summary: 'Find me on GitHub, LinkedIn, and Stack Overflow. DMs open.' },
    },
  ],

  // === Default content used when root <jeffrey-carre> is selected,
  //     and as fallback for any child node that doesn't override ===
  bio: {
    summary:
      'Senior Software Developer who fell in love with coding at 12. Born in Haïti, based in Montréal. Spent a decade building fintech for the Caribbean and Americas. Now consulting on enterprise Angular at CGI Inc. On the side: 3D graphics, video games, and the occasional wireless network.',
    facts: {
      role: 'Senior Software Developer',
      based: 'Montréal, QC',
      origin: 'Port-au-Prince, Haïti',
      since: '1997 (started coding)',
      pronouns: 'he/him',
    },
  },
  stack: [
    {
      group: 'Frontend',
      items: [
        { name: 'TypeScript', level: 5 },
        { name: 'Angular', level: 5 },
        { name: 'React', level: 4 },
        { name: 'Three.js', level: 4 },
        { name: 'Astro', level: 3 },
      ],
    },
    {
      group: 'Backend',
      items: [
        { name: 'PHP / Laravel', level: 4 },
        { name: 'Node.js', level: 4 },
        { name: 'MySQL', level: 4 },
      ],
    },
    {
      group: 'Design',
      items: [
        { name: 'UI/UX', level: 4 },
        { name: 'Adobe CC', level: 4 },
        { name: '3D modeling', level: 3 },
      ],
    },
    {
      group: 'Wireless',
      items: [
        { name: 'Ubiquiti UniFi/airMAX', level: 5 },
        { name: 'RF / Tower', level: 4 },
      ],
    },
  ],
  routine: [
    { label: 'Code', pct: 60, color: '#5a8dee' },
    { label: 'Meet', pct: 20, color: '#ff8080' },
    { label: 'Learn', pct: 10, color: '#5aff5f' },
    { label: 'Doc', pct: 5, color: '#ffd866' },
    { label: 'Reset', pct: 5, color: '#9aa0a6' },
  ],
  triggers: [
    { event: 'on:newPR', action: '→ review thoroughly, suggest improvements' },
    { event: 'on:bug', action: '→ reproduce, narrow down, fix the root cause' },
    { event: 'on:coffeeEmpty', action: '→ refill immediately' },
    { event: 'on:helpNeeded', action: '→ respond if context allows; loop in if not' },
    { event: 'on:lateMeeting', action: '→ 5 min grace, then ping' },
    { event: 'on:cleanCodebase', action: '→ smile' },
  ],
  compat: {
    languages: ['English', 'Français', 'Español', 'Kreyòl ayisyen'],
    timeZones: ['ET (UTC-5)', 'works async with global teams'],
    pairsWith: [
      'mixed senior+junior teams',
      'SOLID & DRY without dogma',
      'thoughtful code reviews',
      'design-system thinking',
    ],
    friction: ['waterfall without context', 'specs by ticket count', 'meetings without an agenda'],
  },
};

/** Walk the tree by an index path (e.g. [1, 0] = JEFFREY_DOM.children[1].children[0]). */
export function getNodeAtPath(path: number[]): JeffreyNode {
  let node: JeffreyNode = JEFFREY_DOM;
  for (const idx of path) {
    if (!node.children || idx < 0 || idx >= node.children.length) return node;
    node = node.children[idx];
  }
  return node;
}

/** Resolve per-tab content with fallback to the root. */
export function getBio(node: JeffreyNode): BioContent {
  return node.bio ?? JEFFREY_DOM.bio!;
}
export function getStack(node: JeffreyNode): StackGroup[] {
  return node.stack ?? JEFFREY_DOM.stack!;
}
export function getRoutine(node: JeffreyNode): RoutineSegment[] {
  return node.routine ?? JEFFREY_DOM.routine!;
}
export function getTriggers(node: JeffreyNode): TriggerEntry[] {
  return node.triggers ?? JEFFREY_DOM.triggers!;
}
export function getCompat(node: JeffreyNode): CompatContent {
  return node.compat ?? JEFFREY_DOM.compat!;
}
