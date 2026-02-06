import actionBold from './action-bold';
import actionItalics from './action-italics';
import actionUnderline from './action-underline';
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

  // TODO: setup a registerAction function
  // Initialize actions
  const actions = {
    bold: actionBold,
    italics: actionItalics,
    underline: actionUnderline,
  } as Record<string, VirtualAction>;

  // Virtualize the DOM and then Normalize it
  const vDoc = virtualizeDomDocument(
    editorElement,
    actions,
    options?.parsingOptions,
  );

  // Create Virtual Index
  const vIndex = createVirtualDocumentIndex(vDoc);

  // Virtualize the Selection
  const vSel = virtualizeSelection(editorElement, vDoc, vIndex, actions);

  const vState = {
    editor: {
      selector: editorSelector,
      element: editorElement,
    },
    vDoc,
    vSel,
    vIndex,
    actions,
  } as VirtualState;

  // Listener: Selection Change
  document.addEventListener('selectionchange', () => {
    vState.vSel = virtualizeSelection(
      vState.editor.element,
      vState.vDoc,
      vState.vIndex,
      vState.actions,
    );
  });

  // Listener: Keydown
  document.addEventListener('keydown', (event) => {
    // Placeholder for keydown handling logic
    // Keyboard shortcut (Ctrl/Cmd + B)
    if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
      event.preventDefault();
      vState.actions.bold.apply(vState);
    }

    // Keyboard shortcut (Ctrl/Cmd + I)
    if ((event.ctrlKey || event.metaKey) && event.key === 'i') {
      event.preventDefault();
      vState.actions.italics.apply(vState);
    }

    // Keyboard shortcut (Ctrl/Cmd + U)
    if ((event.ctrlKey || event.metaKey) && event.key === 'u') {
      event.preventDefault();
      vState.actions.underline.apply(vState);
    }
  });

  // Listener: Input
  editorElement.addEventListener('input', (event) => {
    vState.vDoc = virtualizeDomDocument(vState.editor.element, actions);
    vState.vIndex = createVirtualDocumentIndex(vState.vDoc);
    vState.vSel = virtualizeSelection(
      vState.editor.element,
      vState.vDoc,
      vState.vIndex,
      vState.actions,
    );

    render(vState);
  });

  render(vState);

  return vState;
};

export default init;
