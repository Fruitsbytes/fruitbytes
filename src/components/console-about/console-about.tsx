import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'console-about',
  styleUrl: 'console-about.css',
  shadow: true,
})
export class ConsoleAbout {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
