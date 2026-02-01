import getVirtualSelectionMarks from '../2_virtual/getVirtualSelectionMarks';
import { CHAR_ZERO_WIDTH_SPACE } from '../constants';
import { domIsSelectionInEditor } from '../0_dom/domIsSelectionInEditor';
import { clamp } from '../helpers/clamp';

function domNextNodeWithinRoot(root: Node, node: Node | null): Node | null {
  if (!node) return null;
  if (node.firstChild) return node.firstChild;
  while (node && node !== root) {
    if (node.nextSibling) return node.nextSibling;
    node = node.parentNode;
  }
  return null;
}

function domNextLeafWithinRoot(root: HTMLElement, node: Node): Node | null {
  let n = node as Node | null;
  while ((n = domNextNodeWithinRoot(root, n))) {
    if (n === null) return null;
    if (n.nodeType === Node.TEXT_NODE) return n;
    if (n.nodeType === Node.ELEMENT_NODE && (n as HTMLElement).tagName === 'BR')
      return n;
  }
  return null;
}

function domFirstLeaf(node: Node): Node | null {
  // If node is null, return null
  if (!node) return null;
  // If text node, return node
  if (node.nodeType === Node.TEXT_NODE) return node;
  // TODO: this case would never fire, consider removing
  // If BR element node, return node
  if (
    node.nodeType === Node.ELEMENT_NODE &&
    (node as HTMLElement).tagName === 'BR'
  )
    return node;

  // TODO: convert to iterative to avoid deep recursion
  // Check children recursively for first leaf
  for (const child of Array.from(node.childNodes)) {
    const leaf = domFirstLeaf(child);
    if (leaf) return leaf;
  }
  // If no leaf found, return null
  return null;
}

function domNextLeafPoint(
  root: HTMLElement,
  node: Node,
  offset: number,
): DomPoint | null {
  if (!node) return null;

  // If text node, return its info
  if (node.nodeType === Node.TEXT_NODE) {
    return { node, offset };
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    throw new Error(`Unexpected node type "${node.nodeType}"`);
  }

  const element = node as HTMLElement;
  // TODO: this case would never fire, consider removing
  // If br html element, return as text node with offset 0
  if (element.tagName === 'BR') {
    return { node, offset: 0 };
  }

  const child = element.childNodes[offset];
  if (child) {
    let firstLeaf;
    // Get first leaf of child at offset if it exists
    firstLeaf = domFirstLeaf(child);
    if (firstLeaf) {
      return { node: firstLeaf, offset: 0 };
    }
    // Else, find next leaf within root
    const nextLeaf = domNextLeafWithinRoot(root, child);
    if (nextLeaf) {
      return { node: nextLeaf, offset: 0 };
    }
  }
  // Else, find next leaf within root
  const nextLeaf = domNextLeafWithinRoot(root, element);
  if (nextLeaf) {
    return { node: nextLeaf, offset: 0 };
  }
  // If no leaf found, return null
  return null;
}

function domPrevNodeWithinRoot(root: Node, node: Node | null): Node | null {
  if (!node) return null;
  if (node.previousSibling) {
    node = node.previousSibling;
    // Go to the deepest last child
    while (node.lastChild) {
      node = node.lastChild;
    }
    return node;
  }
  if (node.parentNode && node.parentNode !== root) {
    return node.parentNode;
  }
  return null;
}

function domPrevLeafWithinRoot(root: HTMLElement, node: Node): Node | null {
  let n = node as Node | null;
  while ((n = domPrevNodeWithinRoot(root, n))) {
    if (n === null) return null;
    if (n.nodeType === Node.TEXT_NODE) return n;
    if (n.nodeType === Node.ELEMENT_NODE && (n as HTMLElement).tagName === 'BR')
      return n;
  }
  return null;
}

function domLastLeaf(node: Node): Node | null {
  // If node is null, return null
  if (!node) return null;
  // If text node, return node
  if (node.nodeType === Node.TEXT_NODE) return node;
  // TODO: this case would never fire, consider removing
  // If BR element node, return node
  if (
    node.nodeType === Node.ELEMENT_NODE &&
    (node as HTMLElement).tagName === 'BR'
  )
    return node;

  // Check children recursively for last leaf
  for (let i = node.childNodes.length - 1; i >= 0; i--) {
    const child = node.childNodes[i];
    const leaf = domLastLeaf(child);
    if (leaf) return leaf;
  }
  // If no leaf found, return null
  return null;
}

