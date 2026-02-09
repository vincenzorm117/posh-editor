import removeTextWithSelection from './removeTextWithSelection';
import removeTextWithoutSelection from './removeTextWithoutSelection';

const removeText = (
  vDoc: VirtualDocument,
  vSel: VirtualSelectionInEditor,
  vIndex: VirtualDocumentIndex,
) => {
  if (vSel.isCollapsed) {
    removeTextWithoutSelection(vDoc, vSel, vIndex);
  } else {
    removeTextWithSelection(vDoc, vSel, vIndex);
  }
};

export default removeText;
