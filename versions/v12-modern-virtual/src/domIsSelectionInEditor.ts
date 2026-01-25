export function domIsSelectionInEditor(
  sel: Selection,
  editorElement: HTMLElement,
): boolean {
  if (!sel || sel.rangeCount === 0) return false;
  return (
    editorElement.contains(sel.anchorNode) &&
    editorElement.contains(sel.focusNode)
  );
}
