import isSelectionInDomDocument from '@/utils/isSelectionInDomDocument';
import getVirtualBlockTypes from '@/virtualSelectionMarks/getVirtualBlockTypes';
import getVirtualSelectionMarks from '@/virtualSelectionMarks/getVirtualSelectionMarks';
import getDomFocusLeaf from './getDomFocusLeaf';
import virtualizeDomPoint from './virtualizeDomPoint';

const virtualizeSelection = (
  root: HTMLElement,
  vDoc: VirtualDocument,
  vIndex: VirtualDocumentIndex,
  actions: Record<string, VirtualAction>,
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

  // Normalize selection to be forward to determine marks and block types
  const vSel =
    direction == 'backward'
      ? { start: end, end: start, isCollapsed, isInEditor: true }
      : { start, end, isCollapsed, isInEditor: true };

  // Determine marks in selection
  const marks = getVirtualSelectionMarks(vSel, vDoc, vIndex, actions);

  // Determine block types in selection
  const blockTypes = getVirtualBlockTypes(vSel, vDoc, vIndex, actions);

  // Detect if it is collapsed
  return {
    isInEditor: true,
    start,
    end,
    isCollapsed,
    direction,
    marks,
    blockTypes,
  } as VirtualSelectionInEditor;
};

export default virtualizeSelection;
