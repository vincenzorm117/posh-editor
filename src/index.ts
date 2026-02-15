import renderDebugDocument from './debug/renderDebugDocument';
import init from './init';

document.addEventListener('DOMContentLoaded', () => {
  // Debug UI Elements
  const debugUI = document.querySelector('#virtual-document-json')!;
  const debugSelectionInfoUI = document.querySelector('#debug-select-info')!;

  const updateUI = (state: VirtualState) => {
    debugUI.innerHTML = renderDebugDocument(state);

    // Update selection info UI
    if (state.vSel.isInEditor) {
      // Update the marks from selection info UI
      debugSelectionInfoUI.innerHTML = `
        <div>Inside Editor</div>
        ${state.vSel.isCollapsed ? `<div>${state.vSel.start}</div>` : `<div>${state.vSel.start} - ${state.vSel.end}</div>`}
        <div>${Object.entries(state.vSel.marks)
          .filter(([key, value]) => (value as number) > 1)
          .map(([key]) => key)
          .join(' ')}</div>
      `;

      // Update the block types from selection info UI
      debugSelectionInfoUI.innerHTML += `
        <div>${Object.entries(state.vSel.blockTypes)
          .filter(([key, value]) => value)
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
    vState.actions.bold.apply!(vState);
  });

  // Listener: Italics Button Click
  document.querySelector('#italicsBtn')?.addEventListener('click', () => {
    vState.actions.italics.apply!(vState);
  });

  // Listener: Underline Button Click
  document.querySelector('#underlineBtn')?.addEventListener('click', () => {
    vState.actions.underline.apply!(vState);
  });

  document.querySelector('#h1Btn')?.addEventListener('click', () => {
    vState.actions.heading.apply!(vState, 'H1');
  });

  document.querySelector('#h2Btn')?.addEventListener('click', () => {
    vState.actions.heading.apply!(vState, 'H2');
  });

  document.querySelector('#h3Btn')?.addEventListener('click', () => {
    vState.actions.heading.apply!(vState, 'H3');
  });

  document.querySelector('#h4Btn')?.addEventListener('click', () => {
    vState.actions.heading.apply!(vState, 'H4');
  });

  document.querySelector('#h5Btn')?.addEventListener('click', () => {
    vState.actions.heading.apply!(vState, 'H5');
  });

  document.querySelector('#h6Btn')?.addEventListener('click', () => {
    vState.actions.heading.apply!(vState, 'H6');
  });
});
