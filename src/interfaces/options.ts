import { Placement } from '@popperjs/core';

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


export type OptionConfig = {
  placement: Placement,
  triggerType: string, // TODO
  closeOnContentClick?: boolean;
  onShow: Function,
  onHide: Function
};
