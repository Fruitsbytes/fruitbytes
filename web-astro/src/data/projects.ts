// PORT TARGET: web-stencil/src/components/gui-projects/gui-projects.tsx (lines 65-153)
// Six hardcoded projects + category → color/icon mapping.

export type ProjectCategory = 'web' | 'mobile' | '3d' | 'fintech' | 'wireless';

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  year: string;
  category: ProjectCategory;
  highlights: string[];
  link?: string;
}

export const PROJECTS: Project[] = [
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

export const CATEGORY_COLORS: Record<ProjectCategory, string> = {
  web: 'blue',
  mobile: 'green',
  '3d': 'purple',
  fintech: 'orange',
  wireless: 'cyan',
};

export const CATEGORY_ICONS: Record<ProjectCategory, string> = {
  web: 'language',
  mobile: 'smartphone',
  '3d': 'view_in_ar',
  fintech: 'account_balance',
  wireless: 'wifi',
};

export const CATEGORY_BADGE_CLASSES: Record<ProjectCategory, string> = {
  web: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  mobile: 'bg-green-500/15 text-green-300 border-green-500/30',
  '3d': 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  fintech: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  wireless: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
};
