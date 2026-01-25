import virtualizeBlock from './virtualizeBlock';

function virtualizeDOM(editorElement: HTMLElement): VirtualDocument {
  // TODO: reexamine filtering logic
  // Filter out text nodes that are empty or only whitespace
  const nonEmptyBlockNodes = Array.from(editorElement.childNodes).filter(
    (n) => {
      return !(n.nodeType == Node.TEXT_NODE && !/\S/.test(n.textContent ?? ''));
    },
  );

  return {
    type: 'document',
    blocks: nonEmptyBlockNodes.map((bn) => virtualizeBlock(bn)),
  } as VirtualDocument;
}

export default virtualizeDOM;
