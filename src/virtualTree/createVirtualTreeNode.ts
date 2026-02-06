import hasMarks from '@/utils/hasMarks';
import createVirtualTreeText from './createVirtualTreeText';
import createVirtualTreeElement from './createVirtualTreeElement';

const createVirtualTreeNode = (
  inline: VirtualInline,
  actions: Record<string, VirtualAction>,
): VirtualTreeNode => {
  return hasMarks(inline)
    ? createVirtualTreeElement(inline, actions)
    : createVirtualTreeText(inline);
};

export default createVirtualTreeNode;
