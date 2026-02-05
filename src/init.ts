import toggleBold from './action-bold/toggleBold';
import normalizeVirtualDocument from './normalize/normalizeVirtualDocument';
import render from './render/render';
import createVirtualDocumentIndex from './virtualIndex/createVirtualDocumentIndex';
import virtualizeDomDocument from './virtualizeDom/virtualizeDomDocument';
import virtualizeSelection from './virtualizeSelection/virtualizeSelection';

const init = (
  editorSelector: string,
  options?: EditorOptions,
): VirtualState => {
  const editorElement = document.querySelector(editorSelector) as HTMLElement;
  if (!editorElement) {
    throw new Error(`Element matching selector "${editorSelector}" not found.`);
  }

  // Virtualize the DOM and then Normalize it
  const vDoc = virtualizeDomDocument(editorElement, options?.parsingOptions);

  // Create Virtual Index
  const vIndex = createVirtualDocumentIndex(vDoc);

  // Virtualize the Selection
  const vSel = virtualizeSelection(editorElement, vDoc, vIndex);

  const vState = {
    editor: {
      selector: editorSelector,
      element: editorElement,
    },
    vDoc,
    vSel,
    vIndex,
  } as VirtualState;

  // Listener: Selection Change
  document.addEventListener('selectionchange', () => {
    vState.vSel = virtualizeSelection(
      vState.editor.element,
      vState.vDoc,
      vState.vIndex,
    );
  });

  // Listener: Bold Button Click
  document.querySelector('#boldBtn')?.addEventListener('click', () => {
    toggleBold(vState);
  });

  // Listener: Keydown
  document.addEventListener('keydown', (event) => {
    // Placeholder for keydown handling logic
    // Keyboard shortcut (Ctrl/Cmd + B)
    if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
      event.preventDefault();
      toggleBold(vState);
    }
  });

  // Listener: Input
  editorElement.addEventListener('input', (event) => {
    vState.vDoc = virtualizeDomDocument(vState.editor.element);
    vState.vIndex = createVirtualDocumentIndex(vState.vDoc);
    vState.vSel = virtualizeSelection(
      vState.editor.element,
      vState.vDoc,
      vState.vIndex,
    );

    render(vState);
  });

  render(vState);

  return vState;
};

export default init;
