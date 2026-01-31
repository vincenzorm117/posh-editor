import { CHAR_ZERO_WIDTH_SPACE } from '../constants';
import domGenerateMarks from './domGenerateMarks';
import vCreateBlock from '../1_virtualize/vCreateBlock';
import vCreateInline from '../1_virtualize/vCreateInline';
import vInlinesHaveSameMarks from '../2_virtual/vInlinesHaveSameMarks';

const virtualizeBlock = (
  blockNode: Node,
  options: VirtualizeOptions = {},
): VirtualBlock => {
  // If text node, create a paragraph block and wrap text
  if (blockNode.nodeType === Node.TEXT_NODE) {
    let text = blockNode.textContent ?? '';
    return vCreateBlock('p', [vCreateInline(text, {}, options)]);
  }

  // If not an element node at this point, throw error
  if (blockNode.nodeType !== Node.ELEMENT_NODE) {
    throw new Error('Unsupported node type in editor');
  }

  const elementBlockNode = blockNode as HTMLElement;

  // Create a TreeWalker to traverse text nodes and <br> elements
  const walker = document.createTreeWalker(
    elementBlockNode,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node: Node) => {
        // If text node or br element, accept
        if (
          node.nodeType === Node.TEXT_NODE ||
          (node.nodeType === Node.ELEMENT_NODE &&
            (node as HTMLElement).tagName == 'BR')
        ) {
          return NodeFilter.FILTER_ACCEPT;
        }
        // else, skip
        return NodeFilter.FILTER_SKIP;
      },
    },
  );

  // Iterate through accepted nodes and add to block children
  const newChildren = [];
  let n;
  while ((n = walker.nextNode())) {
    // If text node, add text inline
    if (
      n.nodeType === Node.ELEMENT_NODE &&
      (n as HTMLElement).tagName === 'BR'
    ) {
      newChildren.push(vCreateInline('\n', {}, options));
    }

    // Rest of the nodes must be text nodes
    if (n.nodeType !== Node.TEXT_NODE) {
      throw new Error('Unsupported node type in virtualizeBlock');
    }

    // TODO: experiment with CHAR_ZERO_WIDTH_SPACE handling
    let text = n.textContent ?? '';
    text = text == CHAR_ZERO_WIDTH_SPACE ? '' : text;
    newChildren.push(vCreateInline(text, domGenerateMarks(n), options));
  }

  // Merge consecutive text inlines
  const mergedChildren = [] as VirtualInline[];
  for (const child of newChildren) {
    // Ignore null/undefined text
    if (!child.text) continue;
    // Keep reference to previous merged child
    const prevMergedChild = mergedChildren[mergedChildren.length - 1];
    // Combine text nodes with same marks, else add new
    if (prevMergedChild && vInlinesHaveSameMarks(prevMergedChild, child)) {
      prevMergedChild.text += child.text;
    } else {
      mergedChildren.push(child);
    }
  }

  return vCreateBlock(
    'p',
    mergedChildren.length > 0 ? mergedChildren : [vCreateInline('')],
  );
};

export default virtualizeBlock;
