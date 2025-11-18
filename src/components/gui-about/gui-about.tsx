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
                  class='bg-gray-100 text-gray-800 text-xs font-semibold inline-block mr-1 mb-1 px-2.5 py-0.5 rounded'>Montréal</span>
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
                    <p id='info-location'>Montréal, QC</p>
                  </div>
                  <div class='col-span-2 pl-2'>
                    <label htmlFor='info-email'>Email</label>
                    <p id='info-email'>
                      <a href='mailto:jeffrey.carre@anbapyezanman.com'>jeffrey.carre@anbapyezanman.com</a>
                    </p>
                  </div>
                  <div class='pl-2'>
                    <label htmlFor='info-phone'>Phone</label>
                    <p id='info-phone'>
                      <a href='tel:+15145699574'>+1 514 569 9574</a>
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

          <div class='paper shadow-lg text-gray-900 bg-gray-50'>
            <section id='education'>
              <h2>Education</h2>

              <div class='content grid grid-cols-1 divide-y divide-gray-200 rounded-md p-2 border border-gray-200'>
                <div class='content grid grid-cols-12 pb-4' id='FDS'>
                  <div class='pt-4 text-center col-span-2'>
                    <div class='date font-mono text-orange-600'>
                      2005<br />
                      —<br />
                      2014
                    </div>
                    <div class='location text-gray-500'>
                      Port-au-Prince
                    </div>
                  </div>
                  <div class='col-span-10'>
                    <h3 class='my-0'>Bachelor's degree, Civil Engineering</h3>
                    <small class='mb-3'>Faculté des Sciences de l'Université d'État d'Haïti</small>
                    <p class='mt-2'>Specialized in structural engineering and infrastructure development.</p>
                  </div>
                </div>

                <div class='content grid grid-cols-12 pb-4' id='SLG-2'>
                  <div class='pt-4 text-center col-span-2'>
                    <div class='date font-mono text-orange-600'>
                      2002<br />
                      —<br />
                      2005
                    </div>
                    <div class='location text-gray-500'>
                      Port-au-Prince
                    </div>
                  </div>
                  <div class='col-span-10'>
                    <h3 class='my-0'>High School Diploma (Philo)</h3>
                    <small class='mb-3'>Institution Saint Louis de Gonzague</small>
                    <p class='mt-2'>Philosophy program - Haitian Secondary Education.</p>
                  </div>
                </div>

                <div class='content grid grid-cols-12 pb-4' id='SLG-1'>
                  <div class='pt-4 text-center col-span-2'>
                    <div class='date font-mono text-orange-600'>
                      1999<br />
                      —<br />
                      2002
                    </div>
                    <div class='location text-gray-500'>
                      Port-au-Prince
                    </div>
                  </div>
                  <div class='col-span-10'>
                    <h3 class='my-0'>Middle School</h3>
                    <small class='mb-3'>Institution Saint Louis de Gonzague</small>
                    <p class='mt-2'>Secondary education foundation.</p>
                  </div>
                </div>
              </div>
            </section>

            <section id='certifications' class='mt-4'>
              <h2>Certifications</h2>

              <div class='content grid grid-cols-1 divide-y divide-gray-200 rounded-md p-2 border border-gray-200'>
                <div class='content grid grid-cols-12 pb-4' id='GC'>
                  <div class='pt-4 text-center col-span-2'>
                    <div class='date font-mono text-orange-600'>
                      2014
                    </div>
                  </div>
                  <div class='col-span-10'>
                    <h3 class='my-0'>Civil Engineer</h3>
                    <p class='mt-2'>Licensed Civil Engineer - Haiti</p>
                  </div>
                </div>

                <div class='content grid grid-cols-12 pb-4' id='ubnt'>
                  <div class='pt-4 text-center col-span-2'>
                    <div class='date font-mono text-orange-600'>
                      2015
                    </div>
                  </div>
                  <div class='col-span-10'>
                    <h3 class='my-0'>Ubiquiti Network Trainer</h3>
                    <p class='mt-2'>Certified trainer for Ubiquiti wireless networking solutions. Only French-speaking trainer in Caribbean and Americas region.</p>
                  </div>
                </div>

                <div class='content grid grid-cols-12 pb-4' id='tower'>
                  <div class='pt-4 text-center col-span-2'>
                    <div class='date font-mono text-orange-600'>
                      2014
                    </div>
                  </div>
                  <div class='col-span-10'>
                    <h3 class='my-0'>Tower Climbing Professional</h3>
                    <p class='mt-2'>Certified for telecommunications tower climbing and installation work.</p>
                  </div>
                </div>
              </div>
            </section>

            <div class='page'>3</div>
          </div>

          <div class='paper shadow-lg text-gray-900 bg-gray-50'>
            <section id='skills'>
              <h2>Skills</h2>

              <div class='content grid grid-cols-1 divide-y divide-gray-200 rounded-md p-2 border border-gray-200'>
                <div class='content pb-4' id='frontend-dev'>
                  <h3 class='mt-2 mb-3'>
                    <span class='material-symbols-sharp text-green-600'>code</span>
                    <span class='border-b-2 border-green-500'>Frontend Software Development</span>
                  </h3>
                  <p>Expert in modern frontend frameworks and technologies:</p>
                  <ul class='list-disc list-inside mt-2'>
                    <li>Angular, AngularJS, React, ReactNative</li>
                    <li>TypeScript, JavaScript (ES6+)</li>
                    <li>StencilJS, Web Components</li>
                    <li>Three.js, WebGL, 3D Graphics</li>
                    <li>Ionic Framework, Mobile Development</li>
                    <li>Tailwind CSS, SCSS, CSS-in-JS</li>
                    <li>State Management (RxJS, NgRx, Elf)</li>
                  </ul>
                </div>

                <div class='content pb-4' id='backend-dev'>
                  <h3 class='mt-2 mb-3'>
                    <span class='material-symbols-sharp text-green-600'>code</span>
                    <span class='border-b-2 border-green-500'>Backend Software Development</span>
                  </h3>
                  <p>Full-stack capabilities with backend technologies:</p>
                  <ul class='list-disc list-inside mt-2'>
                    <li>Node.js, Express.js</li>
                    <li>PHP, Laravel, Lumen, Doctrine</li>
                    <li>MySQL, PostgreSQL, IndexedDB</li>
                    <li>REST APIs, GraphQL</li>
                    <li>Firebase, Google Cloud Platform</li>
                    <li>AWS, Linux Server Administration</li>
                    <li>SMS/USSD Integration, Mobile Money APIs</li>
                  </ul>
                </div>

                <div class='content pb-4' id='graphic-design'>
                  <h3 class='mt-2 mb-3'>
                    <span class='material-symbols-sharp text-green-600'>design_services</span>
                    <span class='border-b-2 border-green-500'>Graphic Design</span>
                  </h3>
                  <p>Visual design and creative skills:</p>
                  <ul class='list-disc list-inside mt-2'>
                    <li>UI/UX Design</li>
                    <li>Adobe Creative Suite</li>
                    <li>3D Modeling & Animation</li>
                    <li>Motion Graphics</li>
                  </ul>
                </div>

                <div class='content pb-4' id='wireless'>
                  <h3 class='mt-2 mb-3'>
                    <span class='material-symbols-sharp text-green-600'>wifi</span>
                    <span class='border-b-2 border-green-500'>Wireless Technology & Instruction</span>
                  </h3>
                  <p>Wireless networking expertise:</p>
                  <ul class='list-disc list-inside mt-2'>
                    <li>Ubiquiti Networks (UniFi, airMAX, EdgeMAX)</li>
                    <li>Wireless Network Design & Deployment</li>
                    <li>Technical Training & Instruction</li>
                    <li>Tower Installation & Climbing</li>
                    <li>Remote Area Network Solutions</li>
                  </ul>
                </div>

                <div class='content pb-4' id='management'>
                  <h3 class='mt-2 mb-3'>
                    <span class='material-symbols-sharp text-green-600'>developer_board</span>
                    <span class='border-b-2 border-green-500'>Leadership & Management</span>
                  </h3>
                  <p>Team leadership and project management:</p>
                  <ul class='list-disc list-inside mt-2'>
                    <li>CTO Experience (8+ years)</li>
                    <li>Team Management & Mentoring</li>
                    <li>Project Planning & Execution</li>
                    <li>International Client Relations</li>
                    <li>Fintech Product Development</li>
                    <li>Multi-timezone Collaboration</li>
                  </ul>
                </div>
              </div>
            </section>

            <div class='page'>4</div>
          </div>

          <div class='paper shadow-lg text-gray-900 bg-gray-50'>
            <section id='hobbies'>
              <h2>Hobbies & Preferences</h2>

              <div class='content grid grid-cols-2 gap-4'>
                <div class='content pb-4' id='hobby-1'>
                  <h3 class='mt-2 mb-2'>
                    <span class='material-symbols-sharp text-green-600'>sports_esports</span>
                    <span class='border-b-2 border-green-500'>Games</span>
                  </h3>
                  <p>Passionate about video games, game development, and interactive experiences. Focus on 3D game creation and mechanics.</p>
                </div>

                <div class='content pb-4' id='hobby-2'>
                  <h3 class='mt-2 mb-2'>
                    <span class='material-symbols-sharp text-green-600'>theaters</span>
                    <span class='border-b-2 border-green-500'>Movies & TV Shows</span>
                  </h3>
                  <p>Enjoy cinema and television series, especially sci-fi, fantasy, and thriller genres.</p>
                </div>

                <div class='content pb-4' id='hobby-3'>
                  <h3 class='mt-2 mb-2'>
                    <span class='material-symbols-sharp text-green-600'>space_dashboard</span>
                    <span class='border-b-2 border-green-500'>Manga & Anime</span>
                  </h3>
                  <p>Avid follower of manga and anime, appreciating Japanese storytelling and art styles.</p>
                </div>

                <div class='content pb-4' id='hobby-4'>
                  <h3 class='mt-2 mb-2'>
                    <span class='material-symbols-sharp text-green-600'>book</span>
                    <span class='border-b-2 border-green-500'>Reading</span>
                  </h3>
                  <p>Regular reader with interests in science fiction, technology, and self-improvement.</p>
                </div>

                <div class='content pb-4' id='hobby-5'>
                  <h3 class='mt-2 mb-2'>
                    <span class='material-symbols-sharp text-green-600'>nature</span>
                    <span class='border-b-2 border-green-500'>Outdoors</span>
                  </h3>
                  <p>Appreciate outdoor activities, nature exploration, and physical challenges.</p>
                </div>

                <div class='content pb-4' id='hobby-6'>
                  <h3 class='mt-2 mb-2'>
                    <span class='material-symbols-sharp text-green-600'>music_note</span>
                    <span class='border-b-2 border-green-500'>Music</span>
                  </h3>
                  <p>Music enthusiast with diverse taste across multiple genres and cultures.</p>
                </div>
              </div>

              <div class='content mt-4 text-center text-gray-500'>
                <p>Updated November 2024 - Montréal, QC</p>
              </div>
            </section>

            <div class='page'>5</div>
          </div>
        </div>

      </Host>
    );
  }

}
