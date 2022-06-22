export interface BackDropOptions {
  id: string;
  target?: 'menu' | 'modal';
  opened?: boolean;
  shield?: boolean;
  zIndex?: number;
  cursor?: string;
  override?: {
    background?: string;
    opacity?: number;
  }
}
