import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'page-not-found',
  styleUrl: 'page-not-found.css',
  shadow: true,
})
export class PageNotFound {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
