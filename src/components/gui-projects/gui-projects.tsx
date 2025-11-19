import { Component, Host, h, Prop } from '@stencil/core';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  year: string;
  category: 'web' | 'mobile' | '3d' | 'fintech' | 'wireless';
  highlights: string[];
  link?: string;
}

@Component({
  tag: 'gui-projects',
  styleUrl: 'gui-projects.scss',
  shadow: true,
})
export class GuiProjects {
  @Prop() hash!: string;
  @Prop() menuOpened: boolean = true;
  @Prop() menuWidth!: number;

  private projects: Project[] = [
    {
      id: 'fruitsbytes',
      title: 'FruitsBytes Portfolio',
      description: 'A modern, interactive portfolio website featuring a Chrome DevTools-inspired interface with 3D graphics and physics simulations.',
      technologies: ['StencilJS', 'Three.js', 'Ammo.js', 'TypeScript', 'Tailwind CSS', 'Web Components'],
      year: '2024',
      category: '3d',
      highlights: [
        'Custom 3D physics engine integration with enable3d',
        'Responsive design with adaptive menu system',
        'Service worker for offline functionality',
        'SEO optimized with structured data',
        'Performance optimized with lazy loading',
      ],
      link: 'https://fruitsbytes.com',
    },
    {
      id: 'cgi-enterprise',
      title: 'Enterprise Angular Applications',
      description: 'Large-scale enterprise applications for major clients using Angular framework with complex state management and real-time features.',
      technologies: ['Angular', 'TypeScript', 'NgRx', 'RxJS', 'Material Design', 'REST APIs'],
      year: '2023-Present',
      category: 'web',
      highlights: [
        'Architected scalable frontend solutions for enterprise clients',
        'Implemented complex state management patterns',
        'Led technical design and code reviews',
        'Mentored junior developers on best practices',
      ],
    },
    {
      id: 'transversal-platform',
      title: 'Transversal Fintech Platform',
      description: 'Full-stack fintech platform enabling mobile money transactions, SMS/USSD integration, and real-time payment processing.',
      technologies: ['React', 'Node.js', 'PHP', 'Laravel', 'MySQL', 'Firebase', 'Mobile Money APIs'],
      year: '2013-2023',
      category: 'fintech',
      highlights: [
        'Built comprehensive payment processing system',
        'Integrated multiple mobile money providers',
        'Implemented SMS and USSD interfaces',
        'Managed team of 10+ developers',
        'Scaled platform to handle thousands of daily transactions',
      ],
    },
    {
      id: 'ubiquiti-training',
      title: 'Wireless Network Solutions',
      description: 'Designed and deployed wireless network infrastructure across remote areas, with focus on Ubiquiti UniFi and airMAX products.',
      technologies: ['Ubiquiti UniFi', 'airMAX', 'EdgeMAX', 'Network Design', 'RF Engineering'],
      year: '2014-2023',
      category: 'wireless',
      highlights: [
        'Only French-speaking trainer in Caribbean and Americas',
        'Conducted technical training sessions across multiple countries',
        'Designed networks for challenging terrain and remote locations',
        'Provided ongoing technical support and consultancy',
      ],
    },
    {
      id: 'react-native-apps',
      title: 'Mobile Applications',
      description: 'Cross-platform mobile applications using React Native and Ionic Framework for iOS and Android.',
      technologies: ['React Native', 'Ionic', 'Capacitor', 'TypeScript', 'Firebase', 'Push Notifications'],
      year: '2018-2023',
      category: 'mobile',
      highlights: [
        'Built and published apps on App Store and Google Play',
        'Implemented offline-first architecture',
        'Integrated native device features',
        'Achieved 4.5+ star ratings',
      ],
    },
    {
      id: '3d-visualizations',
      title: '3D Graphics & WebGL',
      description: 'Interactive 3D visualizations and graphics using Three.js, WebGL, and custom shaders for web applications.',
      technologies: ['Three.js', 'WebGL', 'GLSL Shaders', 'Blender', '3D Modeling'],
      year: '2020-Present',
      category: '3d',
      highlights: [
        'Created immersive 3D experiences in browser',
        'Optimized performance for mobile devices',
        'Implemented custom shader effects',
        'Integrated physics simulations',
      ],
    },
  ];

  private getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      web: 'blue',
      mobile: 'green',
      '3d': 'purple',
      fintech: 'orange',
      wireless: 'cyan',
    };
    return colors[category] || 'gray';
  }

  private getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      web: 'language',
      mobile: 'smartphone',
      '3d': 'view_in_ar',
      fintech: 'account_balance',
      wireless: 'wifi',
    };
    return icons[category] || 'code';
  }

  render() {
    return (
      <Host
        style={{
          width: `calc(100vw - ${this.menuOpened ? this.menuWidth : 0}px)`,
          transition: 'width ease-out 1s',
        }}
      >
        <div class='container max-w-6xl mx-auto my-48 px-6 py-8'>
          <header class='text-center mb-12'>
            <h1 class='text-5xl font-bold mb-4 gradient-text'>My Projects</h1>
            <p class='text-xl text-gray-300'>
              A showcase of selected work spanning web development, mobile apps, 3D graphics, fintech, and wireless networks
            </p>
          </header>

          <div class='projects-grid grid grid-cols-1 md:grid-cols-2 gap-6'>
            {this.projects.map((project) => (
              <div class='project-card' key={project.id}>
                <div class='card-header'>
                  <div class='flex items-center justify-between'>
                    <span class={`category-badge ${this.getCategoryColor(project.category)}`}>
                      <span class='material-symbols-sharp'>{this.getCategoryIcon(project.category)}</span>
                      <span class='ml-2'>{project.category.toUpperCase()}</span>
                    </span>
                    <span class='text-gray-400 text-sm'>{project.year}</span>
                  </div>
                  <h2 class='text-2xl font-bold mt-4 mb-2 text-blue-300'>{project.title}</h2>
                </div>

                <div class='card-body'>
                  <p class='text-gray-300 mb-4'>{project.description}</p>

                  <div class='mb-4'>
                    <h3 class='text-sm font-semibold text-green-400 mb-2'>Key Highlights:</h3>
                    <ul class='list-disc list-inside text-gray-300 text-sm space-y-1'>
                      {project.highlights.map((highlight) => (
                        <li>{highlight}</li>
                      ))}
                    </ul>
                  </div>

                  <div class='mb-4'>
                    <h3 class='text-sm font-semibold text-green-400 mb-2'>Technologies:</h3>
                    <div class='flex flex-wrap gap-2'>
                      {project.technologies.map((tech) => (
                        <span class='tech-tag'>{tech}</span>
                      ))}
                    </div>
                  </div>

                  {project.link && (
                    <a href={project.link} target='_blank' rel='noopener noreferrer' class='project-link'>
                      <span>View Project</span>
                      <span class='material-symbols-sharp'>arrow_forward</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div class='mt-16 text-center'>
            <div class='inline-block bg-gray-800 bg-opacity-50 border border-blue-400 rounded-lg p-6'>
              <h3 class='text-2xl font-bold mb-3 text-blue-300'>Interested in collaborating?</h3>
              <p class='text-gray-300 mb-4'>
                I'm always open to discussing new projects and opportunities.
              </p>
              <simple-link link='/contact-me' class='inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors'>
                Get in Touch
              </simple-link>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
