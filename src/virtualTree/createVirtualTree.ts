import generateId from '@/helpers/generateId';
import createVirtualTreeNode from './createVirtualTreeNode';

const createVirtualTree = (
  vDoc: VirtualDocument,
  actions: Record<string, VirtualAction>,
): VirtualTree => {
  return {
    type: 'root',
    tag: 'DIV',
    id: vDoc.id,
    props: {},
    children: vDoc.blocks.map((block) => {
      // [CASE] Handle empty block with single empty inline as <BR> for correct cursor placement
      if (block.inlines.length === 1 && block.inlines[0].text === '') {
        return {
          type: 'element',
          tag: block.tag,
          id: block.id,
          props: {},
          children: [
            {
              type: 'element',
              tag: 'BR',
              id: generateId(),
              props: {},
              children: [],
            } as VirtualTreeElement,
          ],
        };
      }

      // [DEFAULT] Handle normal block with inlines
      return {
        type: 'element',
        tag: block.tag,
        id: block.id,
        props: {},
        children: block.inlines.map((x) => createVirtualTreeNode(x, actions)),
      };
    }),
  };
};

export default createVirtualTree;
