/** The pages to show: the first, the last, the current one and its neighbors, with gaps between. */
export function pageItems(page: number, pageCount: number): (number | 'gap')[] {
  const keep = new Set([1, pageCount, page - 1, page, page + 1]);
  const out: (number | 'gap')[] = [];
  for (let p = 1; p <= pageCount; p++) {
    if (keep.has(p)) out.push(p);
    else if (out[out.length - 1] !== 'gap') out.push('gap');
  }
  return out;
}
