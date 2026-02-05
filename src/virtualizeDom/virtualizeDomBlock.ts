import createVirtualBlock from '@/createVirtualNodes/createVirtualBlock';
import createVirtualInline from '@/createVirtualNodes/createVirtualInline';
import virtualizeDomInline from './virtualizeDomInline';
import createTextBrWalkerArray from '@/helpers/createTextBrWalkerArray';
import isTextNode from '@/helpers/isTextNode';

const virtualizeBlock = (node: Node, root: HTMLElement): VirtualBlock => {
  if (!node) {
    throw new Error('Node is required for virtualizeBlock');
  }

  if (isTextNode(node)) {
    return createVirtualBlock('P', [
      createVirtualInline(node.textContent ?? '', {}),
    ]);
  }

  if (node.nodeType != Node.ELEMENT_NODE) {
    throw new Error('Node must be an element or text node for virtualizeBlock');
  }

  if (node.nodeName == 'BR') {
    return createVirtualBlock('P', [createVirtualInline('\n', {})]);
  }

  // For element nodes, process child nodes
  const nodes = createTextBrWalkerArray(node);

  return createVirtualBlock(
    'P',
    nodes.map((x) => virtualizeDomInline(x, root)),
  );
};

export default virtualizeBlock;
