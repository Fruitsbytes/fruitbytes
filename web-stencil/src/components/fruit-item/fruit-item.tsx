import { Component, Host, h, Prop, Element, Watch } from '@stencil/core';
import {  getRandomInt, hexToRgb } from '../../utils';
import { colors } from '../../config';

@Component({
  tag: 'fruit-item',
  styleUrl: 'fruit-item.scss',
  shadow: true,
})
export class FruitItem {

  @Prop() type: number = 0;
  @Prop() flavor: number = 0;
  @Prop() crystal: boolean = false;
  @Element() el!: HTMLElement;

  componentDidLoad() {
    this.draw();
  }

  @Watch('crystal')
  @Watch('flavor')
  @Watch('type')
  draw() {

    const host: HTMLElement = this.el.shadowRoot?.host as HTMLElement;
    if (this.crystal) {
      const hex = colors[getRandomInt(0, colors.length - 1)];
      const [r, g, b] = hexToRgb(hex);
      const border = `2px solid rgba(${r}, ${g}, ${b},.3)`;
      host.style.setProperty('--fruit-background-color', hex);
      host.style.setProperty('--fruit-border', border);
      host.style.margin = '2px';
    }
    host.style.setProperty('--fruit-background-position-x', `-${this.type * 16}px`);
    host.style.setProperty('--fruit-background-position-y', `-${this.flavor * 16}px`);

  }

  render() {
    return (
      <Host></Host>
    );
  }

}
