import trimVirtualBlockWhiteSpace from '../2_virtual/trimVirtualBlockWhiteSpace';
import virtualizeBlock from './virtualizeBlock';

function virtualizeDOM(
  editorElement: HTMLElement,
  options: VirtualizeOptions = {},
): VirtualDocument {
  // TODO: reexamine filtering logic
  // Filter out text nodes that are empty or only whitespace
  const nonEmptyBlockNodes = Array.from(editorElement.childNodes).filter(
    (n) => {
      return !(n.nodeType == Node.TEXT_NODE && !/\S/.test(n.textContent ?? ''));
    },
  );

  const vDoc: VirtualDocument = {
    type: 'document',
    blocks: nonEmptyBlockNodes.map((bn) => virtualizeBlock(bn, options)),
  };

  if (options.trimBlockWhiteSpace) {
    vDoc.blocks = vDoc.blocks.map(trimVirtualBlockWhiteSpace);
  }

  return vDoc;
}

export default virtualizeDOM;
