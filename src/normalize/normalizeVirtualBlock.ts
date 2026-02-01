import createVirtualInline from '@/createVirtualNodes/createVirtualInline';
import normalizeVirtualInline from './normalizeVirtualInline';
import mergeInlinesWithSameMarks from '@utils/mergeInlinesWithSameMarks';

const normalizeVirtualBlock = (block: VirtualBlock): VirtualBlock => {
  let inlines = mergeInlinesWithSameMarks(block.inlines);

  inlines = inlines.filter((inline) => inline.text.length > 0);

  if (inlines.length <= 0) {
    inlines.push(createVirtualInline('', {}));
  }

  return {
    ...block,
    inlines: inlines.map(normalizeVirtualInline),
  } as VirtualBlock;
};

export default normalizeVirtualBlock;
