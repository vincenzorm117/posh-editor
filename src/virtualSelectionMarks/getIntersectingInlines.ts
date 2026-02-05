import overlap from '@/helpers/overlap';

const getIntersectingInlines = (
  vSel: { start: number; end: number },
  blocks: Array<[number, VirtualBlock]>,
  vIndex: VirtualDocumentIndex,
): VirtualInline[] => {
  return blocks
    .map(([index, block]) => {
      const virtualBlockIndex = vIndex.blocks[index];

      return block.inlines.filter((_, i) => {
        return overlap(vSel, virtualBlockIndex.inlines[i]) > 0;
      });
    })
    .flat();
};

export default getIntersectingInlines;
