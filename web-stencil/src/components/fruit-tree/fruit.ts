export const DEFAULT_FOLIAGE_RATIOS = { top: 0, left: 0, width: 1, height: 3/4 } as const;
export type FoliageRatio = typeof DEFAULT_FOLIAGE_RATIOS;
export type StemPoint = { x: number; y: number }
