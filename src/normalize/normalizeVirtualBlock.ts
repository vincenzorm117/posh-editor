import createVirtualInline from '@/createVirtualNodes/createVirtualInline';
import normalizeVirtualInline from './normalizeVirtualInline';
import mergeInlinesWithSameMarks from '@utils/mergeInlinesWithSameMarks';

const normalizeVirtualBlock = (block: VirtualBlock): VirtualBlock => {
  let inlines = block.inlines.map(normalizeVirtualInline);
  inlines = mergeInlinesWithSameMarks(inlines);
  inlines = inlines.filter((inline) => inline.text.length > 0);

  if (inlines.length <= 0) {
    inlines.push(createVirtualInline('', {}));
  }

  return {
    ...block,
    inlines,
  } as VirtualBlock;
};

export default normalizeVirtualBlock;
