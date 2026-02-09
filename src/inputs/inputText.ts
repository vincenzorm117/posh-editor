import inputTextWithoutSelection from './inputTextWithoutSelection';
import inputTextWithSelection from './inputTextWithSelection';

const inputText = (
  vDoc: VirtualDocument,
  vSel: VirtualSelectionInEditor,
  vIndex: VirtualDocumentIndex,
  text: string,
) => {
  if (vSel.isCollapsed) {
    inputTextWithoutSelection(vDoc, vSel, vIndex, text);
  } else {
    inputTextWithSelection(vDoc, vSel, vIndex, text);
  }
};

export default inputText;
