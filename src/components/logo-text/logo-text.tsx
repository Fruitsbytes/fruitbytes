import { Component, h, Host} from '@stencil/core';
import  * as txt from  './logo.txt';


@Component({
  tag: 'logo-text',
  styleUrl: 'logo-text.scss',
  shadow: true,
})
export class LogoText {

  fontSize: 12;
  lineHeight: 1.4;

  render() {

    return (
      <Host>
        <code>
  <span
    class='ascii' innerHTML={txt.default}
    style={{
      color: 'white',
      background: 'transparent',
      display: 'inline-block',
      whiteSpace: 'pre',
      letterSpacing: '0px',
      lineHeight: `${this.lineHeight}`,
      fontsize: `${this.fontSize}px`,
      fontFamily:
        '"Consolas","BitstreamVeraSansMono","CourierNew",Courier,monospace',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'transparent',
    }}
  >
  </span>
        </code>

      </Host>
    );
  }

}
