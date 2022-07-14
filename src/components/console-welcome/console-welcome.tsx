import { Component, Host, h } from '@stencil/core';

import htmlTXT from './welcome.html.txt';
import phpTXT from './welcome.php.txt';
import hljs from 'highlight.js/lib/core';
import php from 'highlight.js/lib/languages/php';
import xml from 'highlight.js/lib/languages/xml';
import js from 'highlight.js/lib/languages/javascript';

hljs.registerLanguage('php', php);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('javascript', js);

@Component({
  tag: 'console-welcome',
  styleUrl: 'console-welcome.scss',
  shadow: true,
})
export class ConsoleWelcome {

  html!: string;
  php!: string;

  connectedCallback() {
    this.php = hljs.highlight(phpTXT, { language: 'php' }).value;
    this.html = hljs.highlight(htmlTXT, { language: 'xml' }).value;
  }

  render() {
    return (
      <Host>
         <pre>
              <code innerHTML={this.php}></code>
        </pre>
        <pre>
              <code innerHTML={this.html}></code>
        </pre>
      </Host>
    );
  }

}
