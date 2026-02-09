import removeTextWithSelection from '../removeTextWithSelection';
import insertParagraphWithoutSelection from './insertParagraphWithoutSelection';

const insertParagraphWithSelection = (vState: VirtualState) => {
  if (!vState.vSel.isInEditor) {
    return;
  }

  removeTextWithSelection(
    vState.vDoc,
    vState.vSel as VirtualSelectionInEditor,
    vState.vIndex,
  );

  insertParagraphWithoutSelection(vState);
};

export default insertParagraphWithSelection;
