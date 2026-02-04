import isBreakElement from '@/helpers/isBreakElement';
import isTextNode from '@/helpers/isTextNode';

const virtualPointToDomPoint = (
  point: number,
  root: HTMLElement,
  vIndex: VirtualDocumentIndex,
): { node: Node; offset: number } | null => {
  // Get block containing the point
  const block = vIndex.blocks.find(
    ({ globalStart, length }) =>
      globalStart <= point && point < globalStart + length,
  );
  // TODO: might want to return something, need to test to see what behavior we want
  // If no block found, return null
  if (!block) return null;
  // Get inline within the block containing the point
  const inline = (block?.inlines ?? []).find(
    ({ globalStart, length }) =>
      globalStart <= point && point < globalStart + length,
  );
  // TODO: might want to return something, need to test to see what behavior we want
  // If no inline found, return null
  if (!inline) return null;
  // Calculate offset within the inline
  const offset = point - inline.globalStart;
  // Get node
  const domBlock = root.childNodes[inline.blockIndex];
  const domInline = domBlock.childNodes[inline.inlineIndex];
  // Drill until we find the first text node
  let node = domInline as Node | null;
  while (node != null && !isTextNode(node) && !isBreakElement(node)) {
    node = node.firstChild;
  }
  // If node is null, return null
  if (node == null) return null;
  // Return DOM point
  return { offset, node };
};

export default virtualPointToDomPoint;
