import insertParagraphWithoutSelection from './insertParagraphWithoutSelection';
import insertParagraphWithSelection from './insertParagraphWithSelection';

const insertParagraph = (vState: VirtualState) => {
  if ((vState.vSel as VirtualSelectionInEditor).isCollapsed!) {
    return insertParagraphWithoutSelection(vState);
  }
  return insertParagraphWithSelection(vState);
};

export default insertParagraph;
