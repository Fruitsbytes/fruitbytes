import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import tailwind, { tailwindHMR } from 'stencil-tailwind-plugin';
import tailwindConf from './tailwind.config.js';

export const config: Config = {
  globalStyle: 'src/global/app.css',
  globalScript: 'src/global/app.ts',
  taskQueue: 'async',
  outputTargets: [
    {
      type: 'www',
      // Service Worker enabled for offline support and caching
      serviceWorker: {
        globPatterns: [
          '**/*.{js,css,json,html,png,jpg,jpeg,svg,ico,webp}'
        ],
        // Exclude heavy assets from initial caching
        globIgnores: [
          '**/sounds/**',
          '**/fonts/**/*.woff',
          '**/fonts/**/*.woff2'
        ],
        // Cache for 1 week
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'CacheFirst'
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com/,
            handler: 'CacheFirst'
          }
        ]
      },
      baseUrl: 'https://fruitsbytes.com/',
      // Copy additional SEO files
      copy: [
        { src: 'robots.txt' },
        { src: 'sitemap.xml' }
      ]
    },
  ],
  plugins: [
    sass(),
    tailwind({
      tailwindCssPath: './src/global/tailwind.css',
      tailwindConf,
    }),
    tailwindHMR(),
  ],
  devServer: {
    reloadStrategy: 'pageReload',
  },
};

