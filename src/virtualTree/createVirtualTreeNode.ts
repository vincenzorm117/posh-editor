import hasMarks from '@/utils/hasMarks';
import createVirtualTreeElement from './createVirtualTreeElement';
import createVirtualTreeText from './createVirtualTreeText';

const createVirtualTreeNode = (
  inline: VirtualInline,
  actions: Record<string, VirtualAction>,
): VirtualTreeNode => {
  return hasMarks(inline)
    ? createVirtualTreeElement(inline, actions)
    : createVirtualTreeText(inline);
};

export default createVirtualTreeNode;
