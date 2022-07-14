import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'gui-about',
  styleUrl: 'gui-about.css',
  shadow: true,
})
export class GuiAbout {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
