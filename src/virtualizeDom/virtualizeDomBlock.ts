import createVirtualBlock from '@/createVirtualNodes/createVirtualBlock';
import createVirtualInline from '@/createVirtualNodes/createVirtualInline';
import createTextBrWalkerArray from '@/helpers/createTextBrWalkerArray';
import isBreakElement from '@/helpers/isBreakElement';
import isElementNode from '@/helpers/isElementNode';
import isTextNode from '@/helpers/isTextNode';
import virtualizeDomInline from './virtualizeDomInline';

const virtualizeBlock = (
  node: Node,
  root: HTMLElement,
  actions: Record<string, VirtualAction>,
): VirtualBlock => {
  if (!node) {
    throw new Error('Node is required for virtualizeBlock');
  }

  const nodeName = node.nodeName as VirtualBlockTag;

  if (isTextNode(node)) {
    return createVirtualBlock(nodeName, [
      createVirtualInline(node.textContent ?? '', {}),
    ]);
  }

  if (!isElementNode(node)) {
    throw new Error('Node must be an element or text node for virtualizeBlock');
  }

  if (isBreakElement(node)) {
    return createVirtualBlock(nodeName, [createVirtualInline('\n', {})]);
  }

  // For element nodes, process child nodes
  const nodes = createTextBrWalkerArray(node);

  return createVirtualBlock(
    nodeName,
    nodes.map((x) => virtualizeDomInline(x, root, actions)),
  );
};

export default virtualizeBlock;
