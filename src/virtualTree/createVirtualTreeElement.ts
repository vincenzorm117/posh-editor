import createVirtualTreeText from './createVirtualTreeText';
import { MARK_TYPE_TO_TAG } from '@/constants';

const createVirtualTreeElement = (
  inline: VirtualInline,
  actions: Record<string, VirtualAction>,
): VirtualTreeElement => {
  return (
    // Build nested elements based on active marks
    (Object.entries(inline.marks) as VirtualMarkEntries)
      // Filter only active marks
      .filter(([, isActive]) => isActive)
      // Get only mark types
      .map(([mark]) => mark)
      // Wrap text node with marks from innermost to outermost
      .reduceRight<VirtualTreeNode>((child, mark) => {
        const markRenderer = actions[mark]?.render;
        return markRenderer(child);
      }, createVirtualTreeText(inline)) as VirtualTreeElement
  );
};

export default createVirtualTreeElement;
