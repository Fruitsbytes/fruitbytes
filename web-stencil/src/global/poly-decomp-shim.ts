/**
 * Matter.js poly-decomp compatibility shim
 *
 * Matter.js requires the `decomp` library to be available on the window object
 * for concave polygon collision detection. We use poly-decomp-es (ES6 compatible)
 * instead of the legacy poly-decomp package.
 *
 * This shim must be imported FIRST in global/app.ts before Matter.js is used.
 */

import * as decomp from 'poly-decomp-es';

if (typeof window !== 'undefined') {
  (window as any).decomp = decomp;
}
