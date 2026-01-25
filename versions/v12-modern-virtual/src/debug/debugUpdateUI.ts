import debugRenderVirtualDocument from "./debugRenderVirtualDocument";

const updateUI = (state: State) => {
  document.getElementById('cell-in-editor')!.innerText = state.virtualSelection
    ?.isInsideEditor
    ? '✅'
    : '❌';
  document.getElementById('cell-is-collapsed')!.innerText = state
    .virtualSelection?.isCollapsed
    ? '✅'
    : '❌';
  document.getElementById('cell-anchor')!.innerText =
    String(state.virtualSelection.anchor) || 'N/A';
  document.getElementById('cell-focus')!.innerText =
    String(state.virtualSelection.focus) || 'N/A';

  // New: write formatted virtual document JSON
  const virtualDocEl = document.getElementById('virtual-document-json')!;
  virtualDocEl.textContent = debugRenderVirtualDocument(state)
};

export default updateUI;
