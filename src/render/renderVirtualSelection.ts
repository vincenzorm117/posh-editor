import virtualPointToDomPoint from './virtualPointToDomPoint';

const renderVirtualSelection = (vState: VirtualState) => {
  const { vSel, editor, vIndex } = vState;

  if (!vSel.isInEditor) return null;

  const selection = window.getSelection();
  if (!selection) return null;

  const anchor = virtualPointToDomPoint(vSel.start, editor.element, vIndex);
  const focus = virtualPointToDomPoint(vSel.end, editor.element, vIndex);

  if (!anchor || !focus) return null;

  selection.removeAllRanges();
  selection.setBaseAndExtent(
    anchor.node,
    anchor.offset,
    focus.node,
    focus.offset,
  );
};

export default renderVirtualSelection;
