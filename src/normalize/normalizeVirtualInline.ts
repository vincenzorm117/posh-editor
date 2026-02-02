import createVirtualInline from '@/createVirtualNodes/createVirtualInline';
import normalizeVirtualMarks from './normalizeVirtualMarks';

const normalizeVirtualInline = (inline: VirtualInline): VirtualInline => {
  return createVirtualInline(inline.text, normalizeVirtualMarks(inline.marks));
};

export default normalizeVirtualInline;
