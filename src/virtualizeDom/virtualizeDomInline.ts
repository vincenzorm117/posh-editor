import createVirtualInline from '@/createVirtualNodes/createVirtualInline';
import isBreakElement from '@/helpers/isBreakElement';
import isElementNode from '@/helpers/isElementNode';
import isTextNode from '@/helpers/isTextNode';
import determineMarksFromNode from '@utils/determineMarksFromNode';

const virtualizeInline = (node: Node, root: HTMLElement) => {
  if (!node) {
    throw new Error('Node is required for virtualizeInline');
  }

  if (isTextNode(node)) {
    return createVirtualInline(
      node.textContent ?? '',
      determineMarksFromNode(node, root),
    );
  }

  if (!isElementNode(node)) {
    throw new Error(
      'Node must be an element or text node for virtualizeInline',
    );
  }

  if (isBreakElement(node)) {
    return createVirtualInline('\n', {});
  }

  return createVirtualInline(
    node.textContent ?? '',
    determineMarksFromNode(node, root),
  );
};

export default virtualizeInline;
