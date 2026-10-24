export type TableDensity = 'comfortable' | 'compact';

/** The height of a body row by density (Figma: comfortable 48, compact 40). */
export const ROW_HEIGHT: Record<TableDensity, string> = { comfortable: 'h-12', compact: 'h-10' };
