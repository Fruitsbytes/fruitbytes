import { Component, Element, EventEmitter, h, Host, Listen, Prop, State, Event } from '@stencil/core';
import { BackDropOptions } from '../../interfaces/options';
import { Log } from '../../interfaces/log';
import { isOverflown } from '../../utils';
import { MenuItem } from '../../interfaces/menuItem';
import { MENU_ITEMS } from '../../config';


@Component({
  tag: 'right-panel',
  styleUrl: 'right-panel.scss',
  shadow: true,
})
export class RightPanel {
  @Element() el: HTMLElement;
  @State() width = 449;
  @State() logs: Array<Log> = [];
  @State() menuItems: Array<MenuItem> = [];
  @Prop() isOpened: boolean;
  @Event({ eventName: 'menu.opened' }) Opened: EventEmitter<Partial<BackDropOptions> | undefined>;
  @Event({ eventName: 'menu.closed' }) Closed: EventEmitter<Partial<BackDropOptions> | undefined>;
  @Event({ eventName: 'menu.resizing' }) Resizing: EventEmitter<string>;
  @Event({ eventName: 'menu.resized' }) Resized: EventEmitter<string>;

  isResizing: boolean = false;
  consoleNeedsScoll: boolean = false;

  private handle: HTMLElement;
  private crunchingMenu: HTMLElement;

  connectedCallback() {
    this.logs.push({
      payload: '<logo-text></logo-text>',
      line: 1,
      time: new Date(),
      file: 'logo.txt',
      message: '<b class="green">Welcome!</b>',
    });
    this.width = 450;
    this.menuItems = MENU_ITEMS.map((i, index) => {
      let isActive;
      if (!location.pathname && index === 0) {
        isActive = true;
      } else {
        isActive = location.pathname === i.path;
      }
      return { ...i, active: isActive };
    });
  }


  componentDidLoad() {

    this.handle = this.el.shadowRoot.querySelector('#drag');
    this.crunchingMenu = this.el.shadowRoot.querySelector('#crunching-menu');

    if (!!this.handle) {
      this.handle.onmouseup = () => {
        this.isResizing = false;
      };
    } else {
      console.warn('Drag not supportes');
    }

    window.addEventListener('popstate', (event) => {
      console.log('----fdf', event);
    });

    setTimeout(() => {
      this.splitMenus();
    });
  }

  private handleOnMouseDown = () => {
    this.Resizing.emit('fruits-bytes-menu');
    this.isResizing = true;
  };

  @Listen('console.logged', { target: 'document', capture: true })
  log(e: CustomEvent<Log>) {
    this.logs = [...this.logs, e.detail];
    this.consoleNeedsScoll = true;
  }

  @Listen('mouseup', { target: 'document' })
  handleOnMouseUp() {
    if (!this.isResizing) {
      return;
    }
    this.isResizing = false;
    this.Resized.emit('fruits-bytes-menu');
  };

  @Listen('mousemove', { target: 'document' })
  handleOnMouseMove(e) {
    if (!this.isResizing) {
      return;
    }
    this.width = window.innerWidth - e.clientX;
    this.splitMenus();
  }

  @Listen('state.pushed', { target: 'document', capture: true })
  onRouteChange(e) {
    const { url } = e.detail;

    let selectedPath, items = [];
    selectedPath = url;

    for (const item of this.menuItems) {
      if (item.path === url) {
        selectedPath = { ...item, active: true };
        items.push(selectedPath);
      } else {
        items.push({ ...item, active: false });
      }
    }
    this.menuItems = items;
    this.splitMenus();
  }

  private _closeMenu = () => {
    this.Closed.emit(
      {
        id: 'fruits-bytes-menu',
      },
    );
  };

  private clearConsole = () => {
    this.logs = [];
  };

