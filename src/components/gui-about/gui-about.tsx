import { Component, Host, h, Prop, Watch } from '@stencil/core';

@Component({
  tag: 'gui-about',
  styleUrl: 'gui-about.scss',
  shadow: true,
})
export class GuiAbout {

  @Prop() menuOpened!: boolean;
  @Prop() menuWidth!: number;
  @Prop() hash!: string | undefined;

  @Watch('hash')
  goto(newValue: string, _oldValue: string) {
    console.log(newValue);
  }

  render() {
    return (
      <Host style={{ width: `calc(100vw - ${this.menuOpened ? this.menuWidth : 0}px)`, top: '0px' }}>

        <div class='paper-holder animate__animated animate__fadeInDown'>
          <div class='paper shadow-lg text-gray-900 bg-gray-50'>
            <section id='about'>

              <h1 class='text-gray-300 font-extralight'>About Me</h1>
              <div class='avatar'></div>
              <div class='name text-center text-lg text-blue-900'>Jeffrey Nicholson Carré</div>
              <div class='mx-auto text-center' style={{ maxWidth: '400px' }}>
                <span
                  class='bg-gray-100 text-gray-800 text-xs font-semibold inline-block mr-1 mb-1 px-2.5 py-0.5 rounded'>Senior Software Developer</span>
                <span
                  class='bg-gray-100 text-gray-800 text-xs font-semibold inline-block mr-1 mb-1 px-2.5 py-0.5 rounded'>FullStack</span>
                <span
                  class='bg-gray-100 text-gray-800 text-xs font-semibold inline-block mr-1 mb-1 px-2.5 py-0.5 rounded'>Frontend</span>
                <span
                  class='bg-gray-100 text-gray-800 text-xs font-semibold inline-block mr-1 mb-1 px-2.5 py-0.5 rounded'>Video Games</span>
                <span
                  class='bg-gray-100 text-gray-800 text-xs font-semibold inline-block mr-1 mb-1 px-2.5 py-0.5 rounded'>Haiti</span>
                <span
                  class='bg-gray-100 text-gray-800 text-xs font-semibold inline-block mr-1 mb-1 px-2.5 py-0.5 rounded'>Wireless Network</span>
                <span
                  class='bg-gray-100 text-gray-800 text-xs font-semibold inline-block mr-1 mb-1 px-2.5 py-0.5 rounded'>Graphic Design</span>
                <span
                  class='bg-gray-100 text-gray-800 text-xs font-semibold inline-block mr-1 mb-1 px-2.5 py-0.5 rounded'>Freelance</span>
                <span
                  class='bg-gray-100 text-gray-800 text-xs font-semibold inline-block mr-1 mb-1 px-2.5 py-0.5 rounded'>Web</span>
              </div>

              <div class='text-center'>
                <social-links class='text-gray-100' style={{ filter: 'invert(1)' }}></social-links>
              </div>

              <div id='info'>
                <h3 class='mb-3'>
                  <span class='border-b-4 border-green-500'>Info</span>
                </h3>

                <div class='content grid grid-cols-4 grid-rows-1 divide-x divide-gray-200 rounded rounded-md p-2 border border-gray-200'>
                  <div>
                    <label htmlFor='info-location'>Location</label>
                    <p id='info-location'>Haïti</p>
                  </div>
                  <div class='col-span-2 pl-2'>
                    <label htmlFor='info-email'>Email</label>
                    <p id='info-email'>
                      <a href='mailto:jeffrey.carre@anbapyezanman.com'>jeffrey.carre@anbapyezanman.com</a>
                    </p>
                  </div>
                  <div class='pl-2'>
                    <label htmlFor='info-location'>Phone</label>
                    <p id='info-location'>
                      <a href='tel:+50937024301'>+509 37 02 4301</a>
                    </p>
                  </div>
                </div>
              </div>

              <div id='info' class='mt-4'>
                <h3 class='mb-3'>
                  <span class='border-b-4 border-green-500'>Bio</span>
                </h3>
                <div class='content'>
                  <p>
                    I am a graphic designer that fell in love with coding when I was 12(1997). After the 2010
                    earthquake, I halted my civil engineering studies (last year- last month) to fully embrace my
                    passion and I never looked back. So far it has been an amazing adventure where I got to solve
                    real-life challenges for people in the most precarious situations.
                  </p>
                  <p class='mt-2'>I have since then finished my studies and got my degree (finally). Right now, I am
                    focusing on
                    frontend development, mostly 3D animation/graphics, video game creation and augmented reality HUD
                    (heads-up display).</p>
                </div>
              </div>
            </section>

            <div class='page'>1</div>
          </div>
          <div class='paper shadow-lg text-gray-900 bg-gray-50'>
            <section id='employment-history'>
              <h2>Employment History</h2>

              <div
                class='content grid grid-cols-1 divide-y divide-gray-200 rounded-md p-2 border border-gray-200'>
                <div class='content grid grid-cols-12 pb-4'>
                  <div class='pt-4 text-center col-span-2' id='transversal'>
                    <div class='date  font-mono text-orange-600'>
                      Sept 2021
                    </div>
                    <div class='location text-gray-500'>
                      Port-au-Prince
                    </div>
                  </div>
                  <div class='col-span-10'>
                    <h3 class='my-0'>Consultant <span class='company text-green-800'>
                      <span class='text-gray-300 text-2xl'>@</span>Transversal</span>
                    </h3>
                    <small class='mb-3'><a href='https://www.transversal.ht'>https://www.transversal.ht</a></small>
                    <p class='mt-2'> Oversee new projects and maintain/upgrade old company projects.</p>
                  </div>
                </div>

                <div class='content grid grid-cols-12 pb-4'>
                  <div class='pt-4 text-center col-span-2'>
                    <div class='date font-mono text-orange-600'>
                      Apr 2013<br />
                      —<br />
                      Sept 2021
                    </div>
                    <div class='location text-gray-500'>
                      Port-au-Prince
                    </div>
                  </div>
                  <div class='col-span-10'>
                    <h3 class='mt-0'>CTO <span class='company text-green-800'>
                      <span class='text-gray-300 text-2xl'>@</span>Transversal</span>
                    </h3>
                    <small class='mb-3'><a href='https://www.transversal.ht'>https://www.transversal.ht</a></small>
                    <h4>Software developer</h4>
                    <p>
                      Actively participated in the development and managed multiple fintech products mostly
                      involving mobile money and financial inclusion.
                    </p>
                    <p> I worked on multiple timezones with international clients/partners.</p>
                    <p> I developed mobile apps, front-end, and back-end interfaces, APIs... always making sure it was
                      adapted to the low electronic literacy of the end-users and the precarious conditions where
                      we were going to deploy our systems. We also had to manage multiple languages to send
                      SMS/USSD in addition to regular push notifications.
                    </p>
                    <p> Our main platform processed 200million USD in voucher transactions. We mostly worked with banks,
                      the haïtian government, and NGO
                    </p>

                    <ul class='list-disc list-inside'>
                      The stacks were not always the same but I got to work with:
                      <li>PHP - Doctrine - MySQL - Laravel - Lumen</li>
                      <li>AngularJS - Angular</li>
                      <li>ReactJS</li>
                      <li>IonicFramework - ReactNative</li>
                      <li>Linux dedicated server - AWS</li>
                    </ul>

                    <h4>Wireless Network Tech/Trainer</h4>

                    <p>For a long time I was the only french trainer for the Caribbean and America for Ubiquiti Inc
                      (NSE: UI). Supervised and worked on
                      multiple installations in remote areas all over the country.</p>
                  </div>
                </div>

                <div class='content grid grid-cols-12 pb-4'>
                  <div class='pt-4 text-center col-span-2' id='transversal'>
                    <div class='date  font-mono text-orange-600'>
                      Jan 2020<br/>
                      —<br/>
                      Feb 2021
                    </div>
                    <div class='location text-gray-500'>
                      New York
                    </div>
                  </div>
                  <div class='col-span-10'>
                    <h3 class='my-0'>Software Dev <span class='company text-green-800'>
                      <span class='text-gray-300 text-2xl'>@</span>Global Hawk</span>
                    </h3>
                    <small class='mb-3'>
                      <a class='line-through' href='https://gbhawk.net'>https://gbhawk.net</a> -{'>'}
                      <a href='https://zeno.fm/zeno-plus/'>https://zeno.fm/zeno-plus/</a>
                    </small>

                    <h4>Senior Software<br/> Developer(Freelancer)</h4>

                    <p class='mt-2'> I developed the Global Recharge App ( web, ios, android).</p>

                    <ul class='list-disc list-inside'>
                      For that project I decided to work with:
                      <li>Firebase - Google Cloud Platform</li>
                      <li>NodeJS - ExpressJS</li>
                      <li>Angular - IonicFramework</li>
                    </ul>

                    <p>I managed the team migrating the app to the new owning company.</p>
                  </div>
                </div>

              </div>
            </section>
            <div class='page'>2</div>
          </div>
        </div>

      </Host>
    );
  }

}
