import hasMarks from '@/utils/hasMarks';
import createVirtualTreeText from './createVirtualTreeText';
import createVirtualTreeElement from './createVirtualTreeElement';

const createVirtualTreeNode = (inline: VirtualInline): VirtualTreeNode => {
  return hasMarks(inline)
    ? createVirtualTreeElement(inline)
    : createVirtualTreeText(inline);
};

export default createVirtualTreeNode;