  private splitMenus() {
    const menuItems = [...this.menuItems];
    if (typeof menuItems[0].width === typeof undefined) {
      for (const [i, menuItem] of menuItems.entries()) {
        const attr = `[data-key='${menuItem.key}']`;
        const el: HTMLElement = this.crunchingMenu.querySelector(attr);
        if (el) {
          menuItems[i].width = el.getBoundingClientRect().width;
        }
      }
      this.menuItems = menuItems;
    }
    const selected: number = menuItems.findIndex(i => i.active);
    if (selected < 0) {
      return;
    }

    console.log(selected);
    let newLength = 30;

    const max = this.crunchingMenu.clientWidth;


    if (isOverflown(this.crunchingMenu)) {
      let isFull = false;
      for (const [i, menuItem] of menuItems.entries()) {
        if (isFull) {
          if (i !== selected) {
            menuItems[i].hidden = true;
          }
        } else {
          if (i === 0) {
            newLength += menuItems[selected].width;
            if (newLength > max) {
              menuItems[selected].hidden = true;
              isFull = true;
            } else {
              menuItems[selected].hidden = false;
              if (i === selected) {
                continue;
              }
              newLength += menuItem.width;
              if (newLength > max) {
                menuItems[i].hidden = true;
                isFull = true;
              } else {
                menuItems[i].hidden = false;
              }
            }
          } else {
            if (i === selected) {
              menuItems[i].hidden = false;
            } else {
              newLength += menuItem.width;
              if (newLength > max) {
                menuItems[i].hidden = true;
                isFull = true;
              } else {
                menuItems[i].hidden = false;
              }
            }

          }
        }
      }
      this.logs.push({
        message: 'Shrinked <b>top-menu</b>.',
        line: 258,
        time: new Date(),
        file: 'console.ts',
      });

      this.menuItems = [...menuItems];
    } else {
      let updated = false;

      for (const [j, _menuItem] of this.menuItems.entries()) {
        if (j === 0) {
          newLength += menuItems[selected].width;

          if (newLength <= max) {
            updated = true;
            menuItems[selected].hidden = false;
            if (j === selected) {
              continue;
            }
            newLength += menuItems[j].width;
            if (newLength > max) {
              break;
            }
            menuItems[j].hidden = false;
          } else {
            break;
          }

        } else {
          if (j === selected) {
            continue;
          }
          newLength += menuItems[j].width;
          if (newLength > max) {
            break;
          }
          menuItems[j].hidden = false;
          updated = true;
        }
      }

      if (updated) {
        // TODO better update logic
        // this.logs.push({
        //   message: 'Expanded <b>top-menu</b>.',
        //   line: 260,
        //   time: new Date(),
        //   file: 'console.ts',
        // });
        this.menuItems = [...menuItems];
      }
    }
  }

  componentDidUpdate() {
    if (this.consoleNeedsScoll) {
      this.consoleNeedsScoll = false;
      const objDiv = this.el.shadowRoot.querySelector('#console');
      objDiv.scrollTop = objDiv.scrollHeight;
    }
  }

  render() {

    return (
      <Host style={{
        width: this.width + 'px',
        transform: `translateX(${this.isOpened ? 0 : this.width}px)`,
      }}>
        <div id='drag'
             onMouseDown={this.handleOnMouseDown}
             class='resize-line resize-left-line'></div>

        <div class='top-menu'>
          <simple-link link='/welcome' title={'Home'}>
            <div class='menu-item icon-menu-item' style={{ marginLeft: '6px' }}>
              <span class='material-symbols-rounded'>home</span>
            </div>
          </simple-link>
          <div class='menu-item icon-menu-item'>
            <span class='icon material-symbols-rounded'>devices</span>
          </div>
          <div class='v-divider'></div>

          <div id='crunching-menu'>
            {
              this.menuItems.map(l => <span data-key={l.key} key={l.key}><simple-link link={l.path} title={l.title}>
                <div class={{ 'menu-item button': true, 'selected': l.active, hidden: l.hidden }}>
                  <span>{l.title}</span>
                </div>
              </simple-link>
              </span>)
            }

            {
              !!this.menuItems.find(l => l.hidden) ? (
                <div data-isChev={true} class='menu-item button more'>
                  <i>
                    <i class='material-symbols-rounded'>chevron_right</i>
                    <i class='material-symbols-rounded'>chevron_right</i>
                  </i>
                </div>
              ) : null
            }


          </div>


          <div class='right-top-nav'>
            <div class='menu-item icon-menu-item'>
              <span class='icon material-symbols-rounded filled'>settings</span>
            </div>
            <div class='menu-item icon-menu-item'>
              <span class='material-symbols-rounded thick more'>more_vert</span>
            </div>
            <div class='menu-item icon-menu-item' onClick={this._closeMenu}>
              <span class='material-symbols-rounded thick close'>close</span>
            </div>
          </div>

        </div>
        <div class='sub-menu'>
          <div class='menu-item icon-menu-item' style={{ marginLeft: '6px' }} title='Clear console.'
               onClick={this.clearConsole}>
            <i class='material-symbols-rounded thick clear'>block</i>
          </div>
        </div>

        {
          location.pathname !== '/console-log' ?
            null : (
              <div class='console' id='console'>
                {
                  this.logs.map(l => {
                    return <div class={{ p: true, withPayload: !!l.payload }}>
                      <div>
                        <span class={`message message-${l.level || 'default'}`} innerHTML={l.message}></span>
                        <span class='file'>{l.file}:{l.line}</span>
                      </div>
                      <div class='payload' style={{ maxWidth: `${this.width - 10}px` }} innerHTML={l.payload}></div>
                    </div>;
                  },
                  )
                  }
                  <div class='p new'>
                  <span class='caret'> {'>'} </span>
                  <input type='text' />
                  </div>
                  </div>
                  )
                }

              </Host>
            );
        }

        }