function domPrevLeafPoint(
  root: HTMLElement,
  node: Node,
  offset: number,
): DomPoint | null {
  if (!node) return null;

  // If text node, return its info
  if (node.nodeType === Node.TEXT_NODE) {
    return { node, offset };
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    throw new Error(`Unexpected node type "${node.nodeType}"`);
  }

  const element = node as HTMLElement;
  // TODO: this case would never fire, consider removing
  // If br html element, return as text node with offset 0
  if (element.tagName === 'BR') {
    return { node, offset: 0 };
  }

  const child = element.childNodes[offset - 1];
  if (child) {
    let lastleaf;
    // Get last leaf of child at offset if it exists
    lastleaf = domLastLeaf(child);
    if (lastleaf) {
      return { node: lastleaf, offset: (lastleaf.textContent ?? '').length };
    }
    // Else, find previous leaf within root
    const prevLeaf = domPrevLeafWithinRoot(root, child);
    if (prevLeaf) {
      return {
        node: prevLeaf,
        offset: (prevLeaf.textContent ?? '').length,
      };
    }
  }
  // Else, find previous leaf within root
  const prevLeaf = domPrevLeafWithinRoot(root, element);
  if (prevLeaf) {
    return { node: prevLeaf, offset: (prevLeaf.textContent ?? '').length };
  }
  // If no leaf found, return null
  return null;
}

function leafLength(leaf: Node): number {
  if (!leaf) return 0;
  if (leaf.nodeType === Node.TEXT_NODE) {
    const text = leaf.textContent ?? '';
    return text == CHAR_ZERO_WIDTH_SPACE ? 0 : text.length;
  }
  if (
    leaf.nodeType === Node.ELEMENT_NODE &&
    (leaf as HTMLElement).tagName === 'BR'
  ) {
    return 1;
  }
  // TODO: didn't include the leaf.nodeType === Node.ELEMENT_NODE case in original, consider removing everywhere and rely on domIsValidDocument more

  return 0;
}

function domLeafPointToVirtualOffset(
  root: HTMLElement,
  point: DomPoint,
): number {
  // Get blocks that are element nodes or non-empty text nodes
  const blocks = Array.from(root.childNodes).filter(
    (n) =>
      n.nodeType === Node.ELEMENT_NODE ||
      (n.nodeType === Node.TEXT_NODE && n?.nodeValue?.trim() !== ''),
  );

  let virtualOffset = 0;

  for (const block of blocks) {
    // Get walker for text nodes and br elements within block
    const walker = document.createTreeWalker(
      block,
      NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
      {
        acceptNode: (node: Node) => {
          return node.nodeType === Node.TEXT_NODE ||
            (node.nodeType === Node.ELEMENT_NODE &&
              (node as HTMLElement).tagName === 'BR')
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP;
        },
      },
    );

    let n = walker.nextNode();
    while (n) {
      if (n == point.node) {
        // If text node
        if (n.nodeType === Node.TEXT_NODE) {
          const text = n.textContent ?? '';
          // If zero-width space, return current virtual offset
          if (text == CHAR_ZERO_WIDTH_SPACE) {
            return virtualOffset;
          } else {
            // Else, return clamped offset within text length
            return virtualOffset + clamp(point.offset, 0, text.length);
          }
        }
        // If br element
        return virtualOffset;
      }
      virtualOffset += leafLength(n);
      n = walker.nextNode();
    }

    // For the new line between blocks
    virtualOffset += 1;
  }

  // If point not found, return max offset
  return Math.max(0, virtualOffset - 1);
}

export function virtualizeSelection(state: State): VirtualSelection {
  const selection = window.getSelection();

  if (!domIsSelectionInEditor(selection!, state.editor.element)) {
    return { isInsideEditor: false } as VirtualSelection;
  }

  const editorElement = state.editor.element;

  // Check if anchor is equal to focus
  if (
    selection!.anchorNode === selection!.focusNode &&
    selection!.anchorOffset === selection!.focusOffset
  ) {
    const caretLeaf = domNextLeafPoint(
      editorElement,
      selection!.anchorNode as Node,
      selection!.anchorOffset,
    );

    if (!caretLeaf) {
      return { isInsideEditor: false } as VirtualSelection;
    }

    const caretNode = domLeafPointToVirtualOffset(editorElement, caretLeaf);
    const vSel = {
      anchor: caretNode,
      focus: caretNode,
      isCollapsed: true,
      isInsideEditor: true,
      direction: 'none',
    } as VirtualSelection;

    vSel.marks = getVirtualSelectionMarks({
      ...state,
      virtualSelection: vSel as VirtualSelection,
    });

    return vSel;
  }

  const anchorLeaf = domNextLeafPoint(
    editorElement,
    selection!.anchorNode as Node,
    selection!.anchorOffset,
  );

  const focusLeaf = domPrevLeafPoint(
    editorElement,
    selection!.focusNode as Node,
    selection!.focusOffset,
  );

  if (!anchorLeaf || !focusLeaf) {
    return { isInsideEditor: false } as VirtualSelection;
  }

  const anchor = domLeafPointToVirtualOffset(editorElement, anchorLeaf);
  const focus = domLeafPointToVirtualOffset(editorElement, focusLeaf);

  const vSel = {
    anchor: anchor,
    focus: focus,
    isCollapsed: false,
    isInsideEditor: true,
    direction: anchor < focus ? 'forward' : 'backward',
  } as VirtualSelection;

  vSel.marks = getVirtualSelectionMarks({
    ...state,
    virtualSelection: vSel as VirtualSelection,
  });

  return vSel;
}
