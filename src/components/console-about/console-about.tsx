import { Component, Host, h, Element, Listen, State, Event, EventEmitter } from '@stencil/core';
import { MenuItem2 } from '../../interfaces/menuItem';
import { ABOUT_SECTION } from '../../config';
import { ResumeService } from '../../services/resumeService';
import { PDFService } from '../../services/pdfService';
import { Log } from '../../interfaces/log';


function generateMenu(menuItems: MenuItem2[]): string {

  let parent = `<ul class='menu'>`;
  for (const menuItem of menuItems) {
    let li = '';
    if (menuItem.children) {
      li += `<li  class='menu-item menu-item-with-children ${menuItem.icon ? 'sub-section' : 'top-section'}'>`;
      if (menuItem.icon) {
        li += `<span class='menu-icon material-symbols-sharp'>${menuItem.icon}</span>`;
      }
      li += `<span class='menu-title'>${menuItem.title}</span>`;
      li += generateMenu(menuItem.children);
      li += '</li>';
    } else {
      li += `<simple-link link='/about-me#${menuItem.hash}'><li class='menu-item menu-link' data-hash='#${menuItem.hash}'>`;
      if (menuItem.icon) {
        li += `<span class='menu-icon material-symbols-sharp'>${menuItem.icon}</span>`;
      }
      li += `<span class='menu-title'>${menuItem.title}</span>`;
      li += '</li></simple-link>';
    }

    parent += li;
  }

  parent += `</ul>`;

  return parent;
}

let generatedMenu = generateMenu(ABOUT_SECTION);

@Component({
  tag: 'console-about',
  styleUrl: 'console-about.scss',
  shadow: true,
})
export class ConsoleAbout {

  @Element() el!: HTMLElement;
  @State() selectedRole: string = 'frontend';
  @State() selectedLanguage: string = 'en';
  @State() isDownloading: boolean = false;
  @State() errorMessage: string = '';
  @Event({ eventName: 'console.logged' }) log!: EventEmitter<Log>;

  private resumeService: ResumeService = ResumeService.instance();
  private pdfService: PDFService = PDFService.instance();

  componentDidLoad() {
    this.selectMenuItem();
    this.checkURLParams();
  }

  /**
   * Check URL parameters for auto-download
   */
  private checkURLParams() {
    const url = new URL(window.location.href);
    const downloadCV = url.searchParams.get('downloadCV');
    const lang = url.searchParams.get('lang');

    if (downloadCV) {
      this.selectedRole = downloadCV;
      if (lang) {
        this.selectedLanguage = lang;
      }
      // Auto-trigger download after a short delay
      setTimeout(() => this.handleDownload(), 500);
    }
  }

  @Listen('popstate', { target: 'window', capture: true })
  @Listen('state.pushed', { target: 'document' })
  selectMenuItem() {
    const url = new URL(window.location.href);
    const currentHash = url.hash;
    const links = this.el.shadowRoot?.querySelectorAll<HTMLElement>('.menu-link') || [];

    links.forEach((value, index) => {
      if ((!currentHash || currentHash === '#') && index === 0) {
        value.classList.remove('selected');
        return;
      }
      if (value.dataset.hash === currentHash) {
        value.classList.add('selected');
      } else {
        value.classList.remove('selected');
      }
    });

  }

