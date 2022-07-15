import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'gui-about',
  styleUrl: 'gui-about.scss',
  shadow: true,
})
export class GuiAbout {

  @Prop() menuOpened!: boolean;
  @Prop() menuWidth!: number;

  render() {
    return (
      <Host style={{ width: `calc(100vw - ${this.menuOpened ? this.menuWidth : 0}px)`, top: '0px' }}>
        <slot></slot>
      </Host>
    );
  }

}
