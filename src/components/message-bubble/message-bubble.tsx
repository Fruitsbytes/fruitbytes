import { Component, Host, h, Prop, Watch, Element, State, Listen } from '@stencil/core';
import { Nullable } from '../../interfaces/geneneral-types';

@Component({
  tag: 'message-bubble',
  styleUrl: 'message-bubble.scss',
  shadow: true,
})
export class MessageBubble {
  @Prop() message?: string;
  @Prop() character:Nullable<HTMLElement>;
  @Element() el: Nullable<HTMLElement>;
  @State() _message?: string;

  componentDidLoad() {
    this.draw();
  }

  @Listen('redraw.screen', { target: 'document', capture: true })
  _draw() {
    setTimeout(_ => {
      this.draw();
    });

  }

  @Watch('character')
  draw() {
    if (this.character) {
      const { height, top, left } = this.character.getBoundingClientRect();
      if (this.el) {
        this.el.style.top = `${top + height + 12}px`;
        this.el.style.left = `${left}px`;
      }
    }
  }

  @Watch('message')
  type() {
    if (!this.message) {
      return;
    }

    if (this.el) {
      this.el.style.display = 'flex';
    }
    this._message = '';
    setTimeout(async () => {
      const letters = this.message?.split('') || '';
      let i = 0;
      while (i < letters.length) {
        await new Promise(resolve => setTimeout(resolve, 150));
        this._message += letters[i];
        i++;
      }
      setTimeout(() => {
        if (this.el) this.el.style.display = 'none';
      }, 8000);
    });
  }

  render() {
    return (
      <Host style={{ zIndex: '10', display: this.message ? 'flex' : 'none' }}>
        {this._message}<span class='input-cursor'></span>
        <slot></slot>
      </Host>
    );
  }

}
