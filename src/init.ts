import actionBold from './action-bold';
import actionHeading from './action-heading';
import actionItalics from './action-italics';
import actionStrikethrough from './action-strikethrough';
import actionUnderline from './action-underline';
import isFunction from './helpers/isFunction';
import noop from './helpers/noop';
import runFn from './helpers/runFn';
import inputText from './inputs/inputText';
import insertParagraph from './inputs/insertParagraph';
import removeText from './inputs/removeText';
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

  // TODO: setup a registerAction function
  // Initialize actions
  const actions = {
    bold: actionBold,
    italics: actionItalics,
    underline: actionUnderline,
    strikethrough: actionStrikethrough,
    heading: actionHeading,
  } as Record<string, VirtualAction>;

  // Setup hooks
  const hooks = {} as any;
  hooks.preRender = isFunction(options?.hooks?.preRender)
    ? options.hooks.preRender!
    : noop;
  hooks.postRender = isFunction(options?.hooks?.postRender)
    ? options.hooks.postRender!
    : noop;
  hooks.preSelection = isFunction(options?.hooks?.preSelection)
    ? options.hooks.preSelection!
    : noop;
  hooks.postSelection = isFunction(options?.hooks?.postSelection)
    ? options.hooks.postSelection!
    : noop;

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
    hooks,
  } as VirtualState;

  // Listener: Selection Change
  document.addEventListener('selectionchange', () => {
    runFn(hooks.preSelection, vState);
    vState.vSel = virtualizeSelection(
      vState.editor.element,
      vState.vDoc,
      vState.vIndex,
      vState.actions,
    );
    runFn(hooks.postSelection, vState);
  });

  // Listener: Keydown
  document.addEventListener('keydown', (event) => {
    // Placeholder for keydown handling logic
    // Keyboard shortcut (Ctrl/Cmd + B)
    if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
      event.preventDefault();
      vState.actions.bold.apply!(vState);
    }

    // Keyboard shortcut (Ctrl/Cmd + I)
    if ((event.ctrlKey || event.metaKey) && event.key === 'i') {
      event.preventDefault();
      vState.actions.italics.apply!(vState);
    }

    // Keyboard shortcut (Ctrl/Cmd + U)
    if ((event.ctrlKey || event.metaKey) && event.key === 'u') {
      event.preventDefault();
      vState.actions.underline.apply!(vState);
    }

    // Keyboard shortcut (Ctrl/Cmd + Shift + X) for strikethrough
    if (
      (event.ctrlKey || event.metaKey) &&
      event.shiftKey &&
      event.key === 'X'
    ) {
      event.preventDefault();
      vState.actions.strikethrough.apply!(vState);
    }
  });

  // Listener: Input
  editorElement.addEventListener('input', (event: Event) => {
    event.preventDefault();
    if (!vState.vSel.isInEditor) {
      throw new Error('[Unexpected Selection] Selection is not in editor');
    }

    const { inputType, data } = event as InputEvent;
    switch (inputType) {
      case 'insertText':
        inputText(vState, data);
        break;
      case 'deleteByCut':
      case 'deleteContentBackward':
        removeText(vState);
        break;
      case 'deleteContentForward':
        // TODO implement
        break;
      case 'insertParagraph':
        insertParagraph(vState);
        break;
      case 'insertFromPaste':
        // TODO implement
        break;
      default:
        console.log((event as InputEvent).inputType);
        break;
    }

    vState.vDoc = normalizeVirtualDocument(vState.vDoc);
    // vState.vDoc = virtualizeDomDocument(vState.editor.element, actions);
    vState.vIndex = createVirtualDocumentIndex(vState.vDoc);
    // vState.vSel = virtualizeSelection(
    //   vState.editor.element,
    //   vState.vDoc,
    //   vState.vIndex,
    //   vState.actions,
    // );

    render(vState);
  });

  render(vState);

  return vState;
};

export default init;
