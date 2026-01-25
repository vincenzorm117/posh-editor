export function domIsValidList(listElement: HTMLElement): boolean {
  const listTags = new Set(['UL', 'OL']);

  // Check if it's an allowed list-level element
  if (!listTags.has(listElement.tagName)) {
    return false;
  }

  // Ensure childNodes are only LI elements
  for (const listItemNode of Array.from(listElement.childNodes)) {
    // Ignore white space
    if (
      listItemNode.nodeType === Node.TEXT_NODE &&
      /^\s*$/.test(listItemNode.textContent || '')
    ) {
      continue;
    }
    // If not an element node at this point, invalid
    if (listItemNode.nodeType !== Node.ELEMENT_NODE) {
      return false;
    }

    // Check if it's an LI element
    const listItemElement = listItemNode as HTMLElement;
    if (listItemElement.tagName !== 'LI') {
      return false;
    }

    // Check children of LI for valid inline content
    const inlineElements = Array.from(listItemElement.childNodes);
    for (const inlineElement of inlineElements) {
      if (!domIsValidInline(inlineElement)) {
        return false;
      }
    }
  }
  // All checks passed
  return true;
}

export function domIsValidInline(inlineNode: Node): boolean {
  const inlineTags = new Set([
    'SPAN',
    'STRONG',
    'EM',
    'U',
    'A',
    'CODE',
    'B',
    'I',
    'SUB',
    'SUP',
    'BR',
  ]);
  // Text nodes are allowed at root level
  if (inlineNode.nodeType === Node.TEXT_NODE) {
    return true;
  }
  // If not an element node at this point, invalid
  if (inlineNode.nodeType !== Node.ELEMENT_NODE) {
    return false;
  }

  const inlineElement = inlineNode as HTMLElement;

  // If br element and has no children, valid
  if (inlineElement.tagName === 'BR') {
    return inlineElement.childNodes.length === 0;
  }

  // Check if it's an allowed inline-level element
  if (!inlineTags.has(inlineElement.tagName)) {
    return false;
  }

  // TODO: switch to iterative approach
  // Check children recursively
  for (const childNode of Array.from(inlineElement.childNodes)) {
    if (!domIsValidInline(childNode)) {
      return false;
    }
  }

  return true;
}

export function domIsValidBlock(blockNode: Node): boolean {
  const allowedBlockTags = new Set([
    'P',
    // 'H1',
    // 'H2',
    // 'H3',
    // 'H4',
    // 'H5',
    // 'H6',
    // 'UL',
    // 'OL',
    // 'LI',
    // 'BLOCKQUOTE',
    // 'PRE',
    // 'DIV',
    // 'HR',
  ]);

  // Text nodes are allowed at root level
  if (blockNode.nodeType === Node.TEXT_NODE) {
    return true;
  }
  // If not an element node at this point, invalid
  if (blockNode.nodeType !== Node.ELEMENT_NODE) {
    return false;
  }

  const blockElement = blockNode as HTMLElement;
  // Check if it's an allowed block-level element
  if (!allowedBlockTags.has(blockElement.tagName)) {
    return false;
  }

  if (blockElement.tagName === 'UL' || blockElement.tagName === 'OL') {
    return domIsValidList(blockElement);
  }

  // TODO: switch to iterative approach
  // Check for invalid nesting (e.g., block elements inside inline elements)
  for (const inlineElement of Array.from(blockElement.childNodes)) {
    if (!domIsValidInline(inlineElement)) {
      return false;
    }
  }
  // All checks passed
  return true;
}

export function domIsValidDocument(editorElement: HTMLElement): boolean {
  for (const blockNode of Array.from(editorElement.childNodes)) {
    if (!domIsValidBlock(blockNode)) {
      return false;
    }
  }
  return true;
}
