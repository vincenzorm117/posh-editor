import createVirtualInline from '@/createVirtualNodes/createVirtualInline';
import determineMarksFromNode from '@utils/determineMarksFromNode';

const virtualizeInline = (node: Node, root: HTMLElement) => {
  if (!node) {
    throw new Error('Node is required for virtualizeInline');
  }

  if (node.nodeType == Node.TEXT_NODE) {
    return createVirtualInline(
      node.textContent ?? '',
      determineMarksFromNode(node, root),
    );
  }

  if (node.nodeType != Node.ELEMENT_NODE) {
    throw new Error(
      'Node must be an element or text node for virtualizeInline',
    );
  }

  if (node.nodeName == 'BR') {
    return createVirtualInline('\n', {});
  }

  return createVirtualInline(
    node.textContent ?? '',
    determineMarksFromNode(node, root),
  );
};

export default virtualizeInline;
