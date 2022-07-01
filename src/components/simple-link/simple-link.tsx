import { Component, Host, h, Prop, EventEmitter, Event } from '@stencil/core';

@Component({
  tag: 'simple-link',
  styleUrl: 'simple-link.scss',
  shadow: true,
})
export class SimpleLink {

  @Prop() link: string = '#';
  @Prop() label: string = 'FruitsBytes';
  @Prop() state: Object = {};
  @Event({ eventName: 'state.pushed' }) StatePushed: EventEmitter<{ state: any; title: string; url?: string | URL | null; }>;

  go = (e) => {
    e.preventDefault();
    //TODO analyze link
    history.pushState(this.state, this.label, this.link);
    this.StatePushed.emit({state: this.state, title: this.label, url: this.link})
  };

  render() {
    return (
      <Host>
        <a href={this.link} class='simple-link' onClick={this.go}>
          <slot></slot>
        </a>
      </Host>
    );
  }

}
