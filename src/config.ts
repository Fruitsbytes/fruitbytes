import { MenuItem } from './interfaces/menuItem';

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
