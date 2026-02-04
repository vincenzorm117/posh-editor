import createVirtualBlock from '@/createVirtualNodes/createVirtualBlock';
import createVirtualInline from '@/createVirtualNodes/createVirtualInline';
import createWalkerArray from '@helpers/createWalkerArray';
import virtualizeDomInline from './virtualizeDomInline';

const virtualizeBlock = (node: Node, root: HTMLElement): VirtualBlock => {
  if (!node) {
    throw new Error('Node is required for virtualizeBlock');
  }

  if (node.nodeType == Node.TEXT_NODE) {
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

  const nodes = createWalkerArray(
    node,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
    (node: Node) => {
      if (node.nodeType == Node.TEXT_NODE) return NodeFilter.FILTER_ACCEPT;
      if (node.nodeType == Node.ELEMENT_NODE && node.nodeName == 'BR')
        return NodeFilter.FILTER_ACCEPT;
      return NodeFilter.FILTER_SKIP;
    },
  );

  return createVirtualBlock(
    'P',
    nodes.map((x) => virtualizeDomInline(x, root)),
  );
};

export default virtualizeBlock;
