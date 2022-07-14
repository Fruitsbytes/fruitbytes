import { Component, Host, h, Prop, EventEmitter, Event, Listen } from '@stencil/core';
import { SoundLibraryService } from '../../services/soundLibraryService';

@Component({
  tag: 'simple-link',
  styleUrl: 'simple-link.scss',
  shadow: true,
})
export class SimpleLink {

  @Prop() link: string = '#';
  @Prop() label: string = 'FruitsBytes';
  @Prop() state: Object = {};
  @Event({ eventName: 'state.pushed' }) StatePushed?: EventEmitter<{ state: any; title: string; url?: string | URL | null; }>;

  soundLib: SoundLibraryService = SoundLibraryService.instance();

  go = (e: MouseEvent) => {
    e.preventDefault();
    //TODO analyze link
    history.pushState(this.state, this.label, this.link);
    this.StatePushed?.emit({state: this.state, title: this.label, url: this.link})
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
