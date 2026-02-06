import createVirtualBlock from '@/createVirtualNodes/createVirtualBlock';
import createVirtualInline from '@/createVirtualNodes/createVirtualInline';
import virtualizeDomInline from './virtualizeDomInline';
import createTextBrWalkerArray from '@/helpers/createTextBrWalkerArray';
import isTextNode from '@/helpers/isTextNode';
import isElementNode from '@/helpers/isElementNode';
import isBreakElement from '@/helpers/isBreakElement';

const virtualizeBlock = (
  node: Node,
  root: HTMLElement,
  actions: Record<string, VirtualAction>,
): VirtualBlock => {
  if (!node) {
    throw new Error('Node is required for virtualizeBlock');
  }

  if (isTextNode(node)) {
    return createVirtualBlock('P', [
      createVirtualInline(node.textContent ?? '', {}),
    ]);
  }

  if (!isElementNode(node)) {
    throw new Error('Node must be an element or text node for virtualizeBlock');
  }

  if (isBreakElement(node)) {
    return createVirtualBlock('P', [createVirtualInline('\n', {})]);
  }

  // For element nodes, process child nodes
  const nodes = createTextBrWalkerArray(node);

  return createVirtualBlock(
    'P',
    nodes.map((x) => virtualizeDomInline(x, root, actions)),
  );
};

export default virtualizeBlock;
