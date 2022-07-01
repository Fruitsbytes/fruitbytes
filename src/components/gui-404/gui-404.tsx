import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'gui-404',
  styleUrl: 'gui-404.css',
  shadow: true,
})
export class Gui404 {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
