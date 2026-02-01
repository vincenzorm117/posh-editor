import debugRenderVirtualDocument from './debugRenderVirtualDocument';

const debugUpdateUI = (state: State) => {
  document.getElementById('cell-in-editor')!.innerText = state.virtualSelection
    ?.isInsideEditor
    ? 'In editor'
    : 'Out of editor';

  if (state.virtualSelection?.isInsideEditor) {
    document.getElementById('cell-is-collapsed')!.innerText = state
      .virtualSelection?.isCollapsed
      ? 'Collapsed'
      : 'Not collapsed';
    document.getElementById('cell-range')!.innerText = [
      String(state.virtualSelection.anchor ?? 'N/A') || 'N/A',
      String(state.virtualSelection.focus ?? 'N/A') || 'N/A',
    ].join(' – ');
  } else {
    document.getElementById('cell-is-collapsed')!.innerText = '';
    document.getElementById('cell-range')!.innerText = '';
  }

  document.getElementById(`cell-marks`)!.innerText = Object.entries(
    state.virtualSelection?.marks || {},
  )
    .map(([mark, isActive]) => {
      return isActive != 'false' ? mark : ``;
    })
    .join(' ');

  // New: write formatted virtual document JSON
  const virtualDocEl = document.getElementById('virtual-document-json')!;
  virtualDocEl.innerHTML = debugRenderVirtualDocument(state);
};

export default debugUpdateUI;
