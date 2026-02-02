const isSelectionInDomDocument = (
  sel: Selection,
  element: HTMLElement,
): boolean => {
  if (!(sel instanceof Selection && element instanceof Node)) {
    throw new Error(
      'Invalid arguments: sel must be a Selection and element must be a Node',
    );
  }

  return element.contains(sel.anchorNode) && element.contains(sel.focusNode);
};

export default isSelectionInDomDocument;
