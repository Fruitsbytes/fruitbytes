export interface MenuItem {
  hidden?: boolean;
  key: string;
  title: string;
  path: string;
  active?: boolean;
  width?: number;
}

export interface MenuItem2 {
  icon?: string;
  title: string;
  hash?: string;
  selected?: boolean;
  children?: Array<MenuItem2>;
}
