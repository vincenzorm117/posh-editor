import isSelectionInDomDocument from '@/utils/isSelectionInDomDocument';
import getDomFocusLeaf from './getDomFocusLeaf';
import virtualizeDomPoint from './virtualizeDomPoint';
import getVirtualSelectionMarks from '@/virtualSelectionMarks/getVirtualSelectionMarks';

const virtualizeSelection = (
  root: HTMLElement,
  vDoc: VirtualDocument,
  vIndex: VirtualDocumentIndex,
): VirtualSelection => {
  const sel = window.getSelection();

  // Detect if selection in editor
  if (!sel || !isSelectionInDomDocument(sel, root)) {
    return { isInEditor: false } as VirtualSelectionOutsideEditor;
  }

  // Determine if is collapsed
  const isCollapsed =
    sel.anchorNode == sel.focusNode && sel.anchorOffset == sel.focusOffset;

  // Get leaf node selection
  const [anchorLeafNode, anchorOffset] = getDomFocusLeaf(
    root,
    sel.anchorNode,
    sel.anchorOffset,
  );

  // Virtualize anchor and focus selection
  const start = virtualizeDomPoint(root, anchorLeafNode, anchorOffset);

  // If not collapsed, get end location
  let end;
  if (!isCollapsed) {
    const [focusLeafNode, focusOffset] = getDomFocusLeaf(
      root,
      sel.focusNode,
      sel.focusOffset,
    );
    end = virtualizeDomPoint(root, focusLeafNode, focusOffset);
  } else {
    end = start;
  }

  // Determine direction
  const direction = isCollapsed ? 'none' : start < end ? 'forward' : 'backward';

  // Determine marks at selection start
  const vSel =
    direction == 'backward' ? { start: end, end: start } : { start, end };
  const marks = getVirtualSelectionMarks(vSel, vDoc, vIndex);

  // Detect if it is collapsed
  return {
    isInEditor: true,
    start,
    end,
    isCollapsed,
    direction,
    marks,
  } as VirtualSelectionInEditor;
};

export default virtualizeSelection;
