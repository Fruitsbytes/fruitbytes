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

