import { MenuItem, MenuItem2 } from './interfaces/menuItem';

export const MENU_ITEMS: Array<MenuItem> = [
  {
    key: 'welcome',
    title: 'Home',
    path: '/welcome',
  },
  {
    key: 'console',
    title: 'Console',
    path: '/console-log',
  },
  {
    key: 'about',
    title: 'About',
    path: '/about-me',
  },
  {
    key: 'contact',
    title: 'Contact',
    path: '/contact-me',
  },
  {
    key: 'blog',
    title: 'Blog',
    path: '/my-blog',
  },
  {
    key: 'projects',
    title: 'Projects',
    path: '/my-projects',
  },

];

export const AVAILABLE_PATHS = MENU_ITEMS.map( i=> i.path);

export const DEFAULT_MENU_WIDTH = 600;

export  const colors = [
  '#1cbdec', '#63ff6e', '#f9fb21',
  '#ff9c59', '#f46b86', '#009158',
  '#fffc05', '#ff716c', '#9b21a4',
  '#4e3b7b',
];


export enum Z_INDEX {
  BACKDROP = 15,
  MENU = 25,
  MENU_BACKDROP = 20,
  MENU_BACKDROP_ELEVATED = 29,
  MODAL = 35,
  MODAL_BAKDROP = 30
}

export enum MenuEvents {
  opened = 'menu.opened',
  closed = 'menu.closed',
  resizingStarted = 'menu.resizing',
  resizingEnded = 'menu.resized'
}

export enum ModalEvents {
  opened = 'modal.opened',
  closed = 'modal.closed',
}

export const WAIT_READY_TIME =  1500;

export const PROGRAMING_LANGUAGE = [
  {
    name: "TI-BASIC 89",
    level: .7,
    firstUsed: new Date('September 2001')
  }
];

export const ABOUT_SECTION: MenuItem2[] = [
  {
    title: 'About',
    children: [
      {
        icon: 'description',
        title: 'Bio',
        hash: 'bio',
      },
      {
        icon: 'info',
        title: 'Info',
        hash: 'info',
      },
      {
        icon: 'link',
        title: 'Social links',
        hash: 'links',
      },
    ],
  },
  {
    title: 'Employment History',
    children: [
      {
        icon: 'business_center',
        title: 'Transversal S.A.',
        hash: 'employment-1',
      },
      {
        icon: 'business_center',
        title: 'Fondation Réseau Développement Durable Haïtien',
        hash: 'employment-2',
      },
      {
        icon: 'business_center',
        title: 'Freelancing',
        hash: 'freelancing',
      },

    ],
  },
  {
    title: 'Education',
    children: [
      {
        icon: 'school',
        title: 'Faculté des Sciences de l\'Université d\'État d\'Haïti',
        hash: 'FDS',
      },
      {
        icon: 'school',
        title: 'Institution Saint Louis de Gonzague',
        hash: 'SLG-2',
      },
      {
        icon: 'school',
        title: 'Institution Saint Louis de Gonzague',
        hash: 'SLG-1',
      },
    ],
  },
  {
    title: 'Certifications',
    children: [
      {
        icon: 'workspace_premium',
        title: 'Civil Engineer',
        hash: 'GC',
      },
      {
        icon: 'workspace_premium',
        title: 'Ubiquiti Network Trainer',
        hash: 'ubnt',
      },
      {
        icon: 'workspace_premium',
        title: 'Tower climbing profesional',
        hash: 'GC',
      },

    ],
  },
  {
    title: 'Skills',
    children: [
      {
        icon: 'code',
        title: 'Frontend Software Development',
        hash: 'frontend-dev',
      },
      {
        icon: 'code',
        title: 'Backend Software Development',
        hash: 'backend-dev',
      },
      {
        icon: 'design_services',
        title: 'Graphic Design',
        hash: 'graphic-design',
      },
      {
        icon: 'wifi',
        title: 'Wireless Tech & Instructor',
        hash: 'wireless',
      },
      {
        icon: 'developer_board',
        title: 'Leadership & Management',
        hash: 'management',
      },
    ],
  },
  {
    title: 'Hobbies & Preference',
    children: [
      {
        icon: 'sports_esports',
        title: 'Games',
        hash: 'hobby-1',
      },
      {
        icon: 'theaters',
        title: 'Movies & TV shows',
        hash: 'hobby-2',
      },
      {
        icon: 'space_dashboard',
        title: 'Manga & Anime',
        hash: 'hobby-3',
      },
      {
        icon: 'book',
        title: 'Reading',
        hash: 'hobby-4',
      },
      {
        icon: 'nature',
        title: 'Outdoors',
        hash: 'hobby-5',
      },
      {
        icon: 'music_note',
        title: 'Music',
        hash: 'hobby-6',
      },
    ],
  },

];
