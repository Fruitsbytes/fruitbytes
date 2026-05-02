import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'main-footer',
  styleUrl: 'main-footer.scss',
  shadow: true,
})
export class MainFooter {
  @Prop() menuOpened!: boolean;
  @Prop() menuWidth!: number;
  @Prop() isMobile?: boolean = false;

  render() {
    const hostStyle = this.isMobile
      ? { width: '100vw', display: 'none' } // Hide footer on mobile to save space
      : { width: `calc(100vw - ${this.menuOpened ? this.menuWidth : 0}px)` };

    return (
      <Host class={{ 'mobile': this.isMobile || false, 'desktop': !this.isMobile }} style={hostStyle}>
        <footer
                class='footer bg-gray-400 backdrop-filter backdrop-blur-lg bg-opacity-10  firefox:bg-opacity-90'>
          <div>
            Built with 💖 and :
            <p style={{ fontSize: '.8rem' }}>
              <span>StencilJS</span> • <span>TypeScript</span> • <span>ThreeJS</span> • <span>enable3d</span> <br />
              <span>AmmoJS</span> • <span>Tailwind</span>
            </p>
          </div>
        </footer>
      </Host>
    );
  }

}
