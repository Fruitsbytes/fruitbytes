// PORT TARGET: ABOUT_SECTION constant from web-stencil/src/config.ts
// Hierarchical menu structure for the right-panel inspector when route
// is /about-me. Top-level groups are sections; children are hash anchors
// matching the corresponding `id` on /about-me sections.

export interface AboutMenuItem {
  title: string;
  hash?: string;
  icon?: string;
  children?: AboutMenuItem[];
}

export const ABOUT_SECTION: AboutMenuItem[] = [
  {
    title: 'About',
    children: [
      { icon: 'description', title: 'Bio', hash: 'bio' },
      { icon: 'info', title: 'Info', hash: 'info' },
      { icon: 'link', title: 'Social links', hash: 'links' },
    ],
  },
  {
    title: 'Employment History',
    children: [
      { icon: 'business_center', title: 'CGI Inc.', hash: 'cgi' },
      { icon: 'business_center', title: 'Transversal S.A. (Consultant)', hash: 'transversal-consultant' },
      { icon: 'business_center', title: 'Transversal S.A. (CTO)', hash: 'transversal-cto' },
      { icon: 'business_center', title: 'Global Hawk', hash: 'global-hawk' },
    ],
  },
  {
    title: 'Education',
    children: [
      { icon: 'school', title: "Faculté des Sciences de l'Université d'État d'Haïti", hash: 'FDS' },
      { icon: 'school', title: 'Institution Saint Louis de Gonzague', hash: 'SLG-2' },
      { icon: 'school', title: 'Institution Saint Louis de Gonzague (MS)', hash: 'SLG-1' },
    ],
  },
  {
    title: 'Certifications',
    children: [
      { icon: 'workspace_premium', title: 'Civil Engineer', hash: 'GC' },
      { icon: 'workspace_premium', title: 'Ubiquiti Network Trainer', hash: 'ubnt' },
      { icon: 'workspace_premium', title: 'Tower climbing professional', hash: 'tower' },
    ],
  },
  {
    title: 'Skills',
    children: [
      { icon: 'code', title: 'Frontend Software Development', hash: 'frontend-dev' },
      { icon: 'code', title: 'Backend Software Development', hash: 'backend-dev' },
      { icon: 'design_services', title: 'Graphic Design', hash: 'graphic-design' },
      { icon: 'wifi', title: 'Wireless Tech & Instructor', hash: 'wireless' },
      { icon: 'developer_board', title: 'Leadership & Management', hash: 'management' },
    ],
  },
  {
    title: 'Hobbies & Preferences',
    children: [
      { icon: 'sports_esports', title: 'Games', hash: 'hobby-1' },
      { icon: 'theaters', title: 'Movies & TV shows', hash: 'hobby-2' },
      { icon: 'space_dashboard', title: 'Manga & Anime', hash: 'hobby-3' },
      { icon: 'book', title: 'Reading', hash: 'hobby-4' },
      { icon: 'nature', title: 'Outdoors', hash: 'hobby-5' },
      { icon: 'music_note', title: 'Music', hash: 'hobby-6' },
    ],
  },
];
