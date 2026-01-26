import attachListenerBoldBtn from './listeners/attachListenerBoldBtn';
import attachListenerInput from './listeners/attachListenerInput';
import attachListenerKeydown from './listeners/attachListenerKeydown';
import attachListenerSelectionChange from './listeners/attachListenerSelectionChange';
import { domIsValidDocument } from './domIsValidDocument';
import render from './render/render';
import virtualBuildIndex from './virtualBuildIndex';
import virtualizeDOM from './virtualizeDOM';
import { virtualizeSelection } from './virtualizeSelection';

function init(
  editorSelector: string,
  options: Record<string, { selector: string }> = {},
): State {
  // Validate editor element
  const editorElement = document.querySelector(editorSelector) as HTMLElement;
  if (!editorElement) {
    throw new Error(`Editor element not found for selector: ${editorSelector}`);
  }

  // If invalid DOM structure, throw error
  if (!domIsValidDocument(editorElement)) {
    throw new Error(
      'Invalid DOM structure in editor of: ' + editorElement.innerHTML,
    );
  }

  const state = {
    editor: {
      selector: editorSelector,
      element: editorElement,
    },
  } as State;

  state.virtualDocument = virtualizeDOM(editorElement, {
    trimBlockWhiteSpace: true,
    shrinkConsecutiveSpaces: true,
    convertNewlinesToSpaces: true,
  });
  state.virtualSelection = virtualizeSelection(state);
  state.virtualIndex = virtualBuildIndex(state);

  attachListenerSelectionChange(state);
  attachListenerKeydown(state);
  attachListenerInput(state);

  if (options.bold) {
    attachListenerBoldBtn(state, options.bold.selector);
  }

  render(state);

  return state;
}

export default init;
