import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import tailwind, { tailwindHMR } from 'stencil-tailwind-plugin';
// import tailwindcss from 'tailwindcss';
// import { defaultExtractor } from 'tailwindcss/lib/lib/defaultExtractor';
 import tailwindConf from './tailwind.config.js';
// import purgecss from '@fullhuman/postcss-purgecss';
// import autoprefixer from 'autoprefixer';

export const config: Config = {
  globalStyle: 'src/global/app.css',
  globalScript: 'src/global/app.ts',
  taskQueue: 'async',
  outputTargets: [
    {
      type: 'www',
      // comment the following line to disable service workers in production
      serviceWorker: null,
      // baseUrl: 'https://myapp.local/',
    },
  ],
  plugins: [
    sass(),
    tailwind(
      {
        tailwindConf,
      }
      // {
      //
      // postcss: {
      //   plugins: [
      //     tailwindcss(),
      //     purgecss({
      //       content: ['./**/*.tsx'],
      //       safelist: [
      //         ':root',
      //         ':host',
      //         ':shadow',
      //         '/deep/',
      //         '::part',
      //         '::theme'
      //       ],
      //       defaultExtractor
      //     }),
      //     autoprefixer(),
      //   ]
      // }
    // }
    ),
    tailwindHMR(),
  ],
  devServer: {
    reloadStrategy: 'pageReload',
  },
};

