import { Component, Host, h, Prop, EventEmitter, Event, Listen } from '@stencil/core';
import { SoundLibraryService } from '../../services/soundLibraryService';

@Component({
  tag: 'simple-link',
  styleUrl: 'simple-link.scss',
  shadow: true,
})
export class SimpleLink {

  @Prop() link: string = '/welcome#';
  @Prop() label: string = 'FruitsBytes';
  @Prop() state: Object = {};
  @Event({ eventName: 'state.pushed' }) StatePushed?: EventEmitter<{ state: any; title: string; url?: string | URL | null; }>;

  soundLib: SoundLibraryService = SoundLibraryService.instance();

  go = (e: MouseEvent) => {
    e.preventDefault();
    let url;
    try {
      url = new URL(this.link);
    } catch (_) {
      url = new URL(this.link, window.location.origin)
    }

    history.pushState(this.state, this.label, url);
    this.StatePushed?.emit({state: this.state, title: this.label, url})
  };

  @Listen('mouseenter')
  bip(){
    this.soundLib.sounds.jumpSoft.play();
  }

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
