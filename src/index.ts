import renderDebugDocument from './debug/renderDebugDocument';
import init from './init';

document.addEventListener('DOMContentLoaded', () => {
  // Debug UI Elements
  const debugUI = document.querySelector('#virtual-document-json')!;
  const debugSelectionInfoUI = document.querySelector('#debug-select-info')!;

  const updateUI = (state: VirtualState) => {
    debugUI.innerHTML = renderDebugDocument(state);

    if (state.vSel.isInEditor) {
      debugSelectionInfoUI.innerHTML = `
        <div>Inside Editor</div>
        ${state.vSel.isCollapsed ? `<div>${state.vSel.start}</div>` : `<div>${state.vSel.start} - ${state.vSel.end}</div>`}
        <div>${Object.entries(state.vSel.marks)
          .filter(([key, value]) => (value as number) > 1)
          .map(([key]) => key)
          .join(' ')}</div>
      `;
    } else {
      debugSelectionInfoUI.innerHTML = `<div>Outside Editor</div>`;
    }
  };

  const vState = init('#editor', {
    parsingOptions: {
      trimDocWhiteSpace: true,
      shrinkConsecutiveSpaces: true,
      convertNewlinesToSpaces: true,
      removeWhiteSpaceOnlyBlocks: true,
    },
    hooks: {
      postRender: updateUI,
      postSelection: updateUI,
    },
  });

  // @ts-ignore
  window.state = vState;

  // Listener: Bold Button Click
  document.querySelector('#boldBtn')?.addEventListener('click', () => {
    vState.actions.bold.apply(vState);
  });

  // Listener: Italics Button Click
  document.querySelector('#italicsBtn')?.addEventListener('click', () => {
    vState.actions.italics.apply(vState);
  });

  // Listener: Underline Button Click
  document.querySelector('#underlineBtn')?.addEventListener('click', () => {
    vState.actions.underline.apply(vState);
  });
});
