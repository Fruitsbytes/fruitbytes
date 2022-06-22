export interface Log {
  line: number;
  message: string;
  file: string;
  time: Date;
  level?: 'info' | 'warning' | 'error' | 'default',
  payload?: any,
}
