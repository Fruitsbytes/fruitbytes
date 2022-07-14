import { Component, Host, h, Element, Prop, Listen } from '@stencil/core';
import { createPopper, Placement } from '@popperjs/core';
import { OptionConfig } from '../../interfaces/options';
import { Nullable } from '../../interfaces/geneneral-types';

const DEFAULT_CONFIG: OptionConfig = {
  placement: 'bottom',
  triggerType: 'click',
  onShow: () => {
  },
  onHide: () => {
  },
};


@Component({
  tag: 'dropdown-button',
  styleUrl: 'dropdown-button.css',
  shadow: true,
})
export class DropdownButton {

  @Element() el!: HTMLElement;
  @Prop() options: OptionConfig = DEFAULT_CONFIG;
  private _options: OptionConfig = DEFAULT_CONFIG;
  private _targetEl: Nullable<HTMLElement>;
  private _triggerEl: Nullable<HTMLElement>;
  private _visible: boolean = false;
  private _popperInstance: any;

  connectedCallback() {
    this._visible = false;
    this._options = { ...DEFAULT_CONFIG, ...this.options };

  }

  componentDidLoad() {

    this._triggerEl = this.el.querySelector<HTMLElement>('[data-dropdown-toggle]');

    if (this._triggerEl) {
      this._options.placement = this._triggerEl.getAttribute('data-dropdown-placement') as Placement;
      const id = this._triggerEl.getAttribute('data-dropdown-toggle');
      this._targetEl = this.el.querySelector<HTMLElement>(`#${id}`);
      if (this._targetEl)
        this._popperInstance = this._createPopperInstance(this._triggerEl, this._targetEl);
    }
  }


  _createPopperInstance(triggerEl: HTMLElement, targetEl: HTMLElement) {
    return createPopper(triggerEl, targetEl, {
      placement: this._options.placement,
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 10],
          },
        },
      ],
    });
  }

  @Listen('click')
  toggle() {
    if (!this._popperInstance) {
      return;
    }
    if (this._visible) {
      this.hide();
      // document.body.removeEventListener('click', this._handleClickOutside, true);
    } else {
      this.show();
    }
  }


  show() {
    if (!this._targetEl) {
      return;
    }
    this._targetEl.classList.remove('hidden');
    this._targetEl.classList.add('block');

    // Enable the event listeners
    // this._popperInstance.setOptions(options => ({
    //   ...options,
    //   modifiers: [
    //     ...options.modifiers,
    //     { name: 'eventListeners', enabled: true },
    //   ],
    // }));

    // document.body.addEventListener('click', (ev) => {
    //   this._handleClickOutside(ev, this._targetEl);
    // }, true);

    // Update its position
    this._popperInstance.update();
    this._visible = true;

    // callback function
    this._options.onShow(this);
  }

  @Listen('blur', { capture: true })
  hide() {
    if (!this._targetEl) {
      return;
    }
    this._targetEl.classList.remove('block');
    this._targetEl.classList.add('hidden');

    // Disable the event listeners
    this._popperInstance.setOptions((options: { modifiers: any; }) => ({
      ...options,
      modifiers: [
        ...options.modifiers,
        { name: 'eventListeners', enabled: false },
      ],
    }));

    this._visible = false;

    // callback function
    this._options.onHide(this);
  }

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