  /**
   * Handle role selection change
   */
  private handleRoleChange = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    this.selectedRole = target.value;
    this.errorMessage = '';
  };

  /**
   * Handle language selection change
   */
  private handleLanguageChange = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    this.selectedLanguage = target.value;
    this.errorMessage = '';
  };

  /**
   * Handle download button click
   */
  private handleDownload = async () => {
    if (this.isDownloading) return;

    this.isDownloading = true;
    this.errorMessage = '';

    try {
      this.log?.emit({
        message: `📥 Generating CV for <strong>${this.selectedRole}</strong> in <strong>${this.selectedLanguage}</strong>...`,
        file: 'console-about.tsx',
        time: new Date(),
        line: 1,
        level: 'info',
      });

      // Fetch resume
      const resume = await this.resumeService.getResume(this.selectedRole, this.selectedLanguage);

      // Generate PDF
      const pdfBlob = await this.pdfService.generatePDF(resume.html, resume.metadata);

      // Download
      const filename = this.pdfService.generateFilename(this.selectedRole, this.selectedLanguage);
      this.pdfService.downloadPDF(pdfBlob, filename);

      this.log?.emit({
        message: `✅ <strong>CV downloaded successfully:</strong> ${filename}`,
        file: 'console-about.tsx',
        time: new Date(),
        line: 2,
        level: 'info',
      });
    } catch (error) {
      console.error('Error downloading CV:', error);
      this.errorMessage = 'Failed to generate CV. Please try again.';

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.log?.emit({
        message: `❌ <strong>Error generating CV:</strong> ${errorMessage}`,
        file: 'console-about.tsx',
        time: new Date(),
        line: 3,
        level: 'error',
      });
    } finally {
      this.isDownloading = false;
    }
  };

  /**
   * Handle copy link button click
   */
  private handleCopyLink = async () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const downloadUrl = `${baseUrl}?downloadCV=${this.selectedRole}&lang=${this.selectedLanguage}#download-cv`;

    try {
      await navigator.clipboard.writeText(downloadUrl);

      this.log?.emit({
        message: `📋 <strong>Link copied to clipboard:</strong> ${downloadUrl}`,
        file: 'console-about.tsx',
        time: new Date(),
        line: 4,
        level: 'info',
      });
    } catch (error) {
      console.error('Error copying link:', error);

      // Fallback: show the link in an alert
      alert(`Copy this link:\n${downloadUrl}`);

      this.log?.emit({
        message: `⚠️ Could not copy to clipboard. Link: ${downloadUrl}`,
        file: 'console-about.tsx',
        time: new Date(),
        line: 5,
        level: 'warning',
      });
    }
  };

  render() {
    return (
      <Host>
        <div innerHTML={generatedMenu} style={{  }}></div>
        <div class='cvs mt-auto px-3 mb-24'>

          <div class='rounded border p-2 my-3 bb relative'>
            <h1 class='font-medium text-lg flex justify-between py-1'>Download CV <pre
              class='text-sm text-orange-400 font-mono'>v1.0.1</pre></h1>

            <div class='grid grid-cols-5'>
              <div class='py-2 mr-2 col-span-3'>
                <label htmlFor='speciality' class='block mb-2 text-sm font-medium  text-gray-400'>Target</label>
                <select
                  id='speciality'
                  onInput={this.handleRoleChange}
                  disabled={this.isDownloading}
                  class='bb border text-sm rounded-lg bg-opacity-0 block w-full p-2.5 bg-gray-900 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500'>
                  <option value='frontend' selected={this.selectedRole === 'frontend'}>Frontend Software Developer</option>
                  <option value='fullStack' selected={this.selectedRole === 'fullStack'}>FullStack Software Developer</option>
                  <option value='wireless' selected={this.selectedRole === 'wireless'}>Wireless Network Engineer/Instructor</option>
                </select>
              </div>

              <div class='py-2  col-span-2'>
                <label htmlFor='lang' class='block mb-2 text-sm font-medium  text-gray-400'>Language</label>
                <select
                  id='lang'
                  onInput={this.handleLanguageChange}
                  disabled={this.isDownloading}
                  class='bb border text-sm rounded-lg block bg-opacity-0 w-full p-2.5 bg-gray-900 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500'>
                  <option value='en' selected={this.selectedLanguage === 'en'}>English</option>
                  <option value='fr' selected={this.selectedLanguage === 'fr'}>Français</option>
                  <option value='es' selected={this.selectedLanguage === 'es'}>Español</option>
                </select>
              </div>

              {this.errorMessage && (
                <div class='col-span-5 py-2'>
                  <p class='text-red-500 text-sm'>{this.errorMessage}</p>
                </div>
              )}

              <div class='mb-5 col-span-4 flex'>
                <button
                  onClick={this.handleDownload}
                  disabled={this.isDownloading}
                  class={`text-white flex items-center focus:ring-4 font-medium rounded-lg text-sm px-5 py-2 ${
                    this.isDownloading
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } focus:outline-none focus:ring-blue-800`}>

                  {this.isDownloading ? (
                    <svg class='w-6 h-6 animate-spin mr-2' fill='none' viewBox='0 0 24 24'>
                      <circle class='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' stroke-width='4'></circle>
                      <path class='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                    </svg>
                  ) : (
                    <svg class='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'
                         xmlns='http://www.w3.org/2000/svg'>
                      <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2'
                            d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'></path>
                    </svg>
                  )}
                  {this.isDownloading ? 'Generating...' : 'Download'}
                </button>
                <button
                  type='button'
                  onClick={this.handleCopyLink}
                  disabled={this.isDownloading}
                  class='ml-2 flex items-center justify-center hover:text-white border hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 text-center border-blue-500 text-blue-500 hover:bg-blue-600 focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed'>
                  <span class='material-symbols-rounded'>content_copy</span>
                  <span>Copy Link</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </Host>
    );
  }

}
