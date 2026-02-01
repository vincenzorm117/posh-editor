import normalizeVirtualDocument from './normalize/normalizeVirtualDocument';
import virtualizeDomDocument from './virtualizeDom/virtualizeDomDocument';

const init = (editorSelector: string) => {
  const state = {} as VirtualState;

  const editorElement = document.querySelector(editorSelector) as HTMLElement;
  if (!editorElement) {
    throw new Error(`Element matching selector "${editorSelector}" not found.`);
  }

  // Get the editor element
  state.editor.selector = editorSelector;
  state.editor.element = editorElement!;

  // Virtualize the DOM and then Normalize it
  state.vDoc = virtualizeDomDocument(editorElement);
  state.vDoc = normalizeVirtualDocument(state.vDoc);

  // Virtualize the Selection

  return state;
};

export default init;
